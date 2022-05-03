import { Button, Input, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useDeleteAudioMutation, usePutAudioMutation } from "../../../Providers/APIs/AudioApi";

type AudioFileInputType = {
  audFile: string;
  audMsg: string;
  setData: (args: { accepted: boolean; Msg: string; file: string }) => void;
  isLoading: (state: boolean) => void;
};

const AudioFileInput: React.FC<AudioFileInputType> = (props) => {
  const [deleteAudio] = useDeleteAudioMutation();
  const [putAudio, { isLoading }] = usePutAudioMutation();
  const { enqueueSnackbar } = useSnackbar();

  async function validateStoreAudioHandler(e: any) {
    const [type, ext] = e.target.files[0].type.split("/");
    const acceptable = ["mp3", "x-m4a", "wav", "mid", "aif"];
    const accepted = type === "audio" && acceptable.includes(ext);
    let file = "";
    let Msg = "Add File";
    if (accepted) {
      file = e.target.files[0];
      Msg = e.target.files[0].name;
      const formdata = new FormData();
      formdata.append("audio", file);
      if (props.audFile) deleteAudio(props.audFile);
      try {
        const audurl: any = await putAudio(formdata);
        if (audurl.data.message === "File stored.") {
          const url = audurl.data.filePath.split(`\\`)[1];
          file = url;
        }
      } catch (error) {
        enqueueSnackbar("file audio can't store to server", { variant: "warning" });
      }
    } else {
      Msg = "input audio file only";
      file = "";
    }
    props.setData({
      accepted,
      file,
      Msg,
    });
  }

  useEffect(() => {
    props.isLoading(isLoading);
  }, [isLoading]);

  function onWarningHandler() {
    enqueueSnackbar("please choose small size audio file", { variant: "warning" });
  }

  return (
    <label htmlFor="contained-button-file">
      <Input type="file" sx={{ display: "none" }} id="contained-button-file" onChange={validateStoreAudioHandler} />
      <Stack direction="row" spacing={2} sx={{ width: "100%", height: "25px", margin: "5px 0" }}>
        <Button variant="outlined" component="span" onClick={onWarningHandler}>
          Audio file
        </Button>
        <Input disabled value={props.audMsg} />
      </Stack>
    </label>
  );
};

export default AudioFileInput;
