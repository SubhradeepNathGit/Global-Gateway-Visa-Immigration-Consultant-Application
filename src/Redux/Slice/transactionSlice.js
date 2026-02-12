import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../util/Supabase/supabase";

// Save Transaction slice
export const saveTransaction = createAsyncThunk("transactionSlice/saveTransaction",
  async (payload, { rejectWithValue }) => {
    // console.log('Received payment data in slice', payload);

    try {
      const res = await supabase.from("transaction_details").insert([payload]).select("*").single();
      // console.log('Response after adding payment details', res);

      if (res.error) return rejectWithValue(res.error.message);
      return res.data;
    }
    catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const fetchUserTransactions = createAsyncThunk("transactionSlice/fetchUserTransactions",
  async (userId, { rejectWithValue }) => {
    try {
      // visa transaction 
      const { data: applications, error: appErr } = await supabase.from("applications").select("id, country_id").eq("user_id", userId);
      if (appErr) throw appErr;

      const appIds = applications.map(a => a.id);
      let visaTxns = [];

      if (appIds.length) {
        const { data: payments, error: payErr } = await supabase.from("application_payment").select("*").in("application_id", appIds).order("created_at", { ascending: false });

        if (payErr) throw payErr;

        const txnIds = payments.map(p => p.transaction_id);
        const { data: txnDetails, error: txnErr } = await supabase.from("transaction_details").select("*").in("transaction_id", txnIds);

        if (txnErr) throw txnErr;

        visaTxns = payments.map(p => ({
          ...p,
          txn_for: "visa",
          application: applications.find(a => a.id === p.application_id) || null,
          transaction_details:
            txnDetails.find(t => t.transaction_id === p.transaction_id) || null,
        }));
      }

      // course transaction 
      const { data: orders, error: orderErr } = await supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false });

      if (orderErr) throw orderErr;

      const orderTxnIds = orders.map(o => o.transaction_id);

      const { data: courseTxnDetails, error: courseTxnErr } = await supabase.from("transaction_details").select("*").in("transaction_id", orderTxnIds);

      if (courseTxnErr) throw courseTxnErr;

      const orderIds = orders.map(o => o.id);
      const { data: orderItems, error: itemsErr } = await supabase.from("order_items").select("*").in("order_id", orderIds);

      if (itemsErr) throw itemsErr;

      const courseIds = orderItems.map(i => i.course_id);
      const { data: courses, error: courseErr } = await supabase.from("courses").select("id, course_name").in("id", courseIds);

      if (courseErr) throw courseErr;

      const courseTxns = orders.map(order => ({
        ...order,
        txn_for: "course",
        courses: orderItems
          .filter(i => i.order_id === order.id)
          .map(i => courses.find(c => c.id === i.course_id)),
        transaction_details: courseTxnDetails.find(t => t.transaction_id === order.transaction_id) || null
      }));

      return [...visaTxns, ...courseTxns].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);



// Fetch transactions along with user details
export const fetchUserTransactionsWithUsers = createAsyncThunk("transactionSlice/fetchUserTransactionsWithUsers",
  async (_, { rejectWithValue }) => {
    try {
      // Fetch payments with application info
      const { data: payments, error: payErr } = await supabase.from("application_payment")
        .select(`*,applications (id,user_id,status,created_at,updated_at)`).order("created_at", { ascending: false });

      if (payErr) throw payErr;

      // Extract user IDs from applications
      const userIds = payments.map(p => p.applications?.user_id).filter(Boolean);

      // Fetch user details
      const { data: users, error: userErr } = await supabase.from("users").select("*").in("id", userIds);

      if (userErr) throw userErr;

      // Fetch transaction_details separately
      const txnIds = payments.map(p => p.transaction_id).filter(Boolean);
      const { data: txnDetails, error: txnErr } = await supabase.from("transaction_details").select("*").in("transaction_id", txnIds);

      if (txnErr) throw txnErr;

      // Merge everything manually
      const result = payments.map(payment => {
        const application = payment.applications || null;
        const user = application ? users.find(u => u.id === application.user_id) || null : null;
        const transaction_details = txnDetails.find(tx => tx.transaction_id === payment.transaction_id) || null;

        return { ...payment, application, user, transaction_details };
      });

      return result;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


const initialState = {
  isTransactionLoading: false,
  hasTransactionError: null,
  transactions: [],
  currentTransaction: null,
  allTransactions: {
    all: [],
    visa: [],
    course: [],
  },
}

export const transactionSlice = createSlice({
  name: "transactionSlice",
  initialState,
  extraReducers: (builder) => {
    builder

      // Save Transaction
      .addCase(saveTransaction.pending, (state) => {
        state.isTransactionLoading = true;
      })
      .addCase(saveTransaction.fulfilled, (state, action) => {
        state.isTransactionLoading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(saveTransaction.rejected, (state, action) => {
        state.isTransactionLoading = false;
        state.hasTransactionError = action.payload;
      })

      // Fetch User wise Transactions
      .addCase(fetchUserTransactions.pending, (state) => {
        state.isTransactionLoading = true;
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action) => {
        state.isTransactionLoading = false;

        const txns = action.payload || [];
        state.allTransactions.all = txns;
        state.allTransactions.visa = txns.filter(t => t.txn_for === "visa");
        state.allTransactions.course = txns.filter(t => t.txn_for === "course");
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        state.isTransactionLoading = false;
        state.hasTransactionError = action.payload;
      })

      // Fetch All Transactions
      .addCase(fetchUserTransactionsWithUsers.pending, (state) => {
        state.isTransactionLoading = true;
      })
      .addCase(fetchUserTransactionsWithUsers.fulfilled, (state, action) => {
        state.isTransactionLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchUserTransactionsWithUsers.rejected, (state, action) => {
        state.isTransactionLoading = false;
        state.hasTransactionError = action.payload;
      });
  },
});

export default transactionSlice.reducer;