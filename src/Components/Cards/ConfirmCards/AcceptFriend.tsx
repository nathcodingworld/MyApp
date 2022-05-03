import { gql, useMutation } from "@apollo/client";
import { Button, Card, CardActions, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import ShowError from "../../Component/ShowError";

type AcceptFriendType = {
  userid: string;
  onDone: () => void;
};

const AcceptFriendGQL = gql`
  mutation AcceptRequest($authorid: String!, $userid: String!) {
    acceptrequest(authorid: $authorid, userid: $userid) {
      message
    }
  }
`;

const AcceptFriend: React.FC<AcceptFriendType> = (props) => {
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const [acceptFriendRequest, { loading, error }] = useMutation(AcceptFriendGQL, { refetchQueries: ["GETPROFILE", "GETFRIEND"] });
  const { enqueueSnackbar } = useSnackbar();

  async function onConfirmHandler() {
    try {
      const success = await acceptFriendRequest({ variables: { authorid: props.userid, userid } });
      if (success) enqueueSnackbar(success.data.acceptrequest.message, { variant: "success" });
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
        <CardActions children={<Button children="Accept friend request" onClick={onConfirmHandler} sx={{ margin: "auto" }} variant="outlined" />} />
      )}
    </Card>
  );
};

export default AcceptFriend;
