import React from "react";
import "./index.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./App";
import About from "./pages/about";
import Management from "./pages/management";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <Router>
    <div>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/management" element={<Management />} />
        </Routes>
      </main>
    </div>
  </Router>
  </StrictMode>
);
