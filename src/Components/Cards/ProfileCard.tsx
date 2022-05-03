import { Avatar, Card, CardHeader, Chip, CircularProgress, Grid } from "@mui/material";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import KEY from "../../Key/KEY";
import { useDispatch, useSelector } from "react-redux";
import { gql, useMutation } from "@apollo/client";
import { authAction } from "../../Providers/ReduxProvider";
import MoreButton from "../UI/MoreButton";
import { useState } from "react";
import ConfirmModal from "../Modal/ConfirmModal";
import ShowError from "../Component/ShowError";
import { useSnackbar } from "notistack";

export type ProfileCardType = {
  id: string;
  avatar: string;
  userName: string;
  description: string;
  heart: number;
  friend: boolean;
  request: boolean;
  response: boolean;
  roomid: string;
};

const PStyle = {
  "& .MuiCardHeader-subheader": {
    maxWidth: "150px",
  },
};
const Style = {
  position: "relative",
  cursor: "pointer",
  "&:active": {
    backgroundColor: "transparent",
    transform: "scale(1.1)",
  },
};

const iheart = gql`
  mutation iHeart($id: String!, $userid: String!) {
    iheart(id: $id, userid: $userid) {
      heart
    }
  }
`;

const ProfileCard: React.FC<ProfileCardType> = (props) => {
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const isAuth = useSelector<any, string>((state) => state.auth.isAuth);
  const [Confirm, setConfirm] = useState({ request: "", open: false });
  const [heart, { loading, error, data }] = useMutation(iheart);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  function handleClick(e: any) {
    e.stopPropagation();
    if (isAuth) {
      if (props.id === userid) return;
      heart({ variables: { id: props.id, userid: userid } });
    }
  }
  function SetAuthorHandler() {
    dispatch(authAction.SetAuthor({ authorid: props.id, pic: props.avatar, name: props.userName }));
    enqueueSnackbar(`you will only see ${props.userName} all Post`, { variant: "info" });
    enqueueSnackbar(`all Post have been filtered`, { variant: "info" });
  }
  return (
    <Grid item lg={3} md={4} sm={6} xs={12}>
      <Card sx={Style} id={props.id} onClick={SetAuthorHandler}>
        <CardHeader
          sx={PStyle}
          avatar={<Avatar alt="user" src={`${KEY.PHOTOSERVER}/images/?image=${props.avatar}`} />}
          title={props.userName}
          subheader={props.description}
          action={
            loading ? (
              <CircularProgress color="inherit" sx={{ margin: "auto" }} />
            ) : error ? (
              <ShowError error={error} />
            ) : (
              <Chip sx={{ width: "max-content" }} color="secondary" label={data ? data.iheart.heart : props.heart} icon={<FavoriteTwoToneIcon />} variant="outlined" onClick={handleClick} />
            )
          }
        />
        <MoreButton friend={props.friend} reqsent={props.request} userid={props.id} reqrecieve={props.response} onComfirm={setConfirm} roomid={props.roomid} />
      </Card>
      <ConfirmModal open={Confirm.open} onClose={setConfirm} to={Confirm.request} userid={props.id} />
    </Grid>
  );
};

export default ProfileCard;
