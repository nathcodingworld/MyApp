import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import KEY from "../../Key/KEY";
import image from "../../Public/unknown.png";

const UserAvatar: React.FC = () => {
  let User = image;
  const propic = useSelector<any, string>((state) => state.auth.propic);
  if (propic !== "") User = `${KEY.PHOTOSERVER}/images/?image=${propic}`;

  return <Avatar alt="user" src={User} />;
};

export default UserAvatar;
