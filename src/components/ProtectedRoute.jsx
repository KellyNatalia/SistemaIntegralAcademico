import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * Componente para proteger rutas que requieren autenticación
 * Opcionalmente valida que el usuario tenga un rol específico
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente a renderizar si está autenticado
 * @param {string | string[]} props.requiredRole - Rol(es) requerido(s) (opcional)
 * @returns {React.ReactNode}
 * 
 * Ejemplo:
 * <ProtectedRoute requiredRole="admin">
 *   <AdminPage />
 * </ProtectedRoute>
 * 
 * O para múltiples roles:
 *   <ManagePage />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { user, isAuthenticated, loading, tokenExpired } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '24px',
                color: '#667eea'
            }}>
                Cargando...
            </div>
        );
    }

    // Token expirado
    if (tokenExpired) {
        return <Navigate to="/login?expired=true" replace />;
    }

    // No autenticado
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // Validar rol si se especifica
    if (requiredRole) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        
        if (!roles.includes(user.role)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
