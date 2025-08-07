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

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/create-trip',
    element: <CreateTrip/>
  }
]);
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header/>
    <Toaster/>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
const orig = Element.prototype.attachShadow;
Element.prototype.attachShadow = function (init) {
  if (this.localName === "gmp-place-autocomplete") {
    const shadow = orig.call(this, { ...init, mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
      :host {
        background: white !important;
        color: black !important;
        border: 1px solid gray !important;
        border-radius: 8px !important;
        box-sizing: border-box !important;
      }
      .input-container { background: white !important; padding:2px; color:black !important;margin:1px;
      border-color: black 1px solid !important;
      border-radius: 8px !important; } 
      input { background: white !important; color:black !important;
      border-color: black !important; 
      border-radius: 8px !important; }
      .widget-container { background: white !important; color:black !important;
      border-color: black !important;
      border-radius: 8px !important; }
      .dropdown, .pac-container { background: white !important; color:black !important;  border-color: black !important; }
      .pac-item { background: white !important; color: black !important;
      border: 1px solid #ccc !important; }
      .pac-item:hover { background: #black !important; }
    `;
    shadow.appendChild(style);
    return shadow;
  }
  return orig.call(this, init);
};