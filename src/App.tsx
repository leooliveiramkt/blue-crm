
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Routes } from "./Routes";
import "./App.css";

function App() {
  // Verificar se o cliente está conectando com a API
  console.log("App iniciado - Verificando ambiente");

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
