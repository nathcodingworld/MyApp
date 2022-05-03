import { Button, Input, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useDeleteImageMutation, usePutImageMutation } from "../../../Providers/APIs/ImageApi";

type PhotoFileInputType = {
  imgFile: string;
  accepted: boolean;
  imgName: string;
  name: string;
  fullWidth: boolean;
  setData: (args: { accepted: boolean; Msg: string; file: string }) => void;
  isLoading: (state: boolean) => void;
};

const PhotoFileInput: React.FC<PhotoFileInputType> = (props) => {
  const [putImage, { isLoading }] = usePutImageMutation();
  const [deleteImage] = useDeleteImageMutation();
  const { enqueueSnackbar } = useSnackbar();

  async function validateStoreViewImageHandler(e: any) {
    const [type, ext] = e.target.files[0].type.split("/");
    const acceptable = ["png", "jpeg", "jpg"];
    const accepted = type === "image" && acceptable.includes(ext);
    let file = "";
    let Msg = "Add File";
    if (accepted) {
      file = e.target.files[0];
      Msg = e.target.files[0].name;
      const formdata = new FormData();
      formdata.append("image", file);
      if (props.imgFile) deleteImage(props.imgFile);
      try {
        const imgurl: any = await putImage(formdata);
        if (imgurl.data.message === "File stored.") {
          const url = imgurl.data.filePath.split(`\\`)[1];
          file = url;
        }
      } catch (error) {
        enqueueSnackbar("file image can't store to server", { variant: "warning" });
      }
    } else {
      Msg = "input image file only";
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
    enqueueSnackbar("please choose small size image only", { variant: "warning" });
  }

  return (
    <label htmlFor="profile-file">
      <Input type="file" sx={{ display: "none" }} id="profile-file" onChange={validateStoreViewImageHandler} />
      <Stack direction="row" spacing={2} sx={{ width: "100%", pt: "10px", height: "25px", margin: "5px 0" }}>
        <Button variant="outlined" component="span" color={props.accepted ? "primary" : "error"} fullWidth={props.fullWidth} onClick={onWarningHandler}>
          {props.name}
        </Button>
        {!props.fullWidth && <Input disabled value={props.imgName} />}
      </Stack>
    </label>
  );
};

export default PhotoFileInput;
