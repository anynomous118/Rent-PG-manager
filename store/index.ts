
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import propertyReducer from './slices/propertySlice';
import tenantReducer from './slices/tenantSlice';
import rentReducer from './slices/rentSlice';
import complaintReducer from './slices/complaintSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    property: propertyReducer,
    tenants: tenantReducer,
    rent: rentReducer,
    complaints: complaintReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
