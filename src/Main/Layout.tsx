import Body from "./Body";
import Footer from "./Footer";
import Header from "./Header";
import cookie from "react-cookies";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authAction } from "../Providers/ReduxProvider";

const userdata = cookie.load("userdata");

const Layout: React.FC = (prop) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const toogleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  useEffect(() => {
    if (userdata) {
      dispatch(authAction.Login(userdata));
    }
  }, []);

  return (
    <>
      <Header onToggle={toogleDrawer}></Header>
      <Body open={open} onToggle={toogleDrawer}></Body>
      <Footer></Footer>
    </>
  );
};

export default Layout;
