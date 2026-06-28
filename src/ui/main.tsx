import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

function mount(): void {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    setTimeout(mount, 0);
    return;
  }
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

mount();
