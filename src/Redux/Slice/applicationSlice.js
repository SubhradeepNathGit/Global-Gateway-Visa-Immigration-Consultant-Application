import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../util/Supabase/supabase";

// delete removed additional uploaded document from bucket
async function deleteRemovedVisaDocument(applicationId, folder, payload) {
  try {
    let existingDocName = [];
    const { data, error } = await supabase.from("application_visa_details")
      .select(`document1_name,document2_name,document3_name,document4_name,document5_name`).eq("application_id", applicationId).maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      existingDocName = [
        data.document1_name,
        data.document2_name,
        data.document3_name,
        data.document4_name,
        data.document5_name,
      ].filter(Boolean);
    }
    const availableDocName = (payload?.supportingDocs || []).map(item => item?.docName).filter(Boolean);

    const deletedDocName = existingDocName.filter(x => !availableDocName.includes(x));

    if (deletedDocName.length > 0) {
      const pathsToRemove = deletedDocName.map(name => `${folder}/${name}`);
      await supabase.storage.from("documents").remove(pathsToRemove);
    }
  }
  catch (err) {
    console.log('Error occurred while deleting removed visa document:', err);
  }
}


// delete additional uploaded document from bucket
async function deleteVisaDocument(applicationId, folder, nameKey) {
  try {
    // Fetch existing application documents
    const { data: doc, error: fetchErr } = await supabase.from("application_visa_details").select(nameKey).eq("application_id", applicationId).maybeSingle();

    if (fetchErr) throw fetchErr;
    if (!doc) return null;

    const deleted_doc_name = doc[nameKey];

    // delete old documents from bucket
    if (deleted_doc_name) {
      await supabase.storage.from("documents").remove([`${folder}/${deleted_doc_name}`]);
    }

    return deleted_doc_name;

  } catch (err) {
    console.error("Error deleting document:", err);
  }
}


// delete uploaded document from bucket
async function deleteDocument(applicationId, folder) {
  try {
    // Fetch existing application documents
    const { data: doc, error: fetchErr } = await supabase.from("application_documents").select("*").eq("application_id", applicationId).maybeSingle();

    if (fetchErr) throw fetchErr;
    if (!doc) return null;

    const deleted_doc = folder === 'passport' ? doc?.passport_name : folder === 'photo' ? doc?.photo_name : doc?.bank_statement_name;

    // delete old documents from bucket
    if (deleted_doc) {
      await supabase.storage.from("documents").remove([`${folder}/${deleted_doc}`]);
    }

    return deleted_doc;

  } catch (err) {
    console.error("Error deleting document:", err);
  }
}


// add file to bucket 
async function uploadFileToBucket(folder, file) {
  // console.log('Received file', file, folder);
  try {
    if (!file) return null;

    const fileName = `${folder}/${Date.now()}_${file.name}`;

    const res = await supabase.storage.from("documents").upload(fileName, file);
    // console.log('Response after uploading doc in bucket', res);

    if (res.error) throw res.error;

    const { data: urlData } = supabase.storage.from("documents").getPublicUrl(fileName);
    // console.log('document data', res.data.path.split('/')[1]);
    // console.log('document url', urlData);

    const bucketData = {
      file: { url: urlData.publicUrl },
      url: urlData.publicUrl,
      isOld: false,
      docName: res.data.path.split('/')[1]
    }

    return bucketData;
  } catch (err) {
    console.error("Error uploading document:", err);
  }
}


// add application
export const initApplication = createAsyncThunk("applicationSlice/initApplication",
  async (application_obj) => {
    // console.log("Received application data", application_obj);

    const res = await supabase.from("applications")
      .upsert(application_obj, {
        onConflict: "id",
      })
      .select().single();

    // console.log("Response for application upsert in slice", res);

    if (res.error) throw res.error;

    return res.data.id;
  }
);


// add personal details
export const saveStepPersonal = createAsyncThunk("applicationSlice/saveStepPersonal",
  async ({ applicationId, payload }) => {
    // console.log('Received personal data for application', applicationId, payload);

    const { data: existing } = await supabase
      .from("application_personal_info")
      .select("id")
      .eq("application_id", applicationId)
      .maybeSingle();

    let res;
    if (existing) {
      res = await supabase
        .from("application_personal_info")
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();
    } else {
      res = await supabase
        .from("application_personal_info")
        .insert({ application_id: applicationId, ...payload })
        .select()
        .single();
    }

    if (res.error) throw res.error;
    return res.data;
  }
);


