import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { GlobalContextProvider } from "./context/global.jsx";
import GlobalStyle from "./Globalstyle.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalContextProvider>
      <GlobalStyle />
      <App />
    </GlobalContextProvider>
  </StrictMode>
);
