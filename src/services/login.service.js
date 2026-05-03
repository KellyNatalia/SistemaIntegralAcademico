
const loginService = {
    login: async (loginDTO) => {
        try {
            const response = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: loginDTO.email,
                    password: loginDTO.password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en el login');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }
}

export default loginService
