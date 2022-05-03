import { gql, useMutation, useQuery } from "@apollo/client";
import { Avatar, Card, CardActions, CardContent, CardHeader, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import KEY from "../../../Key/KEY";
import Comments from "../../Component/Comments";
import ContentLoader from "../../Component/ContentLoader";
import Expression from "../../Component/Expressions";
import More from "../../Component/More";
import ShowError from "../../Component/ShowError";
import DeleteModal from "../../Modal/DeleteModal";
import EditModal from "../../Modal/EditModal";
import UserAvatar from "../../UI/UserAvatar";
import CommentInput from "../_Inputs/CommentInput";

const cardStyle = {
  width: { md: "400px", xs: "100%" },
  height: { md: "100%", xs: "max-content" },
  display: "flex",
  flexDirection: "column",
  justifyContent: { md: "space-between", xs: "flex-end" },
  flexShrink: "0",
};
const exprsStyle = { display: "flex", flexDirection: "row", justifyContent: "space-around", p: "8px 25px" };

const GETONEPHOTO = gql`
  query GETONEPHOTO($id: String!) {
    getOnePhoto(id: $id) {
      userid {
        userName
        avatar
      }
      date
      caption
      like
      comment
      disablelike
      disablecomment
      comments {
        userid {
          userName
          avatar
        }
        date
        comment
      }
    }
  }
`;
const iPhotoLike = gql`
  mutation iPhotoLike($photoid: String!, $userid: String!) {
    iphotolike(photoid: $photoid, userid: $userid) {
      like
    }
  }
`;

const iPhotoComment = gql`
  mutation iPhotoComment($photoid: String!, $userid: String!, $comment: String) {
    iphotocomment(photoid: $photoid, userid: $userid, comment: $comment) {
      userid {
        userName
        avatar
      }
      comment
      date
    }
  }
`;

type ViewPhotoCaptionCardType = {
  onClose: () => void;
};

const ViewPhotoCaptionCard: React.FC<ViewPhotoCaptionCardType> = (props) => {
  const photoid = useSelector<any, string>((state) => state.mediaData.photoid);
  const photouserid = useSelector<any, string>((state) => state.mediaData.userid);
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const isAuth = useSelector<any, boolean>((state) => state.auth.isAuth);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [commentData, setCommentData] = useState({ accepted: false, Msg: "must not empty", value: "" });
  const { loading, error, data } = useQuery(GETONEPHOTO, { variables: { id: photoid } });
  const [photolike, { loading: ld, error: err, data: dt }] = useMutation(iPhotoLike);
  const [photocomment, { loading: cld, error: cerr, data: cdt }] = useMutation(iPhotoComment);
  const { enqueueSnackbar } = useSnackbar();
  const comRef = useRef<any>();

  function photoLikeHandler() {
    photolike({ variables: { photoid: photoid, userid: userid } });
  }
  function onFocusHandler() {
    comRef.current.focus();
  }

  if (loading) return <ContentLoader />;
  if (error) return <ShowError error={error} />;

  function onSubmitingCommentHandler(e: any) {
    if (e.key === "Enter") {
      if (!commentData.accepted) enqueueSnackbar(commentData.Msg, { variant: "error" });
      else {
        photocomment({ variables: { photoid: photoid, userid: userid, comment: commentData.value } });
        setCommentData({ accepted: false, Msg: "", value: "" });
      }
    }
  }

  if (!data.getOnePhoto.userid || !data.getOnePhoto.userid.userName) return <p>Error</p>;

  return (
    <Card sx={cardStyle}>
      <CardHeader
        avatar={<Avatar alt={data.getOnePhoto.userid.userName} src={`${KEY.PHOTOSERVER}/images/?image=${data.getOnePhoto.userid.avatar}`} />}
        title={data.getOnePhoto.userid.userName}
        subheader={data.getOnePhoto.date}
        action={<More onDeleting={setDeleting} onEditing={setEditing} for="Photo" authorize={isAuth && userid === photouserid} sx={{}} />}
      />
      <Divider />
      <CardContent sx={{ overflowY: "scroll", "&::-webkit-scrollbar": { display: "none" }, display: { md: "block", xs: "none" } }}>
        <CardHeader
          avatar={<Avatar alt={data.getOnePhoto.userid.userName} src={`${KEY.PHOTOSERVER}/images/?image=${data.getOnePhoto.userid.avatar}`} />}
          title={data.getOnePhoto.userid.userName}
          subheader={data.getOnePhoto.date}
        />
        <Typography p={2} children={data.getOnePhoto.caption} />
        {cld ? <CircularProgress color="inherit" sx={{ margin: "auto" }} /> : cerr ? <ShowError error={cerr} /> : <Comments comments={cdt ? cdt.iphotocomment : data.getOnePhoto.comments} />}
      </CardContent>
      <Divider />
      <CardActions sx={exprsStyle}>
        {ld ? (
          <CircularProgress color="inherit" sx={{ margin: "auto" }} />
        ) : err ? (
          <ShowError error={err} />
        ) : (
          <Expression
            width="150px"
            A={dt ? dt.iphotolike.like : data.getOnePhoto.like}
            Aicon="thumbup"
            handleAClick={photoLikeHandler}
            B={data.getOnePhoto.comment}
            Bicon="comments"
            handleBClick={onFocusHandler}
            ADisable={data.getOnePhoto.disablelike}
            BDisable={data.getOnePhoto.disablecomment}
          />
        )}
      </CardActions>
      <Stack direction="row" spacing={2} sx={{ width: "90%", marginBottom: 2, marginLeft: 2 }}>
        <UserAvatar />
        <CommentInput
          setData={setCommentData}
          onPressEnter={onSubmitingCommentHandler}
          accepted={commentData.accepted}
          value={commentData.value}
          disabled={data.getOnePhoto.disablecomment}
          reff={comRef}
        />
      </Stack>
      <EditModal
        onClose={setEditing}
        open={editing}
        page="Photo"
        id={photoid}
        content={{ photoCaption: data.getOnePhoto.caption, photoDisableLike: data.getOnePhoto.disablelike, photoDisableComment: data.getOnePhoto.disablecomment }}
      />
      <DeleteModal onClose={setDeleting} open={deleting} onDelete={props.onClose} page="Photo" idToDelete={photoid} />
    </Card>
  );
};

export default ViewPhotoCaptionCard;
