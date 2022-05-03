import { Typography, CardHeader, CardActions, IconButton } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useEffect, useRef } from "react";
import MiniVideoPlayer from "../Player/MiniVideoPlayer";
import { useDispatch, useSelector } from "react-redux";
import { mediaDataAction, modalAction } from "../../Providers/ReduxProvider";
import { useNavigate } from "react-router-dom";

const actionStyle = {
  position: "absolute",
  p: 0,
  top: 0,
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
};

const playStyle = {
  position: "absolute",
  top: "95px",
  left: "160px",
  transform: "scale(2)",
  color: "#05050510",
  "&:hover": { color: "white" },
};

const buttonStyle = { transform: "rotate(-90deg) scale(1.3)", color: "#05050510", "&:hover": { color: "white", backgroundColor: "transparent" } };

const MiniFloatingPlayer: React.FC = (props) => {
  const video = useSelector<any, { file: string; description: string; title: string }>((state) => state.mediaData.inVideo);
  const state = useSelector<any, { time: number; play: boolean }>((state) => state.mediaData.videoState);
  const videoid = useSelector<any, { time: number; play: boolean }>((state) => state.mediaData.videoid);
  const videoRef = useRef<any>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const Playing = (state: boolean) => () => {
    dispatch(mediaDataAction.playVideo(state));
  };

  function onReplayHandler() {
    videoRef.current?.seekTo(0);
    Playing(false)();
  }
  function onCloseHandler() {
    dispatch(modalAction.closeView());
    dispatch(mediaDataAction.closeVideo());
  }
  function updateHandler(state: any) {
    dispatch(mediaDataAction.updateVideo(state.playedSeconds));
  }
  function onExpandHandler() {
    dispatch(mediaDataAction.setVideoData({ id: videoid, desc: video.description, title: video.title, video: video.file, time: state.time, play: state.play, mute: false }));
    dispatch(modalAction.closeView());
    navigate("/VideoOne");
  }
  useEffect(() => {
    videoRef.current?.seekTo(state.time);
  }, []);

  return (
    <>
      <MiniVideoPlayer file={video.file} play={state.play} Ref={videoRef} onEnded={onReplayHandler} onUpdate={updateHandler} />
      <CardHeader title={video.title} subheader={<Typography children={video.description} />} sx={{ p: "10px", color: (theme) => theme.palette.text.primary }} />
      <CardActions sx={actionStyle}>
        <IconButton sx={buttonStyle} children={<LaunchRoundedIcon />} onClick={onExpandHandler} />
        <IconButton sx={playStyle} children={state.play ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />} onClick={Playing(!state.play)} />
        <IconButton sx={buttonStyle} children={<CloseRoundedIcon />} onClick={onCloseHandler} />
      </CardActions>
    </>
  );
};

export default MiniFloatingPlayer;
