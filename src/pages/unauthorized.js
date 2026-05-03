import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function UnauthorizedPage() {
    const navigate = useNavigate();

    return (
        <Container>
            <Content>
                <ErrorCode>403</ErrorCode>
                <Title>Acceso Denegado</Title>
                <Description>
                    No tienes permisos para acceder a esta página. 
                    Tu rol actual no autoriza el acceso a este recurso.
                </Description>
                <Button onClick={() => navigate('/principal')}>
                    Volver al Dashboard
                </Button>
            </Content>
        </Container>
    );
}

export default UnauthorizedPage;

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

const ErrorCode = styled.div`
    font-size: 120px;
    font-weight: 800;
    color: #667eea;
    margin-bottom: 20px;
    line-height: 1;
`;

const Title = styled.h1`
    color: #333;
    font-size: 32px;
    margin-bottom: 15px;
`;

const Description = styled.p`
    color: #666;
    font-size: 16px;
    margin-bottom: 30px;
    line-height: 1.6;
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
