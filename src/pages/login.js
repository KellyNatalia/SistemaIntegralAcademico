import React, { useState } from 'react';
import styled from 'styled-components';
import LoginDTO from '../models/login.dto';
import loginService from '../services/login.service';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function LoginPage() {
    const [loginDTO, setLoginDTO] = useState(new LoginDTO('', ''));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    const isTokenExpired = searchParams.get('expired') === 'true';

    const handleLogin = async () => {
        setError('');
        
        if (!loginDTO.email || !loginDTO.password) {
            setError('Por favor completa todos los campos');
            return;
        }

        setLoading(true);
        try {
            const res = await loginService.login(loginDTO);
            
            if (res.accessToken) {
                // Guarda el token
                localStorage.setItem('token', res.accessToken);
                
                // Obtiene los datos completos del usuario desde el profile endpoint
                const profileResponse = await fetch('http://localhost:3001/auth/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${res.accessToken}`
                    }
                });

                if (profileResponse.ok) {
                    const userData = await profileResponse.json();
                    // Usa el hook para guardar la autenticación con los datos completos
                    login(res.accessToken, userData);
                    navigate('/principal');
                } else {
                    throw new Error('Error obteniendo datos del usuario');
                }
            }
        } catch (err) {
            setError(err.message || 'Error en login. Verifica tus credenciales');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <Container>
            <FormWrapper>
                <Title>Sistema Integral Académico</Title>
                <Subtitle>Iniciar Sesión</Subtitle>
                
                {isTokenExpired && (
                    <ExpiredTokenMessage>
                        Tu sesión expiró. Por favor, inicia sesión nuevamente.
                    </ExpiredTokenMessage>
                )}
                
                {error && <ErrorMessage>{error}</ErrorMessage>}
                
                <InputGroup>
                    <Label>Correo Electrónico</Label>
                    <Input
                        type="email"
                        placeholder="Ingresa tu correo"
                        value={loginDTO.email}
                        onChange={(e) => setLoginDTO(new LoginDTO(e.target.value, loginDTO.password))}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Contraseña</Label>
                    <Input
                        type="password"
                        placeholder="Ingresa tu contraseña"
                        value={loginDTO.password}
                        onChange={(e) => setLoginDTO(new LoginDTO(loginDTO.email, e.target.value))}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />
                </InputGroup>

                <Button onClick={handleLogin} disabled={loading}>
                    {loading ? 'Iniciando sesión...' : 'Entrar'}
                </Button>

                <SignUpLink>
                    ¿No tienes cuenta? <a href="/signup">Regístrate aquí</a>
                </SignUpLink>
            </FormWrapper>
        </Container>
    );
}

export default LoginPage;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
`;

const FormWrapper = styled.div`
    background: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
`;

const Title = styled.h1`
    text-align: center;
    color: #333;
    margin-bottom: 10px;
    font-size: 28px;
`;

const Subtitle = styled.h2`
    text-align: center;
    color: #666;
    margin-bottom: 30px;
    font-size: 20px;
    font-weight: 600;
`;

const ExpiredTokenMessage = styled.div`
    background-color: #fffacd;
    color: #856404;
    padding: 12px;
    border-radius: 5px;
    margin-bottom: 20px;
    font-size: 14px;
    border-left: 4px solid #ffc107;
`;

const InputGroup = styled.div`
    margin-bottom: 20px;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: 500;
    font-size: 14px;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e0e0e0;
    border-radius: 5px;
    font-size: 14px;
    transition: border-color 0.3s;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: #667eea;
    }

    &:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }
`;

const Button = styled.button`
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s;

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        opacity: 0.9;
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.div`
    background-color: #fee;
    color: #c33;
    padding: 12px;
    border-radius: 5px;
    margin-bottom: 20px;
    font-size: 14px;
    border-left: 4px solid #c33;
`;

const SignUpLink = styled.div`
    text-align: center;
    margin-top: 20px;
    color: #666;
    font-size: 14px;

    a {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;

        &:hover {
            text-decoration: underline;
        }
    }
`;