// add passport details
export const saveStepPassport = createAsyncThunk("applicationSlice/saveStepPassport",
  async ({ applicationId, payload }) => {
    // console.log('Received passport data for application', applicationId, payload);

    const { data: existing } = await supabase
      .from("application_passport")
      .select("id")
      .eq("application_id", applicationId)
      .maybeSingle();

    let res;
    if (existing) {
      res = await supabase
        .from("application_passport")
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();
    } else {
      res = await supabase
        .from("application_passport")
        .insert({ application_id: applicationId, ...payload })
        .select()
        .single();
    }

    if (res.error) throw res.error;
    return res.data;
  }
);


// Save visa details
export const saveVisaDetails = createAsyncThunk("applicationSlice/saveVisaDetails",
  async ({ applicationId, payload }) => {
    console.log('Received visa data for application', applicationId, payload);

    const uploadedDocs = {};

    for (let i = 1; i <= 5; i++) {
      const pathKey = `document${i}_path`;
      const nameKey = `document${i}_name`;
      const doc = payload?.supportingDocs?.[i - 1];

      if (doc && !doc.isOld) {
        // New file — delete old from bucket first, then upload
        await deleteVisaDocument(applicationId, 'additional', nameKey);

        const fileToUpload = doc.file instanceof File ? doc.file : doc.file?.file;
        if (fileToUpload) {
          const upload = await uploadFileToBucket("additional", fileToUpload);
          uploadedDocs[nameKey] = upload?.docName || null;
          uploadedDocs[pathKey] = upload?.url || null;
        } else {
          uploadedDocs[nameKey] = doc?.docName || null;
          uploadedDocs[pathKey] = doc?.url || null;
        }
      } else {
        // Old/existing file — preserve as-is
        uploadedDocs[nameKey] = doc?.docName || null;
        uploadedDocs[pathKey] = doc?.url || null;
      }
    }

    await deleteRemovedVisaDocument(applicationId, 'additional', payload);

    // Build save data — exclude visaId (camelCase column causes PGRST204 schema cache issues)
    const visaDataToSave = {
      visa_type: payload.visaType || null,
      validity: payload.validity || null,
      entry_type: payload.entry_type || null,
      purpose: payload.visaPurpose || null,
      ...uploadedDocs
    };

    // Check if record already exists — use insert or update accordingly
    const { data: existingRecord } = await supabase
      .from("application_visa_details")
      .select("id")
      .eq("application_id", applicationId)
      .maybeSingle();

    let res;
    if (existingRecord?.id) {
      res = await supabase
        .from("application_visa_details")
        .update(visaDataToSave)
        .eq("id", existingRecord.id)
        .select()
        .single();
    } else {
      res = await supabase
        .from("application_visa_details")
        .insert({ application_id: applicationId, ...visaDataToSave })
        .select()
        .single();
    }

    if (res?.error) {
      console.error("Supabase visa details save error:", res.error);
      throw res.error;
    }
    return res?.data;
  }
);


// add documents details
export const saveStepDocuments = createAsyncThunk("applicationSlice/saveStepDocuments",
  async ({ applicationId, payload }) => {
    // console.log('Received documents for application', applicationId, payload);

    let passportUpload = null;
    let photoUpload = null;
    let bankStatementUpload = null;

    // Only upload if it's a NEW file
    if (payload.passportFile && !payload.passportFile.isOld) {
      await deleteDocument(applicationId, "passport");
      passportUpload = await uploadFileToBucket("passport", payload.passportFile.file);
    }

    if (payload.photoFile && !payload.photoFile.isOld) {
      await deleteDocument(applicationId, "photo");
      photoUpload = await uploadFileToBucket("photo", payload.photoFile.file);
    }

    if (payload.bankStatementFile && !payload.bankStatementFile.isOld) {
      await deleteDocument(applicationId, "bank_statement");
      bankStatementUpload = await uploadFileToBucket("bank_statement", payload.bankStatementFile.file);
    }

    // console.log('After passport uploading data', passportUpload);
    // console.log('After photo uploading data', photoUpload);
    // console.log('After bank statement uploading data', bankStatementUpload);

    const payloadToSave = {
      passport_name: passportUpload?.docName || payload.passportFile?.docName || null,
      photo_name: photoUpload?.docName || payload.photoFile?.docName || null,
      bank_statement_name: bankStatementUpload?.docName || payload.bankStatementFile?.docName || null,
      passport_path: passportUpload?.url || payload.passportFile?.url || null,
      photo_path: photoUpload?.url || payload.photoFile?.url || null,
      bank_statement_path: bankStatementUpload?.url || payload.bankStatementFile?.url || null,
    };

    // console.log("Uploaded doc object", payloadToSave);

    // Check if record already exists to avoid 400 ON CONFLICT error
    const { data: existingDoc, error: checkErr } = await supabase
      .from("application_documents")
      .select("id")
      .eq("application_id", applicationId)
      .maybeSingle();

    let res;
    if (existingDoc) {
      res = await supabase
        .from("application_documents")
        .update(payloadToSave)
        .eq("id", existingDoc.id)
        .select();
    } else {
      res = await supabase
        .from("application_documents")
        .insert({ application_id: applicationId, ...payloadToSave })
        .select();
    }

    if (res.error) throw res.error;
    return res.data?.[0] || null;
  }
);


