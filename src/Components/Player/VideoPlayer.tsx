import { Button, CircularProgress, Stack } from "@mui/material";
import { useEffect, useRef } from "react";
import ReactPlayer from "react-player/lazy";
import ViewCompactOutlinedIcon from "@mui/icons-material/ViewCompactOutlined";
import ViewSidebarOutlinedIcon from "@mui/icons-material/ViewSidebarOutlined";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import { useDispatch, useSelector } from "react-redux";
import { mediaDataAction } from "../../Providers/ReduxProvider";
import KEY from "../../Key/KEY";
import { gql, useMutation } from "@apollo/client";

type VideoPlayerType = {
  id: string;
  file: string;
  like: number;
  dislike: number;
  disablelike: boolean;
};
const white = { color: "white" };

const iVideoLike = gql`
  mutation iVideoLike($videoid: String!, $userid: String!) {
    ivideolike(videoid: $videoid, userid: $userid) {
      like
    }
  }
`;

const iVideoDislike = gql`
  mutation iVideoDislike($videoid: String!, $userid: String!) {
    ivideodislike(videoid: $videoid, userid: $userid) {
      dislike
    }
  }
`;

const VideoPlayer: React.FC<VideoPlayerType> = (props) => {
  const [videolike, { loading, error, data }] = useMutation(iVideoLike);
  const [videodislike, { loading: ld, error: err, data: dt }] = useMutation(iVideoDislike);
  const videoRef = useRef<any>();
  const dispatch = useDispatch();
  const state = useSelector<any, { time: number; play: boolean; expand: boolean }>((state) => state.mediaData.videoState);
  const userid = useSelector<any, string>((state) => state.auth.ID);

  const Playing = (state: boolean) => () => {
    dispatch(mediaDataAction.playVideo(state));
  };

  function onExpandHandler() {
    dispatch(mediaDataAction.expandVideo());
  }

  useEffect(() => {
    videoRef.current?.seekTo(state.time);
  }, [state.expand]);

  function onDislikeHandler() {
    videodislike({ variables: { videoid: props.id, userid: userid } });
  }
  function onLikeHandler() {
    videolike({ variables: { videoid: props.id, userid: userid } });
  }
  function ontimeupdateHandler(data: any) {
    dispatch(mediaDataAction.updateVideo(data.playedSeconds));
  }

  return (
    <>
      <ReactPlayer
        ref={videoRef}
        url={`${KEY.VIDEOSERVER}/videos/?video=${props.file}`}
        playing={state.play}
        controls
        height="100%"
        width="100%"
        onPlay={Playing(true)}
        onPause={Playing(false)}
        onProgress={ontimeupdateHandler}
      />
      <Stack direction="row" justifyContent="space-between" p="0 10px">
        <Button startIcon={state.expand ? <ViewSidebarOutlinedIcon sx={white} /> : <ViewCompactOutlinedIcon sx={white} />} onClick={onExpandHandler} />
        <Stack direction="row">
          {loading ? (
            <CircularProgress color="inherit" sx={{ margin: "auto" }} />
          ) : error ? (
            <p>Error</p>
          ) : (
            <Button sx={white} startIcon={<ThumbUpIcon />} children={data ? data.ivideolike.like : props.like} onClick={onLikeHandler} disabled={props.disablelike} />
          )}
          {ld ? (
            <CircularProgress color="inherit" sx={{ margin: "auto" }} />
          ) : err ? (
            <p>Error</p>
          ) : (
            <Button sx={white} startIcon={<ThumbDownIcon />} children={dt ? dt.ivideodislike.dislike : props.dislike} onClick={onDislikeHandler} disabled={props.disablelike} />
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default VideoPlayer;
