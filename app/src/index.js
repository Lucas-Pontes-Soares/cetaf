import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import Routing from './routes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Routing />
    <Toaster richColors />
  </React.StrictMode>
);

