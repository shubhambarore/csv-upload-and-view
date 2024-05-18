import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Override default capitalization
        },
      },
    },
  },
  palette: {
    primary: {
      light: "#63b8ff",
      main: "#3366FF",
      dark: "#005db0",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#A6C4DC",
      light: "#EFF6FF",
      dark: "#00867d",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#000",
      secondary: "#426078",
    },
  },
  typography: {
    fontSize: 12,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
