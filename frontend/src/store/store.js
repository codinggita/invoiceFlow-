import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import invoiceReducer from "./slices/invoiceSlice";
import clientReducer from "./slices/clientSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    invoice: invoiceReducer,
    client: clientReducer
  }
});