// add payment details
export const saveStepPayment = createAsyncThunk("applicationSlice/saveStepPayment",
  async ({ applicationId, payload }) => {
    const { data: existing } = await supabase.from("application_payment").select("id").eq("application_id", applicationId).maybeSingle();

    let res;
    if (existing?.id) {
      res = await supabase.from("application_payment").update({ ...payload, application_id: applicationId }).eq("id", existing.id);
    } else {
      res = await supabase.from("application_payment").insert([{ application_id: applicationId, ...payload }]);
    }

    if (res?.error) throw res.error;

    return payload;
  }
);


// update application state wise
export const saveStepProgress = createAsyncThunk("applicationSlice/saveStepProgress",
  async ({ applicationId, step, completedSteps, isCompleted = false, status = 'pending', applied_at = null }) => {
    // console.log('Received data for updating application steps slice', applicationId, step, completedSteps);

    const res = await supabase.from("applications").update({
      current_step: step,
      completed_steps: completedSteps,
      is_completed: isCompleted,
      status: status,
      applied_at: applied_at,
      updated_at: new Date().toISOString(),
    }).eq("id", applicationId);
    // console.log('Response for updating application steps', res);

    if (res.error) throw res.error;

    return { step, completedSteps };
  }
);


// update application status
export const updateApplicationStatus = createAsyncThunk("applicationSlice/updateApplicationStatus",
  async ({ applicationId, status, appointment_date = null, previous_appointment_date = null, rejection_reason = null, appointment_reason = null, embassy_location = null }) => {
    // console.log('Received data for updating application status', applicationId, status, appointment_reason, embassy_location);

    const res = await supabase.from("applications").update({
      status: status,
      appointment_date: appointment_date,
      previous_appointment_date: previous_appointment_date,
      rejection_reason: rejection_reason,
      appointment_reason: appointment_reason,
      embassy_location: embassy_location,
      updated_at: new Date().toISOString(),
    }).eq("id", applicationId);
    // console.log('Response for updating application status', res);

    if (res.error) throw res.error;

    return { applicationId, status };
  }
);

// update application status approve/reject
export const updateApplicationApproveReject = createAsyncThunk("applicationSlice/updateApplicationApproveReject",
  async ({ applicationId, status, approval_date = null, rejection_reason = null }) => {
    // console.log('Received data for updating application status', applicationId, status, appointment_reason, embassy_location);

    const res = await supabase.from("applications").update({
      status: status,
      approval_date: approval_date,
      rejection_reason: rejection_reason,
      updated_at: new Date().toISOString(),
    }).eq("id", applicationId);
    // console.log('Response for updating application status', res);

    if (res.error) throw res.error;

    return { applicationId, status };
  }
);


