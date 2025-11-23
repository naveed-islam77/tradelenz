import { supabase } from "@/utils/supabase";
import { createApi } from "@reduxjs/toolkit/query/react";

const supabaseBaseQuery = async ({ fn }: any) => {
  try {
    const { data, error } = await fn();
    if (error) throw error;
    return { data };
  } catch (error: any) {
    return { error: { message: error.message || "Supabase error" } };
  }
};

export const strategyApi = createApi({
  reducerPath: "strategyApi",
  baseQuery: supabaseBaseQuery,
  tagTypes: ["Strategies"],

  endpoints: (builder) => ({
    addStrategy: builder.mutation({
      async queryFn(strategy) {
        const fn = () =>
          supabase.from("strategies").insert([strategy]).select().single();
        return supabaseBaseQuery({ fn });
      },
      invalidatesTags: ["Strategies"],
    }),
    getStrategies: builder.query({
      async queryFn() {
        const fn = () => supabase.from("strategies").select("*");
        return supabaseBaseQuery({ fn });
      },
      providesTags: ["Strategies"],
    }),
    getStrategyById: builder.query({
      async queryFn(id: string) {
        const fn = () =>
          supabase.from("strategies").select("*").eq("id", id).single();
        return supabaseBaseQuery({ fn });
      },
      providesTags: ["Strategies"],
    }),
    updateStrategy: builder.mutation({
      async queryFn({ id, ...updates }) {
        const fn = () =>
          supabase
            .from("strategies")
            .update(updates)
            .eq("id", id)
            .select()
            .single();
        return supabaseBaseQuery({ fn });
      },
      invalidatesTags: ["Strategies"],
    }),
    deleteStrategy: builder.mutation({
      async queryFn(id: string) {
        const fn = () =>
          supabase.from("strategies").delete().eq("id", id).select().single();
        return supabaseBaseQuery({ fn });
      },
      invalidatesTags: ["Strategies"],
    }),
  }),
});

export const {
    useAddStrategyMutation,
    useGetStrategiesQuery,
    useGetStrategyByIdQuery,
    useUpdateStrategyMutation,
    useDeleteStrategyMutation,
} = strategyApi;
