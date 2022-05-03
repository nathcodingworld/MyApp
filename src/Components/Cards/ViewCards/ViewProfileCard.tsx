import { Button, Card, CardActions, CardContent, CardHeader, CardMedia } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import More from "../../Component/More";
import UserAvatar from "../../UI/UserAvatar";
import cookie from "react-cookies";
import { authAction } from "../../../Providers/ReduxProvider";
import { useSnackbar } from "notistack";
import DeleteModal from "../../Modal/DeleteModal";
import { useState } from "react";
import EditModal from "../../Modal/EditModal";

type ViewProfileCardType = {
  onClose: () => void;
};

const ViewProfileCard: React.FC<ViewProfileCardType> = (props) => {
  const [onDelete, setDelete] = useState(false);
  const [onUpdate, setUpdate] = useState(false);
  const dispatch = useDispatch();
  const username = useSelector<any, string>((state) => state.auth.userName);
  const bio = useSelector<any, string>((state) => state.auth.bio);
  const { enqueueSnackbar } = useSnackbar();

  function LogoutHandler() {
    const userdata = { token: "", ID: "", propic: "", userName: "VISITOR", bio: "" };
    dispatch(authAction.Logout());
    cookie.save("userdata", JSON.stringify(userdata), { maxAge: 1 });
    enqueueSnackbar("you are succesfuly log out", { variant: "success" });
    props.onClose();
  }

  return (
    <Card>
      <CardHeader title={username} subheader={bio} action={<More for="Account" onDeleting={setDelete} onEditing={setUpdate} authorize={true} sx={{}} />} avatar={<UserAvatar />} />
      <CardActions children={<Button sx={{ margin: "auto" }} onClick={LogoutHandler} children="LOG OUT" />} />
      <DeleteModal open={onDelete} onClose={setDelete} onDelete={props.onClose} page="Account" idToDelete="" />
      <EditModal open={onUpdate} onClose={setUpdate} page="Account" content={null} id="" />
    </Card>
  );
};

export default ViewProfileCard;
