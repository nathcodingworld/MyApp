import { CircularProgress, SpeedDial, SpeedDialAction } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { queryAction } from "../../Providers/ReduxProvider";

type MoreButtonType = {
  userid: string;
  reqrecieve: boolean;
  reqsent: boolean;
  friend: boolean;
  roomid: string;
  onComfirm: (args: { request: string; open: boolean }) => void;
};

const MoreButtonStyle = {
  position: "absolute",
  right: "50px",
  top: "0",
  "&:hover": {
    backgroundColor: "none",
  },
  "& .MuiSpeedDial-fab": {
    backgroundColor: "transparent",
    color: "black",
    boxShadow: "none",
  },
};

const CreateMessageID = gql`
  mutation CreateMessageID($authorid: String!, $userid: String!) {
    createroomid(authorid: $authorid, userid: $userid) {
      message
    }
  }
`;

const MoreButton: React.FC<MoreButtonType> = (props) => {
  const isAuth = useSelector<any, boolean>((state) => state.auth.isAuth);
  const userid = useSelector<any, string>((State) => State.auth.ID);
  const [createRoomID, { loading, error }] = useMutation(CreateMessageID);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function onConfirmFriendHandler(e: any) {
    e.stopPropagation();
    if (userid === props.userid) {
      enqueueSnackbar("not Valid", { variant: "error" });
      return;
    }
    if (props.friend) props.onComfirm({ request: "Remove friend", open: true });
    else if (props.reqrecieve) props.onComfirm({ request: "Accept friend request", open: true });
    else if (props.reqsent) props.onComfirm({ request: "Cancel friend request", open: true });
    else props.onComfirm({ request: "Add friend", open: true });
  }

  function onDelFriendHandler(e: any) {
    e.stopPropagation();
    if (userid === props.userid) {
      enqueueSnackbar("not Valid", { variant: "error" });
      return;
    }
    if (props.friend) return;
    else if (props.reqrecieve) props.onComfirm({ request: "Refuse friend request", open: true });
  }

  async function onMessageHandler(e: any) {
    e.stopPropagation();
    if (userid === props.userid) {
      enqueueSnackbar("not Valid", { variant: "error" });
      return;
    }
    if (props.roomid === "none") {
      try {
        const success = await createRoomID({ variables: { authorid: props.userid, userid } });
        if (success) {
          dispatch(queryAction.connect(success.data.createroomid.message));
          navigate("/Message");
        }
      } catch (error: any) {
        enqueueSnackbar(error?.message, { variant: "error" });
      }
    } else {
      dispatch(queryAction.connect(props.roomid));
      navigate("/Message");
    }
  }

  function notAuthorize(e: any) {
    e.stopPropagation();
    enqueueSnackbar("not Authorize", { variant: "error" });
  }

  return (
    <SpeedDial ariaLabel="More" icon={<MoreVertIcon />} direction="left" sx={MoreButtonStyle}>
      {!props.friend && props.reqrecieve && (
        <SpeedDialAction key="DelFriend" icon={<CancelOutlinedIcon />} sx={{ color: "red" }} tooltipTitle="Delete friend request" onClick={isAuth ? onDelFriendHandler : notAuthorize} />
      )}
      <SpeedDialAction
        key="AddFriend"
        sx={{ color: props.friend ? "rgb(0, 127, 255)" : props.reqrecieve ? "green" : props.reqsent ? "orange" : "" }}
        icon={props.friend ? <PeopleIcon /> : props.reqrecieve ? <CheckCircleOutlineIcon /> : props.reqsent ? <VerticalAlignBottomIcon /> : <PersonAddIcon />}
        tooltipTitle={props.friend ? "Friend" : props.reqrecieve ? "Accept Friend request" : props.reqsent ? "Request send" : "Add Friend"}
        onClick={isAuth ? onConfirmFriendHandler : notAuthorize}
      />
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <p>Error</p>
      ) : (
        <SpeedDialAction key="Message" icon={<ForwardToInboxIcon />} tooltipTitle="Message" onClick={isAuth ? onMessageHandler : notAuthorize} />
      )}
    </SpeedDial>
  );
};
export default MoreButton;
