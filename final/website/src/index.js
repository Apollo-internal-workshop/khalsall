import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
// ----- Import Apollo Client Here ----
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
// ------------------------------------

import theme from './theme.js';
import { ChakraProvider } from '@chakra-ui/react';
import { DEFAULT_ROUTER_URL } from './config';

// Get router URL from runtime config, environment variable, or default
const routerUrl = window.APP_CONFIG?.routerUrl || process.env.REACT_APP_ROUTER_URL || DEFAULT_ROUTER_URL;
console.log('Using routerUrl', routerUrl);

// ----- Configure the apollo client here ------
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: routerUrl,
  name: 'web-workshop-client',
  version: '0.1',
});
// ---------------------------------------------

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </ChakraProvider>,
  document.getElementById('root')
);
