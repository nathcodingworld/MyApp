import Layout from "./Main/Layout";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import ApolloReactProvider from "./Providers/ApolloReactProvider";
import { SnackbarProvider } from "notistack";
import ReduxProvider from "./Providers/ReduxProvider";
import StyleProvider from "./Providers/StyleProvider";

function App() {
  return (
    <BrowserRouter>
      <ReduxProvider>
        <ApolloReactProvider>
          <SnackbarProvider maxSnack={5}>
            <StyleProvider>
              <Layout></Layout>
            </StyleProvider>
          </SnackbarProvider>
        </ApolloReactProvider>
      </ReduxProvider>
    </BrowserRouter>
  );
}

export default App;
