import { createApi } from "@reduxjs/toolkit/query/react";
import { supabase } from "@/utils/supabase";

const supabaseBaseQuery = async ({ fn }: any) => {
  try {
    const { data, error } = await fn();
    if (error) throw error;
    return { data };
  } catch (error: any) {
    return { error: { message: error.message || "Supabase error" } };
  }
};

export const tradesApi = createApi({
  reducerPath: "tradesApi",
  baseQuery: supabaseBaseQuery,
  tagTypes: ["Trades"],

  endpoints: (builder) => ({

    // GET ALL TRADES
    getTrades: builder.query({
      query: () => ({
        fn: () =>
          supabase
            .from("trades")
            .select("*")
            .order("date_open", { ascending: false }),
      }),
      providesTags: ["Trades"],
    }),

    // GET SINGLE TRADE
    getTradeById: builder.query({
      query: (id: string) => ({
        fn: () =>
          supabase
            .from("trades")
            .select("*")
            .eq("id", id)
            .single(),
      }),
      providesTags: ["Trades"],
    }),

    // ADD NEW TRADE
    addTrade: builder.mutation({
      query: (trade: any) => ({
        fn: () =>
          supabase
            .from("trades")
            .insert(trade)
            .select("*")
            .single(),
      }),
      invalidatesTags: ["Trades"],
    }),

    // UPDATE TRADE
    updateTrade: builder.mutation({
      query: ({ id, ...rest }: any) => ({
        fn: () =>
          supabase
            .from("trades")
            .update(rest)
            .eq("id", id)
            .select("*")
            .single(),
      }),
      invalidatesTags: ["Trades"],
    }),

    // DELETE TRADE
    deleteTrade: builder.mutation({
      query: (id: string) => ({
        fn: () =>
          supabase
            .from("trades")
            .delete()
            .eq("id", id)
            .select("*"),
      }),
      invalidatesTags: ["Trades"],
    }),

  }),
});

export const {
  useGetTradesQuery,
  useGetTradeByIdQuery,
  useAddTradeMutation,
  useUpdateTradeMutation,
  useDeleteTradeMutation,
} = tradesApi;
