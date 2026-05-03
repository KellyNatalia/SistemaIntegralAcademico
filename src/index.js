import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import SignUpPage from './pages/signUp';
import Dashboard from './pages/dashboard';
import CreateUserPage from './pages/createUser';
import UsersListPage from './pages/usersList';
import EditUserPage from './pages/editUser';
import UnauthorizedPage from './pages/unauthorized';
import TokenExpiredPage from './pages/tokenExpired';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Rutas protegidas con Layout (Navbar incluido) */}
        <Route 
          path="/principal" 
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Solo admin puede crear usuarios */}
        <Route 
          path="/create-user" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <CreateUserPage />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Solo admin puede listar usuarios */}
        <Route 
          path="/users-list" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <UsersListPage />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Solo admin puede editar usuarios */}
        <Route 
          path="/edit-user/:userId" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <EditUserPage />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Páginas de error/información */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/token-expired" element={<TokenExpiredPage />} />

        {/* Ruta 404 - redirige a login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
