import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Divider, IconButton } from "@mui/material";
import UserAvatar from "../../UI/UserAvatar";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { gql, useMutation } from "@apollo/client";
import { queryAction } from "../../../Providers/ReduxProvider";

import KEY from "../../../Key/KEY";
import PhotoFileInput from "../_Inputs/PhotoFileInput";
import TextInput from "../_Inputs/TextInput";
import CheckboxInput from "../_Inputs/CheckBoxInput";
import ShowError from "../../Component/ShowError";

type AddPhotoCardType = {
  onClose: () => void;
};

const Photo = gql`
  mutation Photo($userid: String!, $caption: String, $file: String!, $disablelike: Boolean!, $disablecomment: Boolean!) {
    photo(userid: $userid, caption: $caption, file: $file, disablelike: $disablelike, disablecomment: $disablecomment) {
      message
    }
  }
`;

const AddPhotoCard: React.FC<AddPhotoCardType> = (Props) => {
  const [isloading, setIsLoading] = useState(false);
  const [imgData, setImgData] = useState({ accepted: false, Msg: "", file: "" });
  const [caption, setCaption] = useState({ accepted: false, Msg: "", value: "" });
  const [disableLike, setDisableLike] = useState(false);
  const [disableComment, setDisableComment] = useState(false);
  const [photo, { loading, error }] = useMutation(Photo, { refetchQueries: ["GETPHOTO"] });
  const username = useSelector<any, string>((state) => state.auth.userName);
  const id = useSelector<any, string>((state) => state.auth.ID);
  const userpic = useSelector<any, string>((state) => state.auth.propic);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  async function onSubmitHandler() {
    if (!imgData.accepted) enqueueSnackbar(`Image File: ${imgData.Msg}`, { variant: "error" });
    if (!caption.accepted) enqueueSnackbar(`Image File: ${caption.Msg}`, { variant: "error" });
    if (imgData.accepted && caption.accepted) {
      try {
        const success = await photo({
          variables: { name: username, userid: id, propic: userpic, file: imgData.file, caption: caption.value, disablelike: disableLike, disablecomment: disableComment },
        });
        if (success) {
          enqueueSnackbar(success.data.photo.message, { variant: "success" });
          dispatch(queryAction.success());
          Props.onClose();
        }
      } catch (error) {
        enqueueSnackbar("Post Unsuccessful", { variant: "error" });
        dispatch(queryAction.failed({ img: imgData.file, vdo: "", aud: "" }));
      }
    }
  }

  return (
    <Card>
      <CardHeader avatar={<UserAvatar />} title={username} subheader={new Date().toDateString()} action={!isloading && <IconButton children={<SendIcon />} onClick={onSubmitHandler} />} />
      <Divider />
      {imgData.file && <CardMedia component="img" height="400" src={`${KEY.PHOTOSERVER}/images/?image=${imgData.file}`} />}
      <CardContent>
        <PhotoFileInput setData={setImgData} imgFile={imgData.file} imgName={imgData.Msg} accepted={imgData.accepted} name="Choose Image File" fullWidth={true} isLoading={setIsLoading} />
        <TextInput setData={setCaption} label="Caption" type="text" variant={undefined} multiline={true} accepted={caption.accepted} value={caption.value} />
        <CheckboxInput setDataFirst={setDisableLike} setDataSecond={setDisableComment} checkfirst={disableLike} checksecond={disableComment} labelfirst="Disable Like" labelsecond="Disable Comments" />
      </CardContent>
      <CardActions>
        {loading || isloading ? (
          <CircularProgress color="inherit" sx={{ margin: "auto" }} />
        ) : error ? (
          <ShowError error={error} />
        ) : (
          <Button variant="contained" endIcon={<SendIcon />} sx={{ margin: "auto", width: "200px" }} onClick={onSubmitHandler} children="Post" />
        )}
      </CardActions>
    </Card>
  );
};

export default AddPhotoCard;
