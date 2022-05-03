import { Container, Grid, Box } from "@mui/material";

import { styled } from "@mui/material/styles";

import { Routes, Route } from "react-router-dom";

import VideoContents from "../Contents/VideoContents";
import PhotoContents from "../Contents/PhotoContents";
import PostContents from "../Contents/PostContents";
import AudioContents from "../Contents/AudioContents";
import ProfileContent from "../Contents/ProfileContent";
import ViewVideoContent from "../Contents/ViewVideoContent";
import FriendContent from "../Contents/FriendContent";
import MessageContent from "../Contents/MessageContent";
import { Socket } from "socket.io-client";

const StyledBox = styled(Box)(({ theme }) => ({
  marginTop: "80px",
  marginRight: 0,
  [theme.breakpoints.down("lg")]: {
    marginLeft: "70px",
  },
  [theme.breakpoints.up("lg")]: {
    marginLeft: "200px",
  },
  [theme.breakpoints.down("sm")]: {
    marginLeft: "0",
  },
}));

type ContentType = {
  socket: Socket;
};

const ConterntWraper: React.FC<ContentType> = (prop) => {
  return (
    <StyledBox>
      <Container sx={{ padding: (theme) => (theme.breakpoints.down("sm") ? 0 : 2) }}>
        <Grid container spacing={2}>
          <Routes>
            <Route path="/" element={<ProfileContent />} />
            <Route path="Post" element={<PostContents />} />
            <Route path="Photo" element={<PhotoContents />} />
            <Route path="Video" element={<VideoContents />} />
            <Route path="Audio" element={<AudioContents />} />
            <Route path="VideoOne" element={<ViewVideoContent />} />
            <Route path="Friends" element={<FriendContent />} />
            <Route path="Message" element={<MessageContent socket={prop.socket} />} />
          </Routes>
        </Grid>
      </Container>
    </StyledBox>
  );
};

export default ConterntWraper;
