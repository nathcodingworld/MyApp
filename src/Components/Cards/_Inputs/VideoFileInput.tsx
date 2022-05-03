import { Button, Input, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import KEY from "../../../Key/KEY";
import { useDeleteVideoMutation, usePutVideoMutation } from "../../../Providers/APIs/VideoApi";

type VideoFileInputType = {
  vdoFile: string;
  setData: (args: { accepted: boolean; Msg: string; file: string }) => void;
  isLoading: (state: boolean) => void;
};

const VideoFileInput: React.FC<VideoFileInputType> = (props) => {
  const [deleteVideo] = useDeleteVideoMutation();
  const [putVideo, { isLoading }] = usePutVideoMutation();
  const { enqueueSnackbar } = useSnackbar();

  async function validateStorePlayVideoHandler(e: any) {
    const [type, ext] = e.target.files[0].type.split("/");
    const acceptable = ["mp4", "wmv", "mov", "avi", "avchd", "mkv", "webm", "flv"];
    const accepted = type === "video" && acceptable.includes(ext);
    let file = "";
    let Msg = "Add File";
    if (accepted) {
      file = e.target.files[0];
      Msg = e.target.files[0].name;
      const formdata = new FormData();
      formdata.append("video", file);
      if (props.vdoFile) deleteVideo(props.vdoFile);
      try {
        const vdourl: any = await putVideo(formdata);
        if (vdourl.data.message === "File stored.") {
          const url = vdourl.data.filePath.split(`\\`)[1];
          file = url;
        }
      } catch (error) {
        enqueueSnackbar("file video can't store to server", { variant: "warning" });
      }
    } else {
      Msg = "input video file only";
      file = "";
    }
    props.setData({
      accepted,
      Msg,
      file,
    });
  }

  useEffect(() => {
    props.isLoading(isLoading);
  }, [isLoading]);

  function onWarningHandler() {
    enqueueSnackbar("please choose small size video file", { variant: "warning" });
  }

  return (
    <label htmlFor="contained-button-videofile">
      <Input type="file" sx={{ display: "none" }} id="contained-button-videofile" onChange={validateStorePlayVideoHandler} />
      <Stack direction="row" spacing={2} sx={{ width: "100%", height: "max-content", margin: "5px 0" }}>
        <Button variant="outlined" component="span" onClick={onWarningHandler}>
          video file
        </Button>
        {props.vdoFile && <video src={`${KEY.VIDEOSERVER}/videos/?video=${props.vdoFile}`} autoPlay height={"100px"} />}
      </Stack>
    </label>
  );
};

export default VideoFileInput;
