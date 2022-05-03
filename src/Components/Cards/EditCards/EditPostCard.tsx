import { Button, Card, CardActions, CardContent, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import CheckboxInput from "../_Inputs/CheckBoxInput";
import TextInput from "../_Inputs/TextInput";
import SendIcon from "@mui/icons-material/Send";
import { gql, useMutation } from "@apollo/client";
import { useSnackbar } from "notistack";
import ShowError from "../../Component/ShowError";

type postContent = {
  postDescription: string;
  postDisableLike: boolean;
  postDisableComment: boolean;
};

type EditPostCardType = {
  postid: string;
  toEdit: postContent;
  onDone: () => void;
};

const UpdatePost = gql`
  mutation UpdatePost($postid: String!, $content: String, $disablelike: Boolean!, $disablecomment: Boolean!) {
    editpost(postid: $postid, content: $content, disablelike: $disablelike, disablecomment: $disablecomment) {
      message
    }
  }
`;

const EditPostCard: React.FC<EditPostCardType> = (props) => {
  const [description, setDescription] = useState({ accepted: false, Msg: "", value: "" });
  const [disableLike, setDisableLike] = useState(false);
  const [disableComment, setDisableComment] = useState(false);
  const [editPost, { loading, error }] = useMutation(UpdatePost, { refetchQueries: ["GETPOST"] });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setDescription({
      accepted: true,
      Msg: "",
      value: props.toEdit.postDescription,
    });
    setDisableLike(props.toEdit.postDisableLike);
    setDisableComment(props.toEdit.postDisableComment);
  }, []);

  async function onUpdateHandler() {
    if (!description.accepted) enqueueSnackbar(description.Msg, { variant: "error" });
    else {
      try {
        const success = await editPost({ variables: { postid: props.postid, content: description.value, disablelike: disableLike, disablecomment: disableComment } });
        if (success.data) {
          enqueueSnackbar(success.data.editpost.message, { variant: "success" });
          props.onDone();
        }
      } catch (error) {
        enqueueSnackbar("Edit Post Unsuccessful", { variant: "error" });
      }
    }
  }

  return (
    <Card>
      <CardContent>
        <TextInput setData={setDescription} value={description.value} accepted={description.accepted} multiline={true} type="text" variant={undefined} label="Description" />
        <CheckboxInput setDataFirst={setDisableLike} setDataSecond={setDisableComment} checkfirst={disableLike} checksecond={disableComment} labelfirst="Disalbe Like" labelsecond="Disable Comment" />
      </CardContent>
      <CardActions>
        {loading ? (
          <CircularProgress color="inherit" sx={{ margin: "auto" }} />
        ) : (
          <Button variant="contained" endIcon={<SendIcon />} sx={{ margin: "auto", width: "200px" }} onClick={onUpdateHandler} children={"UPDATE"} />
        )}
      </CardActions>
      {error && <ShowError error={error} />}
    </Card>
  );
};

export default EditPostCard;
