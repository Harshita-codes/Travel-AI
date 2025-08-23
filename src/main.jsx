import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Router } from 'lucide-react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CreateTrip from './create-trip/index.jsx';
import Header from './components/ui/custom/Header.jsx';
import React from 'react';
import { toast } from "sonner"
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from '@react-oauth/google';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/create-trip',
    element: <CreateTrip />
  }
]);
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
    <Header />
    <Toaster />
    <RouterProvider router={router} />
  </GoogleOAuthProvider>
  </React.StrictMode>,
)
const orig = Element.prototype.attachShadow;
Element.prototype.attachShadow = function (init) {
  if (this.localName === "gmp-place-autocomplete") {
    const shadow = orig.call(this, { ...init, mode: "open" });
    const style = document.createElement("style");
    style.textContent = `:host {
    background: white !important;
    border: 0.25px solid #ccc !important;      /* reduced to half */
    border-radius: 0.5rem !important;
    box-sizing: border-box !important;
    display: block !important;
}
.widget-container {
    background: white !important;
    
    border-radius: 0.5rem !important;
    box-sizing: border-box !important;
}
.input-container {
    
    
    
    cursor: pointer !important;
    transition: box-shadow 0.2s;
}
.input-container:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.12), 0 0 0 2px black !important;
}
input {
    background: white !important;
    color: black !important;
    border: none !important;
    outline: none !important;
    font-size: 1rem !important;
    width: 100% !important;
}
    `;
    shadow.appendChild(style);
    return shadow;
  }
  return orig.call(this, init);
};