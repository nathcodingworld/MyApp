import Topbar from "../Components/Layout/Topbar";

type propstype = {
  onToggle: (state: boolean) => () => void;
};

const Header: React.FC<propstype> = (prop) => {
  return <Topbar onToggle={prop.onToggle}></Topbar>;
};

export default Header;
