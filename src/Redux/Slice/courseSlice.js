import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../util/Supabase/supabase";

// fetch all course slice
export const fetchAllCourses = createAsyncThunk("courseSlice/fetchAllCourses",
    async ({ filter } = {}, { rejectWithValue }) => {
        try {
            let query = supabase.from("courses").select(`*, course_content (*)`).order("created_at", { ascending: false });

            if (filter === "active") query = query.eq("is_blocked", false);
            else if (filter === "inactive") query = query.eq("is_blocked", true);

            const res = await query;
            // console.log('Response for fetching all course', res);

            if (res?.error) return rejectWithValue(res?.error.message);

            return { courses: res?.data, total: res?.data.length };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// fatch single course slice 
export const fetchCourseById = createAsyncThunk("courseSlice/fetchCourseById",
    async (courseId, { rejectWithValue }) => {
        // console.log('Received data for fetching course details for specific id', courseId);

        try {
            const res = await supabase.from("courses").select(`*, course_content (*)`).eq("id", courseId).single();
            // console.log('Response for fetching specific course', res);

            if (res?.error) return rejectWithValue(res?.error.message);
            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// upload file to bucket 
async function uploadFile(file, bucket, folder = "") {
    if (!file) return null;

    const fileName = `${Date.now()}_${file.name}`;
    const path = folder ? `${folder}/${fileName}` : fileName;

    const { error } = await supabase.storage.from(bucket)
        .upload(path, file, {
            cacheControl: "3600",
            upsert: true,
        });

    if (error) throw error;

    const { data, error: urlError } = supabase.storage.from(bucket).getPublicUrl(path);

    if (urlError) throw urlError;

    return data.publicUrl;
}

// add course slice 
export const addCourse = createAsyncThunk("courseSlice/addCourse",
    async ({ course, content, files }, { rejectWithValue }) => {
        // console.log('Received data for adding new course slice', course, content, files);

        try {
            if (!files?.thumbnail) {
                throw new Error("Course thumbnail is required");
            }

            const thumbnailUrl = await uploadFile(
                files.thumbnail,
                "course/course-thumbnails"
            );

            if (!thumbnailUrl) {
                throw new Error("Failed to upload course thumbnail");
            }

            course.img_url = thumbnailUrl;

            // Video
            content.video = content.video || {};

            if (files?.video) {
                content.video.video_url = await uploadFile(
                    files.video,
                    "course/course-videos"
                );
            }

            if (files?.videoThumbnail) {
                content.video.thumbnail_url = await uploadFile(
                    files.videoThumbnail,
                    "course/course-thumbnails"
                );
            }

            // Documents
            if (files?.documents?.length > 0) {
                for (let i = 0; i < files.documents.length; i++) {
                    const docFile = files.documents[i]?.file;
                    if (!docFile) continue;

                    content.documents[i].file_url = await uploadFile(
                        docFile,
                        "course/course-documents"
                    );
                }
            }

            // Insert Course 
            const res = await supabase.from("courses").insert(course).select().single();
            // console.log('Response for adding course details', res);

            if (res.error) throw res.error;

            // Insert Content 
            await supabase.from("course_content").insert({
                course_id: res.data.id,
                ...content,
            });

            return res.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    });

// update course slice 
export const updateCourse = createAsyncThunk("courseSlice/updateCourse",
    async ({ courseId, course, content, files, oldCourse }, { rejectWithValue }) => {
        // console.log('Received data for updating course slice', courseId, course, content, files, oldCourse);

        try {
            content.video = content.video || {};

            if (files?.thumbnail) {
                course.img_url = await uploadFile(files.thumbnail, "course/course-thumbnails");
            }
            else {
                course.img_url = oldCourse?.img_url
            }

            if (files?.video) {
                content.video.video_url = await uploadFile(files.video, "course/course-videos");
            }
            else {
                content.video.video_url = oldCourse?.course_content?.[0]?.video?.video_url
            }

            if (files?.videoThumbnail) {
                content.video.thumbnail_url = await uploadFile(files.videoThumbnail, "course/course-thumbnails");
            }
            else {
                content.video.thumbnail_url = oldCourse?.course_content?.[0]?.video?.thumbnail_url
            }

            content.documents = content.documents || oldCourse?.course_content?.[0]?.documents || [];

            if (files?.documents?.length > 0) {

                for (let i = 0,j=0; i < files.documents.length; i++) {

                    const docFileObj = files.documents[i];

                    if (docFileObj?.file) {
                        j++;
                        const file_url = await uploadFile(docFileObj.file, "course/course-documents");

                        if (content.documents[i]) {
                            content.documents[i] = { ...content.documents[i], ...docFileObj, file_url };
                        } else {
                            content.documents.push({ ...docFileObj, file_url });
                        }
                    }
                    else {
                        if (oldCourse?.course_content?.[0]?.documents[i] != null) {
                            content.documents[j] = { ...oldCourse?.course_content?.[0]?.documents[i] }
                            j++;
                        }
                    }
                }
            }

            // Update course table
            const res = await supabase.from("courses").update(course).eq("id", courseId).select().single();
            // console.log('Response for updating course slice', res);

            if (res?.error) throw res?.error;

            // Update content table
            const { error: contentError } = await supabase.from("course_content").update(content).eq("course_id", courseId);
            if (contentError) throw contentError;

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// block/unblock course slice 
export const toggleBlockCourse = createAsyncThunk("courseSlice/toggleBlockCourse",
    async ({ courseId, block }, { rejectWithValue }) => {
        // console.log('Received data for block/unblock course', courseId, block);

        try {
            const res = await supabase.from("courses").update({ status: block }).eq("id", courseId).select().single();
            // console.log('Response for block/unblock course', res);

            if (res?.error) return rejectWithValue(res?.error.message);
            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// delete course slice
export const deleteCourse = createAsyncThunk("courseSlice/deleteCourse",
    async (courseId, { rejectWithValue }) => {
        // console.log('Received data for deleting course'.courseId);

        try {
            const { error } = await supabase.from("courses").delete().eq("id", courseId);
            if (error) return rejectWithValue(error.message);
            return courseId;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);


const initialState = {
    courseList: [],
    currentCourse: null,
    isCourseLoading: false,
    hasCourseError: null,
}

export const courseSlice = createSlice({
    name: "courseSlice",
    initialState,
    reducers: {
        clearCurrentCourse: (state) => {
            state.currentCourse = null;
        },
    },
    extraReducers: (builder) => {
        builder
            /* FETCH ALL */
            .addCase(fetchAllCourses.pending, (state) => {
                state.isCourseLoading = true;
            })
            .addCase(fetchAllCourses.fulfilled, (state, action) => {
                state.isCourseLoading = false;
                state.courseList = action.payload.courses;
            })
            .addCase(fetchAllCourses.rejected, (state, action) => {
                state.isCourseLoading = false;
                state.hasCourseError = action.payload;
            })

            /* FETCH ONE */
            .addCase(fetchCourseById.pending, (state) => {
                state.isCourseLoading = true;
            })
            .addCase(fetchCourseById.fulfilled, (state, action) => {
                state.isCourseLoading = false;
                state.currentCourse = action.payload;
            })
            .addCase(fetchCourseById.rejected, (state, action) => {
                state.isCourseLoading = false;
                state.hasCourseError = action.payload;
            })

            /* ADD */
            .addCase(addCourse.pending, (state) => {
                state.isCourseLoading = true;
            })
            .addCase(addCourse.fulfilled, (state, action) => {
                state.isCourseLoading = false;
                state.courseList.unshift(action.payload);
            })
            .addCase(addCourse.rejected, (state, action) => {
                state.isCourseLoading = false;
                state.hasCourseError = action.payload;
            })

            /* UPDATE */
            .addCase(updateCourse.pending, (state, action) => {
                state.isCourseLoading = true;
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.isCourseLoading = false;
                // state.courseList = state.courseList.map((c) =>
                //     c.id === action.payload.id ? action.payload : c
                // );
                // state.currentCourse = action.payload;
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.isCourseLoading = false;
            })

            /* BLOCK/UNBLOCK */
            .addCase(toggleBlockCourse.fulfilled, (state, action) => {
                state.courseList = state.courseList.map((c) =>
                    c.id === action.payload.id ? action.payload : c
                );
                if (state.currentCourse?.id === action.payload.id)
                    state.currentCourse.is_blocked = action.payload.is_blocked;
            })

            /* DELETE */
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.courseList = state.courseList.filter((c) => c.id !== action.payload);
                if (state.currentCourse?.id === action.payload) state.currentCourse = null;
            });
    },
});

export const { clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;
