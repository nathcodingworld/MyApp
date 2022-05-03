import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { useSelector } from "react-redux";

const ApolloReactProvider: React.FC = (props) => {
  const token = useSelector<any, string>((state) => state.auth.token);

  const client = new ApolloClient({
    uri: "http://localhost:5000/graphql",
    cache: new InMemoryCache(),
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};

export default ApolloReactProvider;
