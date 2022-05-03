import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, IconButton } from "@mui/material";
import UserAvatar from "../../UI/UserAvatar";
import SendIcon from "@mui/icons-material/Send";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { gql, useMutation } from "@apollo/client";
import { queryAction } from "../../../Providers/ReduxProvider";
import TextInput from "../_Inputs/TextInput";
import KEY from "../../../Key/KEY";
import PhotoFileInput from "../_Inputs/PhotoFileInput";
import CheckboxInput from "../_Inputs/CheckBoxInput";
import ShowError from "../../Component/ShowError";

const Post = gql`
  mutation Post($userid: String!, $content: String, $file: String, $disablelike: Boolean!, $disablecomment: Boolean!) {
    post(userid: $userid, content: $content, file: $file, disablelike: $disablelike, disablecomment: $disablecomment) {
      message
    }
  }
`;

type AddPostCardType = {
  onClose: () => void;
};

const AddPostCard: React.FC<AddPostCardType> = (Props) => {
  const [isloading, setIsLoading] = useState(false);
  const [description, setDescription] = useState({ accepted: false, Msg: "", value: "" });
  const [imgData, setImgData] = useState({ accepted: true, Msg: "", file: "" });
  const [disableLike, setDisableLike] = useState(false);
  const [disableComment, setDisableComment] = useState(false);
  const username = useSelector<any, string>((state) => state.auth.userName);
  const id = useSelector<any, string>((state) => state.auth.ID);
  const [post, { loading, error }] = useMutation(Post, { refetchQueries: ["GETPOST"] });
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  async function onSubmitHandler() {
    if (!imgData.accepted) enqueueSnackbar("image file: " + imgData.Msg, { variant: "error" });
    else if (!description.accepted) enqueueSnackbar("Description: " + description.Msg, { variant: "error" });
    else {
      try {
        const success = await post({
          variables: { content: description.value, userid: id, file: imgData.file, disablelike: disableLike, disablecomment: disableComment },
        });
        if (success) {
          enqueueSnackbar(success.data.post.message, { variant: "success" });
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
      {imgData.file && <CardMedia component="img" height="400" src={`${KEY.PHOTOSERVER}/images/?image=${imgData.file}`} />}
      <CardContent>
        <PhotoFileInput setData={setImgData} imgFile={imgData.file} imgName={imgData.Msg} accepted={imgData.accepted} name="uplaod image" fullWidth={false} isLoading={setIsLoading} />
        <TextInput setData={setDescription} label="Description" type="text" variant={undefined} accepted={description.accepted} multiline={false} value={description.value} />
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

export default AddPostCard;
