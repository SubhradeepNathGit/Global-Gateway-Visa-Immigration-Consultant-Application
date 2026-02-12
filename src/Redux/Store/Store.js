import { configureStore } from '@reduxjs/toolkit';

import authSliceReducer from '../Slice/auth/authSlice';
import countrySliceReducer from '../Slice/countrySlice';
import applicationSliceReducer from '../Slice/applicationSlice';
import visaSliceReducer from '../Slice/visaSlice';
import visaDetailsSliceReducer from '../Slice/VisaDetailsSlice';
import fetchChargesReducer from '../Slice/chargesSlice';
import transactionSliceReducer from '../Slice/transactionSlice';
import contactSliceReducer from '../Slice/contactSlice';
import checkUserAuthSliceReducer from '../Slice/auth/checkAuthSlice';
import userProfileSliceReducer from '../Slice/userSlice';
import activitySliceReducer from '../Slice/activitySlice';
import adminProfileSliceReducer from '../Slice/adminSlice';
import embassySliceReducer from '../Slice/embassySlice';
import holidaysSliceReducer from '../Slice/holidaySlice';
import appointmentReasonSliceReducer from '../Slice/appointmentReasonSlice';
import timingSliceReducer from '../Slice/timingSlice';
import notificationSliceReducer from '../Slice/notificationSlice';
import loadingReducer from '../Slice/loadingSlice';
import courseSliceReducer from '../Slice/courseSlice';
import cartSliceReducer from '../Slice/cartSlice';
import promocodeSliceReducer from '../Slice/promocodeSlice';
import ordersSliceReducer from '../Slice/orderSlice';
import courseRatingsSliceReducer from '../Slice/courseRatingsSlice';
import certificateSliceReducer from '../Slice/certificateSlice';

export const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    checkAuth: checkUserAuthSliceReducer,
    allCountry: countrySliceReducer,
    userProfile: userProfileSliceReducer,
    admin: adminProfileSliceReducer,
    application: applicationSliceReducer,
    visa: visaSliceReducer,
    visaDetails: visaDetailsSliceReducer,
    charge: fetchChargesReducer,
    transaction: transactionSliceReducer,
    contact: contactSliceReducer,
    activity: activitySliceReducer,
    embassy: embassySliceReducer,
    holiday: holidaysSliceReducer,
    timing: timingSliceReducer,
    appointmentReason: appointmentReasonSliceReducer,
    notification: notificationSliceReducer,
    loading: loadingReducer,
    course: courseSliceReducer,
    cart: cartSliceReducer,
    promocode: promocodeSliceReducer,
    orders: ordersSliceReducer,
    ratings: courseRatingsSliceReducer,
    certificate: certificateSliceReducer
  }
});

export default store;