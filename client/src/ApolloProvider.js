import React from "react";
import App from "./App";
import ApolloClient from "apollo-client";
import { defaultDataIdFromObject, InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
  uri:
    !process.env.NODE_ENV || process.env.NODE_ENV === "development"
      ? "http://localhost:4000/"
      : "https://api-attendlytical.herokuapp.com",
});

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    dataIdFromObject(responseObject) {
      return defaultDataIdFromObject(responseObject);
    },
  }),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
