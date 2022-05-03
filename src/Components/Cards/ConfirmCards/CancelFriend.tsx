import { gql, useMutation } from "@apollo/client";
import { Button, Card, CardActions, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import ShowError from "../../Component/ShowError";

type CancelFriendType = {
  userid: string;
  onDone: () => void;
};

const CancelFriendGQL = gql`
  mutation CancelRequest($authorid: String!, $userid: String!) {
    cancelrequest(authorid: $authorid, userid: $userid) {
      message
    }
  }
`;

const CancelFriend: React.FC<CancelFriendType> = (props) => {
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const [cancelFriendRequest, { loading, error }] = useMutation(CancelFriendGQL, { refetchQueries: ["GETPROFILE", "GETFRIEND"] });
  const { enqueueSnackbar } = useSnackbar();

  async function onConfirmHandler() {
    try {
      const success = await cancelFriendRequest({ variables: { authorid: props.userid, userid } });
      if (success) enqueueSnackbar(success.data.cancelrequest.message, { variant: "success" });
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
        <CardActions children={<Button children="Cancel friend request" onClick={onConfirmHandler} sx={{ margin: "auto" }} variant="outlined" />} />
      )}
    </Card>
  );
};

export default CancelFriend;
