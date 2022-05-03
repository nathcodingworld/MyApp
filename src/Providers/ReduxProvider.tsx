import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { ImageApi } from "./APIs/ImageApi";
import { VideoApi } from "./APIs/VideoApi";
import { AudioApi } from "./APIs/AudioApi";

import React from "react";

const authSlice = createSlice({
  name: "auth",
  initialState: { token: "", isAuth: false, propic: "", ID: "", userName: "Visitor", bio: "", authorid: "default", authorpic: "", authorName: "" },
  reducers: {
    Login(state, action) {
      state.token = action.payload.token;
      state.isAuth = true;
      state.propic = action.payload.propic;
      state.ID = action.payload.ID;
      state.userName = action.payload.userName;
      state.bio = action.payload.bio;
    },
    Logout(state) {
      state.token = "";
      state.isAuth = false;
      state.userName = "Visitor";
      state.ID = "";
      state.bio = "";
      state.propic = "";
    },
    SetAuthor(state, action) {
      state.authorid = action.payload.authorid;
      state.authorpic = action.payload.pic;
      state.authorName = action.payload.name;
    },
    SetUser(state) {
      state.authorid = state.ID;
      state.authorpic = state.propic;
      state.authorName = state.userName;
    },
    SetHome(state) {
      state.authorid = "default";
      state.authorpic = state.propic;
      state.authorName = state.userName;
    },
    refresh(state, action) {
      state.ID = action.payload;
    },
  },
});
const querySlice = createSlice({
  name: "query",
  initialState: { error: false, imgfile: "", vdofile: "", audfile: "", roomid: "none", running: false },
  reducers: {
    success(state) {
      state.error = false;
      state.imgfile = "";
      state.vdofile = "";
      state.audfile = "";
    },
    failed(state, action) {
      state.error = true;
      state.imgfile = action.payload.img;
      state.vdofile = action.payload.vdo;
      state.audfile = action.payload.aud;
    },
    refresh(state) {
      state.roomid = "none";
    },
    connect(state, action) {
      state.roomid = action.payload;
    },
    run(state) {
      state.running = true;
    },
  },
});
const pageSlice = createSlice({
  name: "page",
  initialState: { page: "PROFILE", theme: "none", mode: "dark", openSetting: false },
  reducers: {
    setPageState(state, action) {
      state.page = action.payload;
    },
    setPageTheme(state, action) {
      state.theme = action.payload;
    },
    setPageAppearance(state) {
      state.mode = state.mode === "dark" ? "light" : "dark";
    },
    toggleSettingModal(state) {
      state.openSetting = !state.openSetting;
    },
  },
});
const modalSlice = createSlice({
  name: "modal",
  initialState: { openAdd: false, openView: false, open: false, content: "" },
  reducers: {
    ToggleAddModal(state) {
      state.openAdd = !state.openAdd;
    },
    ToggleViewtModal(state) {
      state.openView = !state.openView;
    },
    openVideoPlayer(state) {
      state.content = "video";
      state.open = true;
    },
    openAudioPlayer(state) {
      state.content = "audio";
      state.open = true;
    },
    closeView(state) {
      state.open = false;
    },
  },
});

const mediaDataSlice = createSlice({
  name: "mediaData",
  initialState: {
    opened: false,
    videoState: {
      expand: false,
      time: 0,
      play: true,
      mute: false,
    },
    inVideo: {
      file: "",
      description: "",
      title: "",
    },
    inAudio: {
      file: "",
      title: "",
      cover: "",
      owner: "",
    },
    videoid: "",
    photoid: "",
    image: "",
    userid: "",
  },
  reducers: {
    playVideo(state, action) {
      state.videoState.play = action.payload;
    },
    expandVideo(state) {
      state.videoState.expand = !state.videoState.expand;
    },
    updateVideo(state, action) {
      state.videoState.time = action.payload;
    },
    closeVideo(state) {
      state.opened = false;
    },
    setVideoData(state, action) {
      state.videoid = action.payload.id;
      state.inVideo.description = action.payload.desc;
      state.inVideo.title = action.payload.title;
      state.inVideo.file = action.payload.video;
      state.videoState.time = action.payload.time;
      state.videoState.play = action.payload.play;
      state.videoState.mute = action.payload.mute;
      state.opened = true;
    },
    setPhotoData(state, action) {
      state.photoid = action.payload.id;
      state.image = action.payload.image;
      state.userid = action.payload.userid;
    },
    setAudioData(state, action) {
      state.inAudio.file = action.payload.file;
      state.inAudio.title = action.payload.title;
      state.inAudio.cover = action.payload.cover;
      state.inAudio.owner = action.payload.owner;
      state.opened = false;
    },
  },
});

export const authAction = authSlice.actions;
export const pageAction = pageSlice.actions;
export const mediaDataAction = mediaDataSlice.actions;
export const modalAction = modalSlice.actions;
export const queryAction = querySlice.actions;

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    query: querySlice.reducer,
    page: pageSlice.reducer,
    mediaData: mediaDataSlice.reducer,
    modal: modalSlice.reducer,
    [VideoApi.reducerPath]: VideoApi.reducer,
    [ImageApi.reducerPath]: ImageApi.reducer,
    [AudioApi.reducerPath]: AudioApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(VideoApi.middleware).concat(ImageApi.middleware).concat(AudioApi.middleware),
});

const ReduxProvider: React.FC = (props) => {
  return <Provider store={store}>{props.children}</Provider>;
};

export default ReduxProvider;
