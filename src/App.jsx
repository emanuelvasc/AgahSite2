import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";
import ClientLayout from "./components/layout/ClientLayout";

import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminClients from "./pages/admin/AdminClients";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminStock from "./pages/admin/AdminStock";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomOrders from "./pages/admin/AdminCustomOrders";
import AdminProduction from "./pages/admin/AdminProduction";
import AdminSuppliers from "./pages/admin/AdminSuppliers";
import AdminReports from "./pages/admin/AdminReports";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminRegistrations from "./pages/admin/AdminRegistrations";

// Client pages
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientProducts from "./pages/client/ClientProducts";
import ClientCart from "./pages/client/ClientCart";
import ClientOrders from "./pages/client/ClientOrders";
import ClientCustomOrders from "./pages/client/ClientCustomOrders";
import ClientEvents from "./pages/client/ClientEvents";
import ClientRegistrations from "./pages/client/ClientRegistrations";
import ClientAttendance from "./pages/client/ClientAttendance";
import {
  ClientProfile,
  ClientSettings,
  ClientAbout,
  ClientContact,
} from "./pages/client/ClientMiscPages";

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Admin area */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clientes"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout>
                    <AdminClients />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/produtos"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout>
                    <AdminProducts />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/estoque"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout>
                    <AdminStock />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pedidos"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout>
                    <AdminOrders />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/encomendas"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout>
                    <AdminCustomOrders />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/eventos"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout>
                    <AdminEvents />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/inscricoes"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout>
                    <AdminRegistrations />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/producao"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout>
                    <AdminProduction />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/fornecedores"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout>
                    <AdminSuppliers />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/relatorios"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout>
                    <AdminReports />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/atendimento"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout>
                    <AdminAttendance />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/configuracoes"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout>
                    <AdminSettings />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Client area */}
            <Route
              path="/cliente"
              element={
                <ProtectedRoute role="client">
                  <ClientLayout>
                    <ClientDashboard />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cliente/produtos"
              element={
                <ProtectedRoute role="client">
                  <ClientLayout>
                    <ClientProducts />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cliente/carrinho"
              element={
                <ProtectedRoute role="client">
                  <ClientLayout>
                    <ClientCart />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cliente/pedidos"
              element={
                <ProtectedRoute role="client">
                  <ClientLayout>
                    <ClientOrders />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cliente/encomendas"
              element={
                <ProtectedRoute role="client">
                  <ClientLayout>
                    <ClientCustomOrders />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cliente/eventos"
              element={
                <ProtectedRoute role="client">
                  <ClientLayout>
                    <ClientEvents />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cliente/inscricoes"
              element={
                <ProtectedRoute role="client">
                  <ClientLayout>
                    <ClientRegistrations />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cliente/atendimento"
              element={
                <ProtectedRoute role="client">
                  <ClientLayout>
                    <ClientAttendance />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cliente/perfil"
              element={
                <ProtectedRoute role="client">
                  <ClientLayout>
                    <ClientProfile />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cliente/configuracoes"
              element={
                <ProtectedRoute role="client">
                  <ClientLayout>
                    <ClientSettings />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cliente/sobre"
              element={
                <ProtectedRoute role="client">
                  <ClientLayout>
                    <ClientAbout />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cliente/contato"
              element={
                <ProtectedRoute role="client">
                  <ClientLayout>
                    <ClientContact />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
