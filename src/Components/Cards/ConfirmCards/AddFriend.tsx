import { gql, useMutation } from "@apollo/client";
import { Button, Card, CardActions, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import ShowError from "../../Component/ShowError";

type AddFriendType = {
  userid: string;
  onDone: () => void;
};

const AddFriendGQL = gql`
  mutation SendRequest($authorid: String!, $userid: String!) {
    friendrequest(authorid: $authorid, userid: $userid) {
      message
    }
  }
`;

const AddFriend: React.FC<AddFriendType> = (props) => {
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const [sendFriendRequest, { loading, error }] = useMutation(AddFriendGQL, { refetchQueries: ["GETPROFILE", "GETFRIEND"] });
  const { enqueueSnackbar } = useSnackbar();

  async function onConfirmHandler() {
    try {
      const success = await sendFriendRequest({ variables: { authorid: props.userid, userid } });
      if (success) enqueueSnackbar(success.data.friendrequest.message, { variant: "success" });
      props.onDone();
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    }
  }

  return (
    <Card>
      {loading ? (
        <CircularProgress color="inherit" sx={{ margin: "auto" }} />
      ) : error ? (
        <ShowError error={error} />
      ) : (
        <CardActions children={<Button children="Add friend" onClick={onConfirmHandler} sx={{ margin: "auto" }} variant="outlined" />} />
      )}
    </Card>
  );
};

export default AddFriend;
