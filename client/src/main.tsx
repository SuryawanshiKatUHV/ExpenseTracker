import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// Render the root component of the application that serves as the entry point for rendering the entire React application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastContainer
    position='top-right'
     />
    <App />
  </React.StrictMode>,
)