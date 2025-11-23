import { applyFilters } from "@/helpers/filter-builder";
import { supabase } from "@/utils/supabase";
import { createApi } from "@reduxjs/toolkit/query/react";
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

          query = applyFilters(query, filter);

          return query.order("date_open", { ascending: false });
        },
      }),
      providesTags: ["Trades"],
    }),

    // Pagination
    getTradesByPagination: builder.query({
      query: ({ page, limit, monthYear }) => ({
        fn: async () => {
          const from = (page - 1) * limit;
          const to = page * limit - 1;

          let query = supabase
            .from("trades")
            .select("*", { count: "exact" })
            .order("date_open", { ascending: false })
            .range(from, to);

          let allQuery = supabase
            .from("trades")
            .select("result")
            .order("date_open", { ascending: false });

          if (monthYear) {
            const startDate = dayjs(monthYear).startOf("month").toISOString();
            const endDate = dayjs(monthYear).endOf("month").toISOString();

            query = query.gte("date_open", startDate).lte("date_open", endDate);
            allQuery = allQuery
              .gte("date_open", startDate)
              .lte("date_open", endDate);
          }

          const { data, count, error } = await query;
          const { data: allTrades, error: allErr } = await allQuery;

          if (error || allErr) throw error;

          const totalPL =
            allTrades?.reduce(
              (sum: number, t: any) => sum + (t.result ?? 0),
              0
            ) || 0;
          const wins =
            allTrades?.filter((t: any) => (t.result ?? 0) > 0).length || 0;
          const losses =
            allTrades?.filter((t: any) => (t.result ?? 0) < 0).length || 0;
          const winRate =
            count && count > 0 ? Number(((wins / count) * 100).toFixed(2)) : 0;
          const avgReturn =
            count && count > 0 ? Number((totalPL / count).toFixed(2)) : 0;

          return {
            data: {
              data,
              total: count,
              page,
              limit,
              totalPL,
              winRate,
              avgReturn,
              wins,
              losses,
            },
          };
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
      query: (id: string | undefined) => ({
        fn: () => supabase.from("trades").delete().eq("id", id).select("*"),
      }),
      invalidatesTags: ["Trades"],
    }),

    // GET TIMEFRAME ANALYTICS
    getTimeframeAnalytics: builder.query({
      query: () => ({
        fn: async () => {
          const { data, error } = await supabase
            .from("trades")
            .select("timeframe, result");

          if (error) throw error;

          const groups: Record<string, number[]> = {};

          data.forEach((t) => {
            if (!t.timeframe) return;
            if (!groups[t.timeframe]) groups[t.timeframe] = [];
            groups[t.timeframe].push(Number(t.result));
          });

          const analytics = Object.entries(groups).map(
            ([timeframe, results]) => {
              const total = results.length;
              const wins = results.filter((r) => r > 0).length;
              const losses = total - wins;
              const winRate = total ? (wins / total) * 100 : 0;

              return {
                timeframe,
                trades: total,
                wins,
                losses,
                winRate: Number(winRate.toFixed(1)),
                trend: results.slice(-7).map((r) => (r > 0 ? 1 : 0)),
                performanceLevel:
                  winRate >= 60 ? "high" : winRate >= 50 ? "medium" : "low",
              };
            }
          );

          return { data: analytics };
        },
      }),
      providesTags: ["Trades"],
    }),

    // GET SESSION ANALYTICS
    getSessionAnalytics: builder.query({
      query: () => ({
        fn: async () => {
          const { data, error } = await supabase
            .from("trades")
            .select("session, result");

          if (error) throw error;

          const groups: Record<string, number[]> = {};

          data.forEach((t) => {
            if (!groups[t.session]) groups[t.session] = [];
            groups[t.session].push(Number(t.result));
          });

          const analytics = Object.entries(groups).map(([session, results]) => {
            const total = results.length;
            const wins = results.filter((r) => r > 0).length;
            const losses = total - wins;
            const winRate = total ? (wins / total) * 100 : 0;

            return {
              session,
              trades: total,
              wins,
              losses,
              winRate: Number(winRate.toFixed(1)),
              trend: results.slice(-7).map((r) => (r > 0 ? 1 : 0)),
              performanceLevel:
                winRate >= 60 ? "high" : winRate >= 50 ? "medium" : "low",
            };
          });

          return { data: analytics };
        },
      }),
      providesTags: ["Trades"],
    }),

    // GET TRADE TYPE ANALYTICS
    getTradeTypeAnalytics: builder.query({
      query: () => ({
        fn: async () => {
          const { data, error } = await supabase
            .from("trades")
            .select("tradetype, result");

          if (error) throw error;

          const groups: Record<string, number[]> = {};

          data.forEach((t) => {
            if (!t.tradetype) return;
            if (!groups[t.tradetype]) groups[t.tradetype] = [];
            groups[t.tradetype].push(Number(t.result));
          });

          const analytics = Object.entries(groups).map(([type, results]) => {
            const total = results.length;
            const wins = results.filter((r) => r > 0).length;
            const losses = total - wins;
            const winRate = total ? (wins / total) * 100 : 0;

            return {
              tradetype: type,
              trades: total,
              wins,
              losses,
              winRate: Number(winRate.toFixed(1)),
              trend: results.slice(-7).map((r) => (r > 0 ? 1 : 0)),
              performanceLevel:
                winRate >= 60 ? "high" : winRate >= 50 ? "medium" : "low",
            };
          });

          return { data: analytics };
        },
      }),
      providesTags: ["Trades"],
    }),
  }),
});

export const {
  useGetTradesQuery,
  useGetTradesByPaginationQuery,
  useGetTradeByIdQuery,
  useAddTradeMutation,
  useUpdateTradeMutation,
  useDeleteTradeMutation,
  useGetTimeframeAnalyticsQuery,
  useGetSessionAnalyticsQuery,
  useGetTradeTypeAnalyticsQuery,
} = tradesApi;
