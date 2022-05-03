import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import KEY from "../../Key/KEY";

export const ImageApi = createApi({
  reducerPath: "imageApi",
  baseQuery: fetchBaseQuery({ baseUrl: KEY.PHOTOSERVER }),
  endpoints: (builder) => ({
    putImage: builder.mutation<any, any>({
      query: (file) => ({
        url: `/postimage`,
        method: "PUT",
        body: file,
      }),
    }),
    deleteImage: builder.mutation<any, any>({
      query: (file) => ({
        url: `/deleteimage/?file=${file}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { usePutImageMutation } = ImageApi;
export const { useDeleteImageMutation } = ImageApi;
