import { gql, useMutation } from "@apollo/client";
import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Divider, Grid, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import KEY from "../../Key/KEY";
import Comments from "../Component/Comments";
import Expression from "../Component/Expressions";
import More from "../Component/More";
import ShowError from "../Component/ShowError";
import DeleteModal from "../Modal/DeleteModal";
import EditModal from "../Modal/EditModal";
import UserAvatar from "../UI/UserAvatar";
import CommentInput from "./_Inputs/CommentInput";

const postStyle = {
  width: { xs: "100%", md: 700 },
  height: "max-content",
  margin: "auto",
};
const exprsStyle = { display: "flex", flexDirection: "row", justifyContent: "space-between", p: "8px 25px" };

type PostCardType = {
  id: string;
  userid: string;
  propic: string;
  file: string | null;
  name: string;
  date: string;
  content: string;
  like: number;
  comment: number;
  disablelike: boolean;
  disablecomment: boolean;
  comments:
    | {
        userid: {
          userName: string;
          avatar: string;
        };
        date: string;
        comment: string;
        // replys: { id: string; reply: string }[] | null;
      }[]
    | null;
};

const iPostLike = gql`
  mutation iPostLike($postid: String!, $userid: String!) {
    ipostlike(postid: $postid, userid: $userid) {
      like
    }
  }
`;
const iPostComment = gql`
  mutation iPostComment($postid: String!, $userid: String!, $comment: String) {
    ipostcomment(postid: $postid, userid: $userid, comment: $comment) {
      userid {
        userName
        avatar
      }
      comment
      date
    }
  }
`;

const PostCard: React.FC<PostCardType> = (props) => {
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const isAuth = useSelector<any, boolean>((state) => state.auth.isAuth);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [commentData, setCommentData] = useState({ accepted: false, Msg: "", value: "" });
  const [like, { loading, error, data }] = useMutation(iPostLike);
  const [submitComment, { loading: ld, error: err, data: dt }] = useMutation(iPostComment);
  const { enqueueSnackbar } = useSnackbar();
  const comRef = useRef<any>();
  function onlikeHandler() {
    like({ variables: { postid: props.id, userid: userid } });
  }
  function onFocusHandler(e: any) {
    e.stopPropagation();
    comRef.current.focus();
  }

  async function submitCommentHandler(e: any) {
    if (e.key === "Enter") {
      if (!commentData.accepted) enqueueSnackbar(commentData.Msg, { variant: "error" });
      else {
        try {
          const success = await submitComment({ variables: { postid: props.id, userid: userid, comment: commentData.value } });
          if (success) setCommentData({ accepted: false, Msg: "", value: "" });
        } catch (error) {
          enqueueSnackbar("an error occured", { variant: "error" });
        }
      }
    }
  }

  return (
    <Grid item xs={12}>
      <Card sx={postStyle}>
        <CardHeader
          avatar={<Avatar alt="user" src={`${KEY.PHOTOSERVER}/images/?image=${props.propic}`} />}
          title={props.name}
          subheader={props.date}
          action={<More onDeleting={setDeleting} onEditing={setEditing} for="Post" authorize={isAuth && userid === props.userid} sx={{}} />}
        />
        <CardContent children={<Typography children={props.content} />} />
        <Divider />
        {props.file && <CardMedia src={`${KEY.PHOTOSERVER}/images/?image=${props.file}`} component="img" />}
        <CardActions sx={exprsStyle}>
          {loading ? (
            <CircularProgress color="inherit" sx={{ margin: "auto" }} />
          ) : error ? (
            <ShowError error={error} />
          ) : (
            <Expression
              width="200px"
              A={data ? data.ipostlike.like : props.like}
              Aicon="thumbup"
              handleAClick={onlikeHandler}
              B={props.comment}
              Bicon="comments"
              handleBClick={onFocusHandler}
              ADisable={props.disablelike}
              BDisable={props.disablecomment}
            />
          )}
        </CardActions>
        <Divider />
        <CardContent>
          {ld ? <CircularProgress color="inherit" sx={{ margin: "auto" }} /> : <Comments comments={dt ? dt.ipostcomment : props.comments} />}
          {err ? (
            <ShowError error={err} />
          ) : (
            <Stack direction="row" spacing={2} sx={{ width: "100%", marginTop: 2 }}>
              <UserAvatar />
              <CommentInput accepted={commentData.accepted} setData={setCommentData} onPressEnter={submitCommentHandler} value={commentData.value} disabled={props.disablecomment} reff={comRef} />
            </Stack>
          )}
        </CardContent>
      </Card>
      <EditModal
        onClose={setEditing}
        open={editing}
        page="Post"
        id={props.id}
        content={{ postDescription: props.content, postDisableLike: props.disablelike, postDisableComment: props.disablecomment }}
      />
      <DeleteModal onDelete={undefined} onClose={setDeleting} open={deleting} page="Post" idToDelete={props.id} />
    </Grid>
  );
};

export default PostCard;
