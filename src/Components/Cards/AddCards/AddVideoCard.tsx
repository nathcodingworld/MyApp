import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Divider, IconButton } from "@mui/material";
import UserAvatar from "../../UI/UserAvatar";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import KEY from "../../../Key/KEY";
import { useSnackbar } from "notistack";
import { gql, useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { queryAction } from "../../../Providers/ReduxProvider";
import PhotoFileInput from "../_Inputs/PhotoFileInput";
import VideoFileInput from "../_Inputs/VideoFileInput";
import TextInput from "../_Inputs/TextInput";
import CheckboxInput from "../_Inputs/CheckBoxInput";
import ShowError from "../../Component/ShowError";

type AddVideoCardType = {
  onClose: () => void;
};

const Video = gql`
  mutation Video($userid: String!, $description: String, $title: String!, $thumbnail: String, $file: String!, $disablelike: Boolean!, $disablecomment: Boolean!) {
    video(userid: $userid, description: $description, title: $title, thumbnail: $thumbnail, file: $file, disablelike: $disablelike, disablecomment: $disablecomment) {
      message
    }
  }
`;

const AddVideoCard: React.FC<AddVideoCardType> = (Props) => {
  const [isloading, setIsLoading] = useState(false);
  const [vdeData, setVdeData] = useState({ accepted: false, Msg: "", file: "" });
  const [imgData, setImgData] = useState({ accepted: false, Msg: "", file: "" });
  const [title, setTitle] = useState({ accepted: false, Msg: "", value: "" });
  const [description, setDescription] = useState({ accepted: false, Msg: "", value: "" });
  const [disableLike, setDisableLike] = useState(false);
  const [disableComment, setDisableComment] = useState(false);
  const [video, { loading, error }] = useMutation(Video, { refetchQueries: ["GETVIDEO"] });
  const { enqueueSnackbar } = useSnackbar();
  const username = useSelector<any, string>((state) => state.auth.userName);
  const id = useSelector<any, string>((state) => state.auth.ID);
  const dispatch = useDispatch();

  async function onSubmitHandler() {
    if (!imgData.accepted) enqueueSnackbar(imgData.Msg, { variant: "error" });
    if (!vdeData.accepted) enqueueSnackbar(vdeData.Msg, { variant: "error" });
    if (!title.accepted) enqueueSnackbar(`Title: ${title.Msg}`, { variant: "error" });
    if (!description.accepted) enqueueSnackbar(`Description: ${description.Msg}`, { variant: "error" });
    if (imgData.accepted && vdeData.accepted && title.accepted && description.accepted) {
      try {
        const success = await video({
          variables: {
            userid: id,
            title: title.value,
            description: description.value,
            thumbnail: imgData.file,
            file: vdeData.file,
            disablecomment: disableComment,
            disablelike: disableLike,
          },
        });
        enqueueSnackbar(success.data.video.message, { variant: "success" });
        dispatch(queryAction.success());
        Props.onClose();
      } catch (error) {
        enqueueSnackbar("Post Unsuccessful", { variant: "error" });
        dispatch(queryAction.failed({ img: imgData.file, vdo: vdeData.file, aud: "" }));
      }
    }
  }

  return (
    <Card>
      <CardHeader avatar={<UserAvatar />} title={username} subheader={new Date().toDateString()} action={!isloading && <IconButton children={<SendIcon />} onClick={onSubmitHandler} />} />
      <Divider />
      {imgData.file && <CardMedia component="img" height="194" src={`${KEY.PHOTOSERVER}/images/?image=${imgData.file}`} />}
      <CardContent>
        <PhotoFileInput setData={setImgData} name="Upload Thumbnail" imgFile={imgData.file} imgName={imgData.Msg} accepted={imgData.accepted} fullWidth={true} isLoading={setIsLoading} />
        <VideoFileInput setData={setVdeData} vdoFile={vdeData.file} isLoading={setIsLoading} />
        <CheckboxInput setDataFirst={setDisableLike} setDataSecond={setDisableComment} checkfirst={disableLike} checksecond={disableComment} labelfirst="Disable Like" labelsecond="Disable Comments" />
        <TextInput setData={setTitle} variant="standard" label="Title" type="text" accepted={title.accepted} multiline={false} value={title.value} />
        <TextInput setData={setDescription} variant={undefined} label="Descriptions" type="text" accepted={description.accepted} multiline={true} value={description.value} />
      </CardContent>
      <CardActions>
        {loading || isloading ? (
          <CircularProgress color="inherit" sx={{ margin: "auto" }} />
        ) : error ? (
          <ShowError error={error} />
        ) : (
          <Button variant="contained" endIcon={<PlayArrowIcon />} sx={{ margin: "auto", width: "200px" }} onClick={onSubmitHandler} children="Post" />
        )}
      </CardActions>
    </Card>
  );
};

export default AddVideoCard;
