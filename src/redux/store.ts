import { configureStore } from "@reduxjs/toolkit";
import { tradesApi } from "../redux/services/tradesApi";

export const store = configureStore({
  reducer: {
    [tradesApi.reducerPath]: tradesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tradesApi.middleware),
});