// fetch latest application 
export const getActiveApplication_specificCountry_specificUser = createAsyncThunk("applicationSlice/getActiveApplication_specificCountry_specificUser",
  async ({ country_id, user_id }, { rejectWithValue }) => {
    // console.log('Fetching active application for specific country and specific user', country_id, user_id);

    try {
      const res = await supabase.from("applications").select("*").eq("user_id", user_id).eq("country_id", country_id).order("created_at", { ascending: false }).limit(1).maybeSingle();
      // console.log('Response for fetching pending application', res);

      if (res.error) return rejectWithValue(res.error.message);

      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
)

// fetch all applications 
export const getAllApplications = createAsyncThunk("applicationSlice/getAllApplications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await supabase.from("applications").select("*").order("created_at", { ascending: false });
      // console.log('Response for fetching all applications', res);

      if (res.error) return rejectWithValue(res.error.message);

      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
)

// fetch all applications for specific user
export const getAllApplication_specificUser = createAsyncThunk("applicationSlice/getAllApplication_specificUser",
  async (user_id, { rejectWithValue }) => {
    // console.log('Fetching all application for specific user', user_id);

    try {
      const res = await supabase.from("applications").select("*").eq("user_id", user_id).order("created_at", { ascending: false });
      // console.log('Response for fetching all applications of specific user', res);

      if (res.error) return rejectWithValue(res.error.message);

      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
)

// fetch all application for specific country
export const fetchApplicationsByCountry = createAsyncThunk("applicationSlice/fetchByCountry",
  async ({ countryId, statusFilter = "all" }, { rejectWithValue }) => {
    try {

      let statuses = [];

      if (statusFilter === "all") {
        statuses = ["processing", "approved", "rejected"];
      } else {
        statuses = [statusFilter];
      }

      const { data, error } = await supabase.from("applications").select(`*,
          application_personal_info (*),application_passport (*), application_visa_details (*), application_documents (*), application_payment (*)`)
        .eq("country_id", countryId).in("status", statuses).order("created_at", { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
)

// fetch application details for specific application
export const fetchSpecificationApplicationsById = createAsyncThunk("applicationSlice/fetchSpecificationApplicationsById",
  async (application_id, { rejectWithValue }) => {
    // console.log('Received application id to fetch details in slice', application_id);

    try {
      const res = await supabase.from("applications").select(`*,
          application_personal_info (*),application_passport (*), application_visa_details (*), application_documents (*), application_payment (*)`)
        .eq("id", application_id);
      // console.log('Response for fetching specific application details', res);

      if (res?.error) throw res?.error;

      return res?.data || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
)

const initialState = {
  isApplicationLoading: false,
  isApplicationError: null,
  allApplications: [],
  application: {},
  personalInfo: {},
  passport: {},
  visa: {},
  documents: {
    passportFile: null,
    photoFile: null,
    bankDocs: null,
  },
  payment: {
    provider: null,
    status: "pending",
  },
  steps: {
    current: 1,
    completed: [],
  }
};

export const applicationSlice = createSlice({
  name: "applicationSlice",
  initialState,
  reducers: {
    setPersonalInfoLocal(state, action) {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    setPassportLocal(state, action) {
      state.passport = { ...state.passport, ...action.payload };
    },
    setDocumentsLocal(state, action) {
      state.documents = { ...state.documents, ...action.payload };
    },
    addAdditionalDocLocal(state, action) {
      state.documents.additionalDocs.push(action.payload);
    },
    setPaymentLocal(state, action) {
      state.payment = { ...state.payment, ...action.payload };
    },
    resetApplication() {
      return initialState;
    }
  },

  extraReducers: (builder) => {
    builder

      // App init
      .addCase(initApplication.pending, (state, action) => {
        state.isApplicationLoading = true;
      })
      .addCase(initApplication.fulfilled, (state, action) => {
        state.isApplicationLoading = false;
        state.application = action.payload;
      })
      .addCase(initApplication.rejected, (state, action) => {
        state.isApplicationLoading = false;
        state.isApplicationError = action.error.message;
      })

      // Step Save Handlers
      .addCase(saveStepPersonal.pending, (state, action) => {
        state.isApplicationLoading = true;
      })
      .addCase(saveStepPersonal.fulfilled, (state, action) => {
        state.isApplicationLoading = false;
        state.personalInfo = action.payload;
      })
      .addCase(saveStepPersonal.rejected, (state, action) => {
        state.isApplicationLoading = false;
        state.isApplicationError = action.error.message;
      })

      // add passport
      .addCase(saveStepPassport.pending, (state, action) => {
        state.isApplicationLoading = true;
      })
      .addCase(saveStepPassport.fulfilled, (state, action) => {
        state.isApplicationLoading = false;
        state.passport = action.payload;
      })
      .addCase(saveStepPassport.rejected, (state, action) => {
        state.isApplicationLoading = false;
        state.isApplicationError = action.error.message;
      })

      // add visa
      .addCase(saveVisaDetails.pending, (state, action) => {
        state.isApplicationLoading = true;
      })
      .addCase(saveVisaDetails.fulfilled, (state, action) => {
        state.isApplicationLoading = false;
        state.visa = action.payload;
      })
      .addCase(saveVisaDetails.rejected, (state, action) => {
        state.isApplicationLoading = false;
        state.isApplicationError = action.error.message;
      })

      // add document
      .addCase(saveStepDocuments.pending, (state, action) => {
        state.isApplicationLoading = true;
      })
      .addCase(saveStepDocuments.fulfilled, (state, action) => {
        state.isApplicationLoading = false;
        state.documents = { ...state.documents, ...action.payload };
      })
      .addCase(saveStepDocuments.rejected, (state, action) => {
        state.isApplicationLoading = false;
        state.isApplicationError = action.error.message;
      })

      // add payment
      .addCase(saveStepPayment.pending, (state, action) => {
        state.isApplicationLoading = true;
      })
      .addCase(saveStepPayment.fulfilled, (state, action) => {
        state.isApplicationLoading = false;
        state.payment = { ...state.payment, ...action.payload };
      })
      .addCase(saveStepPayment.rejected, (state, action) => {
        state.isApplicationLoading = false;
        state.isApplicationError = action.error.message;
      })

      // Step progress
      .addCase(saveStepProgress.pending, (state, action) => {
        state.isApplicationLoading = true;
      })
      .addCase(saveStepProgress.fulfilled, (state, action) => {
        state.isApplicationLoading = false;
        state.steps.current = action.payload.step;
        state.steps.completed = action.payload.completed;
      })
      .addCase(saveStepProgress.rejected, (state, action) => {
        state.isApplicationLoading = false;
        state.isApplicationError = action.error.message;
      })

      // Status change
      .addCase(updateApplicationStatus.pending, (state, action) => {
        state.isApplicationLoading = true;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.isApplicationLoading = false;
        state.application = action.payload;
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.isApplicationLoading = false;
        state.isApplicationError = action.error.message;
      })

      // update Status
      .addCase(updateApplicationApproveReject.pending, (state, action) => {
        state.isApplicationLoading = true;
      })
      .addCase(updateApplicationApproveReject.fulfilled, (state, action) => {
        state.isApplicationLoading = false;
        state.application = action.payload;
      })
      .addCase(updateApplicationApproveReject.rejected, (state, action) => {
        state.isApplicationLoading = false;
        state.isApplicationError = action.error.message;
      })

      // fetch latest application
      .addCase(getActiveApplication_specificCountry_specificUser.pending, (state, action) => {
        state.isApplicationLoading = true;
      })
      .addCase(getActiveApplication_specificCountry_specificUser.fulfilled, (state, action) => {
        state.isApplicationLoading = false;
        state.application = action.payload;
      })
      .addCase(getActiveApplication_specificCountry_specificUser.rejected, (state, action) => {
        state.isApplicationLoading = false;
        state.isApplicationError = action.error.message;
      })

      // fetch all applications 
      .addCase(getAllApplications.pending, (state, action) => {
        state.isApplicationLoading = true;
      })
      .addCase(getAllApplications.fulfilled, (state, action) => {
        state.isApplicationLoading = false;
        state.allApplications = action.payload;
      })
      .addCase(getAllApplications.rejected, (state, action) => {
        state.isApplicationLoading = false;
        state.isApplicationError = action.error.message;
      })
     
      // fetch applications per user
      .addCase(getAllApplication_specificUser.pending, (state, action) => {
        state.isApplicationLoading = true;
      })
      .addCase(getAllApplication_specificUser.fulfilled, (state, action) => {
        state.isApplicationLoading = false;
        state.application = action.payload;
      })
      .addCase(getAllApplication_specificUser.rejected, (state, action) => {
        state.isApplicationLoading = false;
        state.isApplicationError = action.error.message;
      })

      // fetch applications per country
      .addCase(fetchApplicationsByCountry.pending, (state) => {
        state.isApplicationLoading = true;
      })
      .addCase(fetchApplicationsByCountry.fulfilled, (state, action) => {
        state.isApplicationLoading = false;
        state.allApplications = action.payload;
      })
      .addCase(fetchApplicationsByCountry.rejected, (state, action) => {
        state.isApplicationLoading = false;
        state.isApplicationError = action.payload || "Failed to fetch applications";
      })

      // fetch specific applications 
      .addCase(fetchSpecificationApplicationsById.pending, (state) => {
        state.isApplicationLoading = true;
      })
      .addCase(fetchSpecificationApplicationsById.fulfilled, (state, action) => {
        state.isApplicationLoading = false;
        state.application = action.payload;
      })
      .addCase(fetchSpecificationApplicationsById.rejected, (state, action) => {
        state.isApplicationLoading = false;
        state.isApplicationError = action.payload || "Failed to fetch applications";
      })
  },
});

export const { setPersonalInfoLocal, setPassportLocal, setDocumentsLocal, addAdditionalDocLocal, setPaymentLocal, resetApplication } = applicationSlice.actions;

export default applicationSlice.reducer;
