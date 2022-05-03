import { Avatar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import KEY from "../../Key/KEY";
import image from "../../Public/unknown.png";

const StyledTypography = styled(Typography)(({ theme }) => ({
  padding: "0 10px",
  [theme.breakpoints.down("lg")]: {
    display: "none",
  },
}));

const AuthorAvatar: React.FC = () => {
  let User = image;
  const propic = useSelector<any, string>((state) => state.auth.authorpic);
  const authorname = useSelector<any, string>((state) => state.auth.authorName);
  if (propic !== "") User = `${KEY.PHOTOSERVER}/images/?image=${propic}`;

  return (
    <>
      <Avatar alt="user" src={User} />
      <StyledTypography variant="h6">{authorname}</StyledTypography>
    </>
  );
};

export default AuthorAvatar;
