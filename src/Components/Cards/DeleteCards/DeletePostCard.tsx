import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Divider, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import KEY from "../../../Key/KEY";
import { useDeleteImageMutation } from "../../../Providers/APIs/ImageApi";
import ContentLoader from "../../Component/ContentLoader";
import ShowError from "../../Component/ShowError";
import DisableExpresion from "../_Inputs/DisabledExpresion";
import DisabledTextInput from "../_Inputs/DisabledTextInput";

type DeletePostCardType = {
  for: string;
  postid: string;
};

const PreDeletePost = gql`
  query PreDeletePost($id: String!) {
    getOnePost(id: $id) {
      file
      content
      comment
      like
    }
  }
`;

const DeletePost = gql`
  mutation DeletePost($postid: String!, $userid: String!, $file: String) {
    deletepost(postid: $postid, userid: $userid, file: $file) {
      message
    }
  }
`;

const DeletePostCard: React.FC<DeletePostCardType> = (props) => {
  const { loading, error, data } = useQuery(PreDeletePost, { variables: { id: props.postid } });
  const [deletePost, { loading: ld }] = useMutation(DeletePost, { refetchQueries: ["GETPOST"] });
  const [deleteImage] = useDeleteImageMutation();
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const { enqueueSnackbar } = useSnackbar();

  async function onDeleteHandler() {
    try {
      const success = await deletePost({ variables: { postid: props.postid, userid: userid, file: data.getOnePost.file } });
      if (success.data) {
        if (data.getOnePost.file) deleteImage(data.getOnePost.file);
        enqueueSnackbar(success.data.deletepost.message, { variant: "success" });
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    }
  }

  if (loading) return <ContentLoader />;
  if (error) return <ShowError error={error} />;

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" children={`Delete ${props.for}`} textAlign="center" />
        <Divider />
        {data.getOnePost.file && <CardMedia component="img" height="400" src={`${KEY.PHOTOSERVER}/images/?image=${data.getOnePost.file}`} />}
        <DisabledTextInput multiline={true} label="Content" value={data.getOnePost.content} />
        <DisableExpresion A={data.getOnePost.like} B={data.getOnePost.comment} Aicon="thumbup" Bicon="comments" />
      </CardContent>
      {ld ? <CircularProgress color="inherit" sx={{ margin: "auto" }} /> : <CardActions children={<Button sx={{ margin: "auto" }} onClick={onDeleteHandler} children="DELETE" />} />}
    </Card>
  );
};

export default DeletePostCard;
