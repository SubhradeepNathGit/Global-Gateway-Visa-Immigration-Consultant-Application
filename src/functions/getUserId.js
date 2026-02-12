import supabase from "../util/Supabase/supabase";

export const getUserId = async (email) => {
    try {

        const { data, error } = await supabase.from("users").select("id").eq("email", email).maybeSingle();
        // console.log('Get Id:', data);

        if (error) throw error;

        return data?.id ?? null;
    }
    catch (error) {
        console.error("Error fetching user id:", error);
        throw error;
    }
}

export const getUserIdFromEmbassy = async (email) => {
    try {

        const { data, error } = await supabase.from("embassy").select("id").eq("email", email).maybeSingle();
        // console.log('Get Id:', data);

        if (error) throw error;

        return data?.id ?? null;
    }
    catch (error) {
        console.error("Error fetching user id:", error);
        throw error;
    }
}