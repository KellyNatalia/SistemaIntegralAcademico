const usersService = {
    getToken: () => {
        return localStorage.getItem('token');
    },

    createUser: async (userData) => {
        try {
            const token = usersService.getToken();
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch('http://localhost:3001/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error creando usuario');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    },

    getAllUsers: async () => {
        try {
            const token = usersService.getToken();
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch('http://localhost:3001/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error obteniendo usuarios');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    },

    updateUser: async (userId, userData) => {
        try {
            const token = usersService.getToken();
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(`http://localhost:3001/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error actualizando usuario');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    },

    deleteUser: async (userId) => {
        try {
            const token = usersService.getToken();
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(`http://localhost:3001/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error desactivando usuario');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    },

    getUserById: async (userId) => {
        try {
            const token = usersService.getToken();
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(`http://localhost:3001/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error obteniendo usuario');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }
}

export default usersService
