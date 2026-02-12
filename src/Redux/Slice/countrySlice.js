import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../util/Supabase/supabase";
import { fetchCountryDetails } from "../../functions/fetchCountryDetails";

// fetch specific country based on country name(Case-Insensitive)
export const fetchCountryByName = createAsyncThunk("countrySlice/fetchCountryByName",
    async (countryName, { rejectWithValue }) => {
        // console.log('Received country name in slice for fetching data', countryName);

        try {
            // Fetch from countries table
            let res = await supabase.from("countries").select("*").ilike("name", `%${countryName}%`);
            // console.log('Response for fetching country data based on country name', res);

            if (res.error) return rejectWithValue(res.error.message);

            if (res.data.length > 0) {
                // Country found in countries table
                const country = res.data[0];

                // Fetch details from country_details using country_id
                const detailsRes = await supabase.from("country_details").select("*").eq("country_id", country.id).single();
                // console.log('Response for fetching country data based on country details name', detailsRes);

                if (detailsRes.error && detailsRes.error.code !== "PGRST116") {
                    return rejectWithValue(detailsRes.error.message);
                }

                return {
                    ...country,
                    details: detailsRes.data || null,
                };
            }

            // If not found in countries, search country_details by official_name
            const detailsRes = await supabase.from("country_details").select("*").ilike("official_name", `%${countryName}%`).single();

            if (detailsRes.error && detailsRes.error.code !== "PGRST116") {
                return rejectWithValue(detailsRes.error.message);
            }

            if (!detailsRes.data) return null;

            // Fetch parent country info
            const countryRes = await supabase.from("countries").select("*").eq("id", detailsRes.data.country_id).single();

            return {
                ...countryRes.data,
                details: detailsRes.data,
            };
        } catch (err) {
            return rejectWithValue("Something went wrong");
        }
    }
)

// fetch all country action
export const fetchAllCountryList = createAsyncThunk("countrySlice/fetchAllCountryList",
    async () => {
        try {
            const res = await supabase.from('countries').select('*').order('name', { ascending: true });
            // console.log('All countries data response', res);

            return res.data;
        }
        catch (err) {
            const message = err?.message ?? "Failed to fetch user details";
            return rejectWithValue(message);
        }
    }
)

