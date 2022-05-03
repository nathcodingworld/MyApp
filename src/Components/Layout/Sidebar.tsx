import { Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography, useMediaQuery } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PhotoAlbumIcon from "@mui/icons-material/PhotoAlbum";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import { Box, Theme } from "@mui/system";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { modalAction, pageAction, queryAction } from "../../Providers/ReduxProvider";
import AuthorAvatar from "../UI/AuthorAvatar";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

const drawerwidth = 200;

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    display: "none",
  },
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
}));
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  flexShrink: 0,
  [theme.breakpoints.up("lg")]: {
    width: drawerwidth,
  },
  [theme.breakpoints.down("lg")]: {
    width: "70px",
  },
  [theme.breakpoints.down("sm")]: {
    width: drawerwidth,
  },
  [`& .MuiDrawer-paper`]: {
    backgroundColor: theme.palette.background.default,
    boxSizing: "border-box",
    marginTop: "64px",
    paddingBottom: "64px",
    [theme.breakpoints.up("lg")]: {
      width: drawerwidth,
    },
    [theme.breakpoints.down("lg")]: {
      width: "70px",
    },
    [theme.breakpoints.down("sm")]: {
      width: drawerwidth,
      marginTop: "56px",
    },
  },
}));

type SidebarType = {
  socket: Socket;
  open: boolean;
  onToggle: (state: boolean) => () => void;
};

const Sidebar: React.FC<SidebarType> = (prop) => {
  const [fixed, setFixed] = useState(false);
  const roomid = useSelector<any, string>((state) => state.query.roomid);
  const isopen = useSelector<any>((state) => state.modal.open);
  const float = useSelector<any>((state) => state.modal.content);
  const opened = useSelector<any, boolean>((state) => state.mediaData.opened);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const downsm = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const upsm = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));

  useEffect(() => {
    if (downsm) {
      setFixed(false);
      enqueueSnackbar("Click menu bar to open Drawer", { variant: "info" });
    }
  }, [downsm]);

  useEffect(() => {
    if (upsm) setFixed(true);
  }, [upsm]);

  const NavigateHandler = (page: string, state: string) => () => {
    navigate(page);
    dispatch(pageAction.setPageState(state));
    prop.onToggle(false)();
    if (opened) dispatch(modalAction.openVideoPlayer());
    if (roomid !== "none") {
      prop.socket.emit("leaveRoom", roomid);
      dispatch(queryAction.refresh());
    }
  };

  function onOpenSettingHandler() {
    dispatch(pageAction.toggleSettingModal());
  }

  const Main = [
    { key: "Post", handler: NavigateHandler("/Post", "POST"), icon: <CreateIcon />, text: "Post" },
    { key: "Video", handler: NavigateHandler("/Video", "VIDEO"), icon: <VideoLibraryIcon />, text: "Video Library" },
    { key: "photo", handler: NavigateHandler("/Photo", "PHOTO"), icon: <PhotoAlbumIcon />, text: "Photo Album" },
    { key: "Music", handler: NavigateHandler("/Audio", "AUDIO"), icon: <QueueMusicIcon />, text: "Music Playlist" },
  ];
  const Sub = [
    { key: "Friend", handler: NavigateHandler("/Friends", "PROFILE"), icon: <PeopleIcon /> },
    { key: "Chat", handler: NavigateHandler("/Message", "MESSAGE"), icon: <ChatIcon /> },
  ];
  return (
    <StyledDrawer
      variant={fixed ? "permanent" : "temporary"}
      sx={{ [`& .MuiDrawer-paper`]: { paddingBottom: float === "audio" && isopen ? "164px" : "64px" } }}
      open={prop.open}
      onClose={prop.onToggle(false)}
    >
      <Divider />
      <IconButton onClick={NavigateHandler("/", "PROFILE")}>
        <AuthorAvatar />
      </IconButton>
      <Divider />
      <List>
        {Main.map((list) => {
          return (
            <ListItem button key={list.key} onClick={list.handler}>
              <ListItemIcon children={list.icon} />
              <StyledListItemText primary={list.text} />
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List>
        {Sub.map((list) => {
          return (
            <ListItem button key={list.key} onClick={list.handler}>
              <ListItemIcon children={list.icon} />
              <StyledListItemText primary={list.key} />
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List>
        <ListItem button key="Setting" onClick={onOpenSettingHandler}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <StyledListItemText primary="Setting" />
        </ListItem>
        <ListItem button key="Help">
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <StyledListItemText primary="Help" />
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ flexGrow: 1 }}></Box>
      <Typography sx={{ color: "gray", textAlign: " center" }}>© nathaniel 2022</Typography>
    </StyledDrawer>
  );
};

export default Sidebar;
