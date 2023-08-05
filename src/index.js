import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/style.css';
import { store } from './redux';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools} from 'react-query/devtools';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        cacheTime: 3600000
      }
    }
  })}>
  <Provider store = {store}>
    <HashRouter>
      <App />
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
    </HashRouter>
  </Provider>
  </QueryClientProvider>
);