// fetch all country details action
export const fetchAllCountryDetails = createAsyncThunk("countrySlice/fetchAllCountryDetails",
    async (_, { rejectWithValue }) => {
        try {
            const resCountry = await supabase.from("countries").select("*").order("created_at", { ascending: false });
            // console.log('Response for getting all country', resCountry);

            if (resCountry?.err) throw resCountry?.err;

            const resCountryDetails = await supabase.from("country_details").select("*");
            // console.log('Response for getting country details', resCountryDetails);

            if (resCountryDetails?.err) throw resCountryDetails?.err;

            const merged = resCountry?.data.map((c) => ({
                ...c,
                country_details: resCountryDetails?.data.find((d) => d.country_id === c.id) || {},
            }));

            return merged;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
)

// change country status
export const toggleCountryStatus = createAsyncThunk('countrySlice/toggleCountryStatus',
    async ({ id, currentStatus }) => {
        // console.log('Status changable details', id, currentStatus);

        try {
            const newStatus = !currentStatus;
            const res = await supabase.from("countries").update({ is_blocked: newStatus }).eq("id", id).select().single();
            // console.log('Response for updating country status', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (err) {
            console.error("Error updating block status:", err.message);
            return null;
        }
    }
)

// upload country image in bucket
const uploadFile = async (file, country, type, folder) => {
    if (!file) return null;
    const fileExt = file?.name?.split('.')?.pop();
    const fileName = `${country}-${type}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const res = await supabase.storage.from('country').upload(filePath, file);
    // console.log('Response for uploading image in bucket', res);

    if (res?.uploadError) throw res?.uploadError;

    const { data: urlData } = supabase.storage.from('country').getPublicUrl(filePath);

    const bucketData = {
        file: { url: urlData.publicUrl },
        url: urlData.publicUrl,
        docName: res?.data?.path?.split('/')[1]
    }
    return bucketData;
};

// delete uploaded image from bucket
async function deleteFile(country_id, dbName, folder) {
    // console.log("Image deletion country I'd", country_id, " from", folder," of",dbName);

    try {
        const col_name = dbName == "countries" ? "id" : "country_id";
        // Fetch existing country images
        const { data: img, error: fetchErr } = await supabase.from(dbName).select("*").eq(col_name, country_id).single();
        // console.log('Fetched image', img,col_name);

        if (fetchErr) throw fetchErr;

        const deleted_img = folder === 'flag' ? img?.flag_name : img?.image_name;

        // delete old documents from bucket
        if (deleted_img) {
            // console.log('Deleted doc id', deleted_img,folder);

            const res = await supabase.storage.from("country").remove(`${folder}/${deleted_img}`);
            // console.log('Response for deleting doc', res);

        }

        return deleted_img;

    } catch (err) {
        console.error("Error deleting document:", err);
    }
}

// add country
export const addOrUpdateCountry = createAsyncThunk("countrySlice/addOrUpdateCountry",
    async ({ countryData, type }, { rejectWithValue }) => {
        // console.log('Received data in slice', countryData);

        try {
            let apiData = {}, flagUrl = null, countryDetailsRow = null, countryDetailsErr = null;

            // check already exist or not
            const normalizedName = countryData.name.trim().toLowerCase();
            const { data: existingCountry, error } = await supabase.from("countries").select("id").ilike("name", normalizedName).maybeSingle();

            if (error) return rejectWithValue(error.message);

            if (existingCountry && !countryData.id) {
                return rejectWithValue("Country already exists");
            }

            // check country exists in present or not
            if (countryData.name) {
                try {
                    apiData = await fetchCountryDetails(countryData.name);
                } catch (err) {
                    return rejectWithValue(`Invalid country name: ${countryData.name}`);
                }
            }

            // console.log('Country data from api', apiData);

            // Merge form data with API data (form data takes priority)
            const finalData = {
                id: countryData?.id,
                name: countryData.name.charAt(0).toUpperCase() + countryData.name.slice(1),
                description: countryData.description || "",
                imageFile: countryData.image || null,
                is_blocked: countryData.is_blocked ?? true,
                is_approved: countryData.is_approved ?? "pending",
                code: countryData?.code || apiData?.currency?.code || "",
                official_name: countryData?.official_name || apiData?.officialName,
                capital: countryData?.capital || apiData?.capital,
                continents: countryData?.continents || apiData?.continents,
                latlng: [countryData.latlng?.[0] || apiData.latlng?.[0], countryData.latlng?.[1] || apiData.latlng?.[1]],
                zoom: 5,
                area: countryData?.area || apiData?.area,
                population: countryData?.population || apiData?.population,
                flagFile: countryData?.flag_url?.[0] || null,
                languages: countryData?.languages || apiData?.languages,
                currency: { "name": countryData?.currency?.name || apiData?.currency?.name, "symbol": countryData?.currency?.symbol || apiData?.currency?.symbol, "code": countryData?.currency?.code || apiData?.currency?.code }
            };

            // console.log(typeof (finalData.imageFile), finalData.imageFile);
            // console.log("final data", finalData);

            // Upload images
            if (countryData.user_type == 'admin') {

                flagUrl = typeof (finalData.flagFile) != 'string' ? await uploadFile(finalData.flagFile, finalData.name, 'flag', "flag") : finalData.flagFile;

                if (typeof (finalData.flagFile) != 'string') {
                    deleteFile(finalData.id, "country_details", "flag");
                }
            }

            let countryImageUrl = finalData.imageFile;

            if (type == 'addCountry') {
                countryImageUrl = !finalData.imageFile?.isOld ? await uploadFile(finalData.imageFile, finalData.name, 'place', "important_place") : finalData.imageFile;
            }
            // console.log(flagUrl, countryImageUrl);

            if (type == 'addCountry' && !finalData.imageFile?.isOld) {
                deleteFile(finalData.id, "countries", "important_place");
            }

            // Upsert countries table
            const { data: countryRow, error: countryErr } = await supabase.from("countries").upsert(
                {
                    name: finalData.name,
                    description: finalData.description,
                    image: countryImageUrl,
                    image_name: type == 'addCountry' ? countryImageUrl?.docName : countryData.image_name || null,
                    image_url: type == 'addCountry' ? countryImageUrl?.url : countryData.image_url || null,
                    is_blocked: finalData.is_blocked,
                    is_approved: finalData.is_approved,
                },
                { onConflict: "name" }
            ).select().single();

            // console.log('Response for adding country', countryRow);

            if (countryErr) throw countryErr;

            if (countryData.user_type == 'admin') {
                // Upsert country_details table
                let { data: countryDetailsRow, error: countryDetailsErr } = await supabase.from("country_details").upsert(
                    [
                        {
                            country_id: countryRow?.id,
                            code: finalData.code.toUpperCase(),
                            official_name: finalData.official_name,
                            capital: finalData.capital,
                            continents: finalData.continents,
                            latlng: finalData.latlng,
                            zoom: finalData.zoom,
                            area: finalData.area,
                            population: finalData.population,
                            flag: flagUrl || null,
                            flag_url: flagUrl?.url || apiData?.flag,
                            flag_name: flagUrl?.docName || null,
                            languages: finalData.languages,
                            currency: finalData.currency,
                        },
                    ],
                    { onConflict: ["country_id"], returning: "representation" }
                );

                // console.log('Response for adding country details', countryDetailsRow);

                if (countryDetailsErr) throw countryDetailsErr;
            }

            return countryData.user_type == 'admin' ? { countryRow, countryDetailsRow } : { countryRow };

        } catch (error) {
            console.error("Error adding/updating country:", error);
            return rejectWithValue(error.message);
        }
    }
)


const initialState = {
    isAllCountryListLoading: false,
    getAllCountryList: [],
    getSpecificCountry: null,
    isAllCountryListError: null
}

export const countrySlice = createSlice({
    name: 'countrySlice',
    initialState,
    extraReducers: builder => {
        builder

            //fetch specific country based on country name
            .addCase(fetchCountryByName.pending, (state) => {
                state.isAllCountryListLoading = true;
            })
            .addCase(fetchCountryByName.fulfilled, (state, action) => {
                state.isAllCountryListLoading = false;
                state.getSpecificCountry = action.payload;
            })
            .addCase(fetchCountryByName.rejected, (state, action) => {
                state.isAllCountryListLoading = false;
                state.isAllCountryListError = action.payload;
            })

            // fetch all country reducer
            .addCase(fetchAllCountryList.pending, (state, action) => {
                state.isAllCountryListLoading = true;
            })
            .addCase(fetchAllCountryList.fulfilled, (state, action) => {
                state.isAllCountryListLoading = false;
                state.getAllCountryList = action.payload;
            })
            .addCase(fetchAllCountryList.rejected, (state, action) => {
                state.isAllCountryListLoading = false;
                state.isAllCountryListError = action.error.message;
            })

            // fetch all country details reducer
            .addCase(fetchAllCountryDetails.pending, (state, action) => {
                state.isAllCountryListLoading = true;
            })
            .addCase(fetchAllCountryDetails.fulfilled, (state, action) => {
                state.isAllCountryListLoading = false;
                state.getAllCountryList = action.payload;
            })
            .addCase(fetchAllCountryDetails.rejected, (state, action) => {
                state.isAllCountryListLoading = false;
                state.isAllCountryListError = action.error.message;
            })

            // change country status
            .addCase(toggleCountryStatus.pending, (state) => {
                state.isAllCountryListLoading = true;
            })
            .addCase(toggleCountryStatus.fulfilled, (state, action) => {
                state.isAllCountryListLoading = false;
                state.getAllCountryList = state.getAllCountryList.map((u) =>
                    u.id === action.payload.id ? { ...u, ...action.payload } : u);
                state.isAllCountryListError = null;
            })
            .addCase(toggleCountryStatus.rejected, (state, action) => {
                state.isAllCountryListLoading = false;
                state.isAllCountryListError = action.payload || action.error.message;
            })

            // add country
            .addCase(addOrUpdateCountry.pending, (state) => {
                state.isAllCountryListLoading = true;
            })
            .addCase(addOrUpdateCountry.fulfilled, (state, action) => {
                state.isAllCountryListLoading = false;
                state.getAllCountryList.push(action.payload);
            })
            .addCase(addOrUpdateCountry.rejected, (state, action) => {
                state.isAllCountryListLoading = false;
                state.isAllCountryListError = action.payload;
            });
    }
})

export default countrySlice.reducer;