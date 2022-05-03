import { Box, Paper, Typography } from "@mui/material";

const style = { borderRadius: "10px", maxWidth: "70%", width: "max-content", backgroundColor: "#0084ff" };

type UserMessageType = {
  message: string;
};

const UserMessage: React.FC<UserMessageType> = (props) => {
  return (
    <Box width="100%">
      <Paper sx={style} elevation={8}>
        <Typography p={1} variant="h6" children={props.message} />
      </Paper>
    </Box>
  );
};

export default UserMessage;
