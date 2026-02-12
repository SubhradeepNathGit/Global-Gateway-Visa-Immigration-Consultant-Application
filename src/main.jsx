import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './Redux/Store/Store';
import { BrowserRouter as Router } from 'react-router-dom';
import TanstackProvider from './tanstack/store/TanstackProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <TanstackProvider>
        <Router>
          <App />
        </Router>
      </TanstackProvider>
    </Provider>
  </React.StrictMode>
);
