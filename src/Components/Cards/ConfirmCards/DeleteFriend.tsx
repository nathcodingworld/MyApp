import { gql, useMutation } from "@apollo/client";
import { Button, Card, CardActions, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import ShowError from "../../Component/ShowError";

type DeleteFriendType = {
  userid: string;
  onDone: () => void;
};

const DelFriendGQL = gql`
  mutation DeleteFriend($authorid: String!, $userid: String!) {
    deletefriend(authorid: $authorid, userid: $userid) {
      message
    }
  }
`;

const DeleteFriend: React.FC<DeleteFriendType> = (props) => {
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const [deleteFriend, { loading, error }] = useMutation(DelFriendGQL, { refetchQueries: ["GETPROFILE", "GETFRIEND"] });
  const { enqueueSnackbar } = useSnackbar();

  async function onConfirmHandler() {
    try {
      const success = await deleteFriend({ variables: { authorid: props.userid, userid } });
      if (success) enqueueSnackbar(success.data.deletefriend.message, { variant: "success" });
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
        <CardActions children={<Button children="Remove friend" onClick={onConfirmHandler} sx={{ margin: "auto" }} variant="outlined" />} />
      )}
    </Card>
  );
};

export default DeleteFriend;
