import React from 'react';
import ReactDOM from 'react-dom/client';

import { ErrorBoundary } from 'react-error-boundary';

import './index.css';

import App from './App';
import ErrorFallBack from './components/ErrorFallBack';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallBack} onReset={()=>window.location.replace("/")}>
    <App />
    </ErrorBoundary>
  </React.StrictMode>
);
