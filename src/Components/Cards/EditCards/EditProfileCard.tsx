import { gql, useMutation } from "@apollo/client";
import { Button, Card, CardContent, CircularProgress, Divider, Stack } from "@mui/material";

import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authAction, queryAction } from "../../../Providers/ReduxProvider";
import ConfirmInput from "../_Inputs/ConfirmInput";
import PhotoFileInput from "../_Inputs/PhotoFileInput";
import TextInput from "../_Inputs/TextInput";
import ShowError from "../../Component/ShowError";

type EditProfileCardType = {
  onClose: () => void;
};

const reSignUp = gql`
  mutation reSignUp($userid: String!, $userName: String!, $bio: String, $password: String!, $avatar: String) {
    resignup(userid: $userid, userName: $userName, bio: $bio, password: $password, avatar: $avatar) {
      id
      token
      userName
      avatar
      bio
    }
  }
`;

const EditProfileCard: React.FC<EditProfileCardType> = (props) => {
  const [isloading, setIsLoading] = useState(false);
  const username = useSelector<any, string>((state) => state.auth.userName);
  const avatar = useSelector<any, string>((state) => state.auth.propic);
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const description = useSelector<any, string>((state) => state.auth.bio);
  const [imgData, setImgData] = useState({ accepted: false, Msg: "Add File", file: "" });
  const [userData, setUserData] = useState({ accepted: false, Msg: "", value: "" });
  const [descriptionData, setDescriptionData] = useState({ accepted: false, Msg: "", value: "" });
  const [userPassword, setPasswordData] = useState({ accepted: false, Msg: "Must not empty", value: "" });
  const [userConfirm, setConfirmData] = useState({ accepted: false, Msg: "Must not empty", value: "" });
  const [resignUp, { loading, error }] = useMutation(reSignUp);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  useEffect(() => {
    setUserData({
      accepted: true,
      Msg: "",
      value: username,
    });
    setDescriptionData({
      accepted: true,
      Msg: "",
      value: description,
    });
    setImgData({
      accepted: true,
      Msg: "",
      file: avatar,
    });
  }, []);

  async function onSubmitHandler() {
    if (!imgData.accepted) enqueueSnackbar("Image: " + imgData.Msg, { variant: "error" });
    if (!userData.accepted) enqueueSnackbar("username: " + userData.Msg, { variant: "error" });
    if (!descriptionData.accepted) enqueueSnackbar("description: " + descriptionData.Msg, { variant: "error" });
    if (!userPassword.accepted) enqueueSnackbar("Password: " + userPassword.Msg, { variant: "error" });
    if (!userConfirm.accepted) enqueueSnackbar("confirmPassword: " + userConfirm.Msg, { variant: "error" });
    if (imgData.accepted && userData.accepted && userPassword.accepted && userConfirm.accepted && descriptionData.accepted) {
      try {
        const success = await resignUp({ variables: { userid: userid, userName: userData.value, password: userPassword.value, avatar: imgData.file, bio: descriptionData.value } });
        if (success.data) {
          dispatch(queryAction.success());
          dispatch(
            authAction.Login({
              token: success.data.resignup.token,
              ID: success.data.resignup.id,
              propic: success.data.resignup.avatar,
              userName: success.data.resignup.userName,
              bio: success.data.resignup.bio,
            })
          );
          enqueueSnackbar("successful you are log in", { variant: "success" });
          props.onClose();
        }
      } catch (error: any) {
        dispatch(queryAction.failed({ img: imgData.file, vdo: "", aud: "" }));
        enqueueSnackbar(error?.message, { variant: "error" });
      }
    }
  }

  return (
    <Card>
      <CardContent>
        <TextInput label="userName" type="text" variant="standard" setData={setUserData} value={userData.value} accepted={userData.accepted} multiline={false} />
        <TextInput label="Description" type="text" variant="standard" setData={setDescriptionData} value={descriptionData.value} accepted={descriptionData.accepted} multiline={false} />
        <TextInput setData={setPasswordData} variant="standard" type="password" label="password" accepted={userPassword.accepted} multiline={false} value={userPassword.value} />
        <ConfirmInput setData={setConfirmData} toConfirm={userPassword.value} accepted={userConfirm.accepted} />
        <PhotoFileInput setData={setImgData} name="Profile pic" imgName={imgData.Msg} accepted={imgData.accepted} imgFile={imgData.file} fullWidth={true} isLoading={setIsLoading} />
        <Divider />
        <Stack direction={"column"} sx={{ margin: "auto" }}>
          {!isloading && <Button onClick={onSubmitHandler}>Update</Button>}
          {loading && <CircularProgress color="inherit" sx={{ margin: "auto" }} />}
          {error && <ShowError error={error} />}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default EditProfileCard;
