import { Avatar, Paper, Stack, Typography } from "@mui/material";
import KEY from "../../../Key/KEY";

const style = { borderRadius: "10px", maxWidth: "70%" };

type AuthorMessageType = {
  message: string;
  avatar: string;
};

const AuthorMessage: React.FC<AuthorMessageType> = (props) => {
  return (
    <Stack direction="row" spacing={1} justifyContent="flex-end" paddingRight={2}>
      <Paper sx={style} elevation={8}>
        <Typography p={1} variant="h6" children={props.message} />
      </Paper>
      <Avatar alt="author" src={`${KEY.PHOTOSERVER}/images/?image=${props.avatar}`} />
    </Stack>
  );
};

export default AuthorMessage;
