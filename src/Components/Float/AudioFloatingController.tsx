import { VolumeDownRounded, VolumeUpRounded } from "@mui/icons-material";
import { Box, CardHeader, CardMedia, IconButton, Slider, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import RepeatIcon from "@mui/icons-material/Repeat";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import KEY from "../../Key/KEY";
import { modalAction } from "../../Providers/ReduxProvider";
import { Theme } from "@mui/system";

const TinyText = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
  color: theme.palette.text.primary,
}));

const timeSliderStyle = {
  height: 4,
  "& .MuiSlider-thumb": {
    width: 8,
    height: 8,
    transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
    "&:before": {
      boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
    },
    "&:hover, &.Mui-focusVisible": {
      boxShadow: "rgb(0 0 0 / 16%)",
    },
    "&.Mui-active": {
      width: 20,
      height: 20,
    },
  },
  "& .MuiSlider-rail": {
    opacity: 0.28,
  },
};

const volumeSliderStyle = {
  color: (theme: Theme) => theme.palette.primary.light,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    width: 24,
    height: 24,
    backgroundColor: (theme: Theme) => theme.palette.primary.main,
    "&:before": {
      boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
    },
    "&:hover, &.Mui-focusVisible, &.Mui-active": {
      boxShadow: "none",
    },
  },
};

const AudioFloatingController: React.FC = (props) => {
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(1);
  const [loop, setLoop] = useState(false);
  const [play, setPlay] = useState(false);
  const audioRef = useRef<any>();
  const audio = useSelector<any, { file: string; cover: string; title: string; owner: string }>((state) => state.mediaData.inAudio);
  const dispatch = useDispatch();

  function formatDuration(value: number) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 9 ? `0${secondLeft}` : secondLeft}`;
  }
  function initiateHandler() {
    const time = audioRef.current?.getDuration();
    setDuration(Math.floor(time));
  }
  function updateHandler(data: any) {
    setPosition(Math.floor(data.playedSeconds));
  }

  function onPlayPauseHandler() {
    setPlay(!play);
  }

  function onSeekHandler(value: number) {
    audioRef.current?.seekTo(value);
  }

  function onLoopHandler() {
    setLoop(!loop);
  }

  function onSetVolumeHandler(value: number) {
    setVolume(value / 100);
  }

  function onEndedHandler() {
    audioRef.current?.seekTo(0);
    setPlay(false);
  }
  function onCloseHandler() {
    dispatch(modalAction.closeView());
  }

  return (
    <>
      <ReactPlayer
        url={`${KEY.AUDIOSERVER}/audios/?audio=${audio.file}`}
        ref={audioRef}
        progressInterval={1000}
        onPlay={initiateHandler}
        onEnded={onEndedHandler}
        onProgress={updateHandler}
        playing={play}
        loop={loop}
        volume={volume}
        style={{ display: "none" }}
      />
      <Stack direction="row" justifyContent="space-between">
        <Box width="240px" height="100%">
          <Stack direction="row" spacing={1}>
            <CardMedia src={`${KEY.PHOTOSERVER}/images/?image=${audio.cover}`} component="img" height="100px" sx={{ aspectRatio: "1/1" }} />
            <CardHeader title={audio.title} subheader={audio.owner} sx={{ color: (theme) => theme.palette.text.primary }} />
          </Stack>
        </Box>
        <Box width="50%">
          <Stack spacing={2} direction="row" p={1} alignItems="center" justifyContent="space-between">
            <IconButton children={<ShuffleIcon />} />
            <IconButton sx={{ transform: "scale(2)", p: 0 }} onClick={onPlayPauseHandler} children={play ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />} />
            <IconButton onClick={onLoopHandler} children={<RepeatIcon htmlColor={loop ? "primary" : "inherit"} />} />
          </Stack>
          <Stack direction="row" spacing={2} p={1}>
            <TinyText>{formatDuration(position)}</TinyText>
            <Slider aria-label="time-indicator" size="small" value={position} min={0} step={1} max={duration} onChange={(_, value) => onSeekHandler(value as number)} sx={timeSliderStyle} />
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: -2 }}>
              <TinyText>-{formatDuration(duration - position)}</TinyText>
            </Box>
          </Stack>
        </Box>
        <Box width="240px" height="100%">
          <IconButton sx={{ position: "absolute", right: 0, top: 0 }} children={<CloseIcon />} onClick={onCloseHandler} />
          <Stack spacing={2} direction="row" alignItems="center" width="200px" position="absolute" top="40%" right="20px">
            <VolumeDownRounded sx={{ color: (theme) => theme.palette.text.disabled }} />
            <Slider aria-label="Volume" defaultValue={100} onChange={(_, value) => onSetVolumeHandler(value as number)} sx={volumeSliderStyle} />
            <VolumeUpRounded sx={{ color: (theme) => theme.palette.text.disabled }} />
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default AudioFloatingController;
