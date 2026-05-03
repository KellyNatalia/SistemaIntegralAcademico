import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';

function TokenExpiredPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isExpired = searchParams.get('expired') === 'true';

    useEffect(() => {
        // Redirige después de 3 segundos automáticamente
        const timer = setTimeout(() => {
            navigate('/login');
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Container>
            <Content>
                <Icon>⏰</Icon>
                <Title>Sesión Expirada</Title>
                <Description>
                    {isExpired 
                        ? 'Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.'
                        : 'Tu token de autenticación no es válido. Por favor, inicia sesión.'}
                </Description>
                <InfoText>Serás redirigido a login en unos segundos...</InfoText>
                <Button onClick={() => navigate('/login')}>
                    Ir a Login Ahora
                </Button>
            </Content>
        </Container>
    );
}

export default TokenExpiredPage;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
`;

const Content = styled.div`
    background: white;
    padding: 60px 40px;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    text-align: center;
    max-width: 500px;
`;

const Icon = styled.div`
    font-size: 80px;
    margin-bottom: 20px;
    animation: pulse 1.5s ease-in-out infinite;

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
`;

const Title = styled.h1`
    color: #333;
    font-size: 32px;
    margin-bottom: 15px;
`;

const Description = styled.p`
    color: #666;
    font-size: 16px;
    margin-bottom: 15px;
    line-height: 1.6;
`;

const InfoText = styled.p`
    color: #999;
    font-size: 14px;
    margin-bottom: 30px;
    font-style: italic;
`;

const Button = styled.button`
    padding: 12px 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s;

    &:hover {
        transform: translateY(-2px);
        opacity: 0.9;
    }
`;
