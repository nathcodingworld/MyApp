import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import KEY from "../../Key/KEY";

export const AudioApi = createApi({
  reducerPath: "audioApi",
  baseQuery: fetchBaseQuery({ baseUrl: KEY.AUDIOSERVER }),
  endpoints: (builder) => ({
    putAudio: builder.mutation<any, any>({
      query: (file) => ({
        url: `/postaudio`,
        method: "PUT",
        body: file,
      }),
    }),
    deleteAudio: builder.mutation<any, any>({
      query: (file) => ({
        url: `/deleteaudio/?file=${file}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { usePutAudioMutation } = AudioApi;
export const { useDeleteAudioMutation } = AudioApi;
