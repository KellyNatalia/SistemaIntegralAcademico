import { useState } from 'react';
import styled from 'styled-components';
import SignUpDTO from '../models/signUp.dto';
import signUpService from '../services/signUp.service';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
  const [formData, setFormData] = useState(new SignUpDTO('', '', ''));
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      return false;
    }
    
    if (formData.password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (formData.password.length < 8 || formData.password.length > 10) {
      setError('La contraseña debe tener entre 8 y 10 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un correo válido');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await signUpService.signUp(formData.name, formData.email, formData.password);
      
      if (res.message || res.user) {
        setSuccess('¡Registro exitoso! Puedes iniciar sesión ahora.');
        // Redirige automáticamente después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError(err.message || 'Error en el registro. Intenta con otro correo');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignUp();
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(new SignUpDTO(
      field === 'name' ? value : formData.name,
      field === 'email' ? value : formData.email,
      field === 'password' ? value : formData.password
    ));
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Sistema Integral Académico</Title>
        <Subtitle>Crear Cuenta</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && (
          <SuccessContainer>
            <SuccessMessage>{success}</SuccessMessage>
            <SuccessButton onClick={() => navigate('/login')}>
              Ir a Login
            </SuccessButton>
            <AutoRedirectMessage>
              (Redirigiendo automáticamente en 3 segundos...)
            </AutoRedirectMessage>
          </SuccessContainer>
        )}

        <InputGroup>
          <Label>Nombre Completo</Label>
          <Input
            type="text"
            placeholder="Ingresa tu nombre"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading || success}
          />
        </InputGroup>

        <InputGroup>
          <Label>Correo Electrónico</Label>
          <Input
            type="email"
            placeholder="Ingresa tu correo"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading || success}
          />
        </InputGroup>

        <InputGroup>
          <Label>Contraseña</Label>
          <PasswordInfo>Entre 8 y 10 caracteres</PasswordInfo>
          <Input
            type="password"
            placeholder="Ingresa tu contraseña"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading || success}
          />
        </InputGroup>

        <InputGroup>
          <Label>Confirmar Contraseña</Label>
          <Input
            type="password"
            placeholder="Confirma tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading || success}
          />
        </InputGroup>

        <Button onClick={handleSignUp} disabled={loading || success}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </Button>

        {!success && (
          <LoginLink>
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
          </LoginLink>
        )}
      </FormWrapper>
    </Container>
  );
}

export default SignUpPage;

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
  max-width: 450px;
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

const PasswordInfo = styled.span`
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
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

const SuccessMessage = styled.div`
  background-color: #efe;
  color: #3c3;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 14px;
  border-left: 4px solid #3c3;
`;

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const SuccessButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #3c3;
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

  &:active {
    transform: translateY(0);
  }
`;

const AutoRedirectMessage = styled.p`
  text-align: center;
  font-size: 12px;
  color: #999;
  margin: 0;
  font-style: italic;
`;

const LoginLink = styled.div`
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
