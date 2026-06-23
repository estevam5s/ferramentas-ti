import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ToolPage from "./pages/ToolPage";
import Billing from "./pages/Billing";
import Account from "./pages/Account";
import Admin from "./pages/Admin";

function Loader() {
  return <div className="grid min-h-screen place-items-center bg-gray-50"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
}

// Exige login. Se o trial expirou e não há plano, restringe ferramentas (manda p/ billing).
function Protected({ children, allowExpired = false }) {
  const { user, loading, hasAccess } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!hasAccess && !allowExpired) return <Navigate to="/app/billing?expired=1" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      {/* Billing e Conta sempre acessíveis logado (mesmo com trial expirado) */}
      <Route path="/app/billing" element={<Protected allowExpired><Billing /></Protected>} />
      <Route path="/app/conta" element={<Protected allowExpired><Account /></Protected>} />
      {/* Ferramentas exigem acesso (trial válido ou plano pago) */}
      <Route path="/app" element={<Protected><Dashboard /></Protected>} />
      <Route path="/app/t/:slug" element={<Protected><ToolPage /></Protected>} />
      <Route path="/admin" element={<Protected allowExpired><Admin /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
