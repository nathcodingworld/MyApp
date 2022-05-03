import { useSelector } from "react-redux";
import Bottombar from "../Components/Layout/Bottombar";

const Footer: React.FC = (prop) => {
  const open = useSelector<any, string>((state) => state.modal.open);

  return <>{open && <Bottombar></Bottombar>}</>;
};

export default Footer;
