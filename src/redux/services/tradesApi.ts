import { createApi } from "@reduxjs/toolkit/query/react";
import { supabase } from "@/utils/supabase";
import dayjs from "dayjs";

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
   getTrades: builder.query({
  query: ({ filter }) => ({
    fn: async () => {
      let query = supabase.from("trades").select("*");

      if (filter === "today") {
        const start = dayjs().startOf("day").toISOString();
        const end = dayjs().endOf("day").toISOString();
        query = query.gte("date_open", start).lte("date_open", end);
      } else if (filter === "wins") {
        query = query.gt("result", 0);
      } else if (filter === "losses") {
        query = query.lt("result", 0);
      } else if (filter === "breakeven") {
        query = query.eq("result", 0);
      }



      if (filter && typeof filter === "object" && filter.field && filter.value) {
        const { field, value } = filter;
console.log("field", field)
        if (field === "Date") {
          const start = dayjs(value).startOf("day").toISOString();
          const end = dayjs(value).endOf("day").toISOString();
          console.log("start", start)
          query = query.gte("date_open", start).lte("date_open", end);
        } else if (field === "Type") {
          query = query.eq("type", value);
        } else if (field === "Pair") {
          query = query.eq("pair", value);
        } else if (field === "Result") {
          query = query.eq("result", value);
        }
      }

      return query.order("date_open", { ascending: false });
    },
  }),
  providesTags: ["Trades"],
}),


    // GET SINGLE TRADE
    getTradeById: builder.query({
      query: (id: string) => ({
        fn: () => supabase.from("trades").select("*").eq("id", id).single(),
      }),
      providesTags: ["Trades"],
    }),

    // ADD NEW TRADE
    addTrade: builder.mutation({
      query: (trade: any) => ({
        fn: () => supabase.from("trades").insert(trade).select("*").single(),
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
        fn: () => supabase.from("trades").delete().eq("id", id).select("*"),
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
