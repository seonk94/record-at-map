import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Root from './router';
import { BrowserRouter } from 'react-router-dom';
import { GlobalStyle } from './assets/styles/GlobalStyles';
import { ApolloProvider } from '@apollo/client';
import { client } from './client';
import AuthProvider from './lib/provider/AuthProvider';




ReactDOM.render(
  <React.StrictMode>
    {/* <MuiThemeProvider theme={customTheme}> */}
    <BrowserRouter>
      <AuthProvider>
        <ApolloProvider client={client}>
          <Root />
          <GlobalStyle/>
        </ApolloProvider>
      </AuthProvider>
    </BrowserRouter>
    {/* </MuiThemeProvider> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
