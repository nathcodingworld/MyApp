import { useState } from "react";
import { AppBar, IconButton, Toolbar, Typography, Box, InputBase, Stack } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AddModal from "../Modal/AddModal";
import UserAvatar from "../UI/UserAvatar";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CreateIcon from "@mui/icons-material/Create";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PhotoAlbumIcon from "@mui/icons-material/PhotoAlbum";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import SettingsIcon from "@mui/icons-material/Settings";
import { useDispatch, useSelector } from "react-redux";
import { authAction, pageAction, queryAction } from "../../Providers/ReduxProvider";
import { useDeleteImageMutation } from "../../Providers/APIs/ImageApi";
import { useDeleteVideoMutation } from "../../Providers/APIs/VideoApi";
import { useDeleteAudioMutation } from "../../Providers/APIs/AudioApi";
import ViewModal from "../Modal/ViewModal";
import { Theme } from "@mui/system";
import SettingModal from "../Modal/SettingModal";
import { useSnackbar } from "notistack";

//=============================================================================================================STYLE

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  flexGrow: 1,
}));

const IconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 1),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    // transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));
const StyledTypography = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
  margin: "auto",
  paddingLeft: 3,
}));

const TopbarStyle = {
  bgcolor: (theme: Theme) => theme.palette.background.default,
  color: (theme: Theme) => theme.palette.text.primary,
};

//=============================================================================================================STYLE

type proptype = {
  onToggle: (state: boolean) => () => void;
};

const Topbar: React.FC<proptype> = (prop) => {
  const [open, setOpen] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<boolean>(true);
  const page = useSelector<any>((state) => state.page.page);
  const error = useSelector<any, boolean>((state) => state.query.error);
  const imgfile = useSelector<any, string>((state) => state.query.imgfile);
  const vdofile = useSelector<any, string>((state) => state.query.vdofile);
  const audfile = useSelector<any, string>((state) => state.query.audfile);
  const isAuth = useSelector<any, string>((state) => state.auth.isAuth);
  const User = useSelector<any, string>((state) => state.auth.userName);
  const [deleteImage] = useDeleteImageMutation();
  const [deleteVideo] = useDeleteVideoMutation();
  const [deleteAudio] = useDeleteAudioMutation();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  function handleonClose(): void {
    setOpen(false);
    if (error) {
      if (imgfile) deleteImage(imgfile);
      if (vdofile) deleteVideo(vdofile);
      if (audfile) deleteAudio(audfile);
      dispatch(queryAction.success());
    }
  }
  function handleonOpen(): void {
    setOpen(true);
  }
  function onLoginHandler(): void {
    setNewUser(false);
    if (error) {
      if (imgfile) deleteImage(imgfile);
      dispatch(queryAction.success());
    }
  }
  function onSignupHandler(): void {
    setNewUser(true);
  }
  function viewProfilehandler() {
    if (isAuth) dispatch(authAction.SetUser());
  }
  function SetHomeHandler(): void {
    dispatch(authAction.SetHome());
  }

  function onOpenSettingHandler() {
    dispatch(pageAction.toggleSettingModal());
  }

  function onInfoHandler() {
    enqueueSnackbar("currently search bar is on design purpose only", { variant: "info" });
  }

  //=============================================================================================================JSX
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={TopbarStyle}>
        <Toolbar>
          <Toolbar>
            <IconButton size="large" edge="start" color="inherit" aria-label="open drawer" sx={{ mr: 2 }} onClick={prop.onToggle(true)} children={<MenuIcon />} />
            <Typography variant="h6" noWrap component="div" sx={{ display: { xs: "none", sm: "block" } }}>
              My-App
            </Typography>
          </Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Search>
            <IconWrapper>
              <SearchIcon />
            </IconWrapper>
            <IconWrapper style={{ right: 0 }}>
              {page === "PROFILE" && <AccountBoxIcon />}
              {page === "POST" && <CreateIcon />}
              {page === "VIDEO" && <VideoLibraryIcon />}
              {page === "AUDIO" && <QueueMusicIcon />}
              {page === "PHOTO" && <PhotoAlbumIcon />}
            </IconWrapper>
            <StyledInputBase placeholder="Search..." inputProps={{ "aria-label": "search" }} fullWidth onFocus={onInfoHandler} />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={1}>
            <IconButton size="large" aria-label="Add" color="inherit" onClick={handleonOpen}>
              {page === "PROFILE" && !isAuth && <PersonAddIcon />}
              {page === "PROFILE" && isAuth && <PersonRemoveIcon />}
              {page === "POST" && <PostAddIcon />}
              {page === "VIDEO" && <VideoCallIcon />}
              {page === "AUDIO" && <PlaylistAddIcon />}
              {page === "PHOTO" && <AddAPhotoIcon />}
            </IconButton>
            <IconButton size="large" aria-label="Home" color="inherit" onClick={SetHomeHandler} children={<HomeIcon />} />
            <IconButton children={<SettingsIcon />} onClick={onOpenSettingHandler} />
            <IconButton onClick={viewProfilehandler}>
              <UserAvatar />
              <StyledTypography maxWidth="150px" variant="h6">
                {User}
              </StyledTypography>
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <AddModal open={open} onClose={handleonClose} onNew={newUser} onLogin={onLoginHandler} onSignup={onSignupHandler} />
      <ViewModal />
      <SettingModal />
    </Box>
  );
  //=============================================================================================================JSX
};

export default Topbar;
