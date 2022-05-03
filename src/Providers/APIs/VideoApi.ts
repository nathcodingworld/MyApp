import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import KEY from "../../Key/KEY";

export const VideoApi = createApi({
  reducerPath: "videoApi",
  baseQuery: fetchBaseQuery({ baseUrl: KEY.VIDEOSERVER }),
  endpoints: (builder) => ({
    putVideo: builder.mutation<any, any>({
      query: (file) => ({
        url: `/postvideo`,
        method: "PUT",
        body: file,
      }),
    }),
    deleteVideo: builder.mutation<any, any>({
      query: (file) => ({
        url: `/deletevideo/?file=${file}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { usePutVideoMutation } = VideoApi;
export const { useDeleteVideoMutation } = VideoApi;
