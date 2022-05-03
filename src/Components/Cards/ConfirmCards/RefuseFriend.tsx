import { gql, useMutation } from "@apollo/client";
import { Button, Card, CardActions, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import ShowError from "../../Component/ShowError";

type RefuseFriendType = {
  userid: string;
  onDone: () => void;
};

const RefuseFriendGQL = gql`
  mutation RefuseRequest($authorid: String!, $userid: String!) {
    refuserequest(authorid: $authorid, userid: $userid) {
      message
    }
  }
`;

const RefuseFriend: React.FC<RefuseFriendType> = (props) => {
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const [refuseFriendRequest, { loading, error }] = useMutation(RefuseFriendGQL, { refetchQueries: ["GETPROFILE", "GETFRIEND"] });
  const { enqueueSnackbar } = useSnackbar();

  async function onConfirmHandler() {
    try {
      const success = await refuseFriendRequest({ variables: { authorid: props.userid, userid } });
      if (success) enqueueSnackbar(success.data.refuserequest.message, { variant: "success" });
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
        <CardActions children={<Button children="Remove friend request" onClick={onConfirmHandler} sx={{ margin: "auto" }} variant="outlined" />} />
      )}
    </Card>
  );
};

export default RefuseFriend;
