import { configureStore } from "@reduxjs/toolkit";
import { tradesApi } from "../redux/services/tradesApi";
import { strategyApi } from "./services/stratergy";

export const store = configureStore({
  reducer: {
    [tradesApi.reducerPath]: tradesApi.reducer,
    [strategyApi.reducerPath]: strategyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(tradesApi.middleware)
      .concat(strategyApi.middleware),
});
