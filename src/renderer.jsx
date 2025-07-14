import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import Home from "./Home";
import { HashRouter } from "react-router-dom";

const App = () => {
  return (
    <StrictMode>
      <HashRouter>
        <Home />
      </HashRouter>
    </StrictMode>
  );
};

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
