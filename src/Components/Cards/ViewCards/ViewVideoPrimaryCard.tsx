import { gql, useMutation } from "@apollo/client";
import { Card, CardActions, CardContent, CardHeader, CircularProgress, Divider, Grid, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useSelector } from "react-redux";
import Comments from "../../Component/Comments";
import Expression from "../../Component/Expressions";
import ShowError from "../../Component/ShowError";
import VideoPlayer from "../../Player/VideoPlayer";
import UserAvatar from "../../UI/UserAvatar";
import CommentInput from "../_Inputs/CommentInput";

type ViewVideoPrimaryCardType = {
  id: string;
  title: string;
  viewcomment: string;
  file: string;
  like: number;
  dislike: number;
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

const exprsStyle = { display: "flex", flexDirection: "row", justifyContent: "flex-end", p: "8px 25px" };

const iVideoLike = gql`
  mutation iVideoLike($videoid: String!, $userid: String!) {
    ivideolike(videoid: $videoid, userid: $userid) {
      like
    }
  }
`;

const iVideoDislike = gql`
  mutation iVideoDislike($videoid: String!, $userid: String!) {
    ivideodislike(videoid: $videoid, userid: $userid) {
      dislike
    }
  }
`;

const iVideoComment = gql`
  mutation iVideoComment($videoid: String!, $userid: String!, $comment: String) {
    ivideocomment(videoid: $videoid, userid: $userid, comment: $comment) {
      userid {
        userName
        avatar
      }
      comment
      date
    }
  }
`;

const ViewVideoPrimaryCard: React.FC<ViewVideoPrimaryCardType> = (props) => {
  const [videolike, { loading, error, data }] = useMutation(iVideoLike);
  const [videodislike, { loading: ld, error: err, data: dt }] = useMutation(iVideoDislike);
  const [videocomment, { loading: cld, error: cerr, data: cdt }] = useMutation(iVideoComment);
  const [commentData, setCommentData] = useState({ accepted: false, Msg: "must not empty", value: "" });
  const expanded = useSelector<any>((state) => state.mediaData.videoState.expand);
  const userid = useSelector<any>((state) => state.auth.ID);
  const { enqueueSnackbar } = useSnackbar();

  function onDislikeHandler() {
    videodislike({ variables: { videoid: props.id, userid: userid } });
  }
  function onLikeHandler() {
    videolike({ variables: { videoid: props.id, userid: userid } });
  }

  function onSubmitCommentHandler(e: any) {
    if (e.key === "Enter") {
      if (!commentData.accepted) enqueueSnackbar(commentData.Msg, { variant: "error" });
      else {
        videocomment({ variables: { videoid: props.id, userid: userid, comment: commentData.value } });
        setCommentData({ accepted: false, Msg: "", value: "" });
      }
    }
  }

  return (
    <Grid item md={8} xs={12}>
      <Card>
        {!expanded && (
          <CardContent sx={{ backgroundColor: "black", p: 0 }}>
            <VideoPlayer file={props.file} like={props.like} dislike={props.dislike} id={props.id} disablelike={props.disablelike} />
          </CardContent>
        )}
        <Divider />
        <CardHeader title={props.title} subheader={props.viewcomment} />
        <Divider />
        <CardActions sx={exprsStyle}>
          {loading || ld ? (
            <CircularProgress color="inherit" sx={{ margin: "auto" }} />
          ) : error ? (
            <ShowError error={error} />
          ) : err ? (
            <ShowError error={err} />
          ) : (
            <Expression
              width="100px"
              A={data ? data.ivideolike.like : props.like}
              Aicon="thumbup"
              handleAClick={onLikeHandler}
              B={dt ? dt.ivideodislike.dislike : props.dislike}
              Bicon="thumbdown"
              handleBClick={onDislikeHandler}
              ADisable={props.disablelike}
              BDisable={props.disablelike}
            />
          )}
        </CardActions>
        <Divider />
        <CardContent>
          <Stack direction="row" spacing={2} sx={{ width: "100%", marginTop: 2 }}>
            <UserAvatar />
            <CommentInput setData={setCommentData} accepted={commentData.accepted} onPressEnter={onSubmitCommentHandler} value={commentData.value} disabled={props.disablecomment} reff={undefined} />
          </Stack>
          {cld ? <CircularProgress color="inherit" sx={{ margin: "auto" }} /> : cerr ? <ShowError error={cerr} /> : <Comments comments={cdt ? cdt.ivideocomment : props.comments} />}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ViewVideoPrimaryCard;
