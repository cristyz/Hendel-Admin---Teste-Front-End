import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './vendor/sb-admin.css';
import { withStore } from 'vuex-but-for-react'
import store from './store';

const AppWithStore = withStore(App, store);

ReactDOM.render(
  <React.StrictMode>
    <AppWithStore />
  </React.StrictMode>,
  document.getElementById('root')
);
