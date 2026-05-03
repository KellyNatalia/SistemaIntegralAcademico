import React, { useState } from 'react';
import styled from 'styled-components';
import CreateUserAdminDTO from '../models/createUserAdmin.dto';
import usersService from '../services/users.service';

function CreateUserPage() {
    const [formData, setFormData] = useState(new CreateUserAdminDTO( 'student', true));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('error');
    const [success, setSuccess] = useState('success');

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.role) {
            setError('Por favor completa todos los campos');
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

    const handleCreateUser = async () => {
        setError('error');
        setSuccess('success');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const res = await usersService.createUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                status: formData.status
            });

            if (res.id) {
                setSuccess(`Usuario ${formData.name} creado exitosamente`);
                setFormData(new CreateUserAdminDTO('student', true));
            }
        } catch (err) {
            setError(err.message || 'Error creando usuario');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleCreateUser();
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(new CreateUserAdminDTO(
            field === 'name' ? value : formData.name,
            field === 'email' ? value : formData.email,
            field === 'password' ? value : formData.password,
            field === 'role' ? value : formData.role,
            formData.status
        ));
    };

    return (
        <Container>
            <FormWrapper>
                <Title>Crear Nuevo Usuario</Title>
                <Subtitle>Ingresa los datos del nuevo usuario</Subtitle>

                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <SuccessMessage>{success}</SuccessMessage>}

                <InputGroup>
                    <Label>Nombre Completo</Label>
                    <Input
                        type="text"
                        placeholder="Ej: Juan Pérez"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Correo Electrónico</Label>
                    <Input
                        type="email"
                        placeholder="Ej: usuario@ejemplo.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Contraseña</Label>
                    <PasswordInfo>Entre 8 y 10 caracteres</PasswordInfo>
                    <Input
                        type="password"
                        placeholder="Ingresa una contraseña segura"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Rol</Label>
                    <Select
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        disabled={loading}
                    >
                        <option value="student">Estudiante</option>
                        <option value="teacher">Docente</option>
                        <option value="admin">Administrador</option>
                    </Select>
                </InputGroup>

                <InputGroup>
                    <CheckboxLabel>
                        <Checkbox
                            type="checkbox"
                            checked={formData.status}
                            onChange={(e) => setFormData(new CreateUserAdminDTO(
                                formData.name,
                                formData.email,
                                formData.password,
                                formData.role,
                                e.target.checked
                            ))}
                            disabled={loading}
                        />
                        <span>Usuario activo</span>
                    </CheckboxLabel>
                </InputGroup>

                <Button onClick={handleCreateUser} disabled={loading}>
                    {loading ? 'Creando usuario...' : 'Crear Usuario'}
                </Button>
            </FormWrapper>
        </Container>
    );
}

export default CreateUserPage;

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
    max-width: 500px;
`;

const Title = styled.h1`
    text-align: center;
    color: #333;
    margin-bottom: 10px;
    font-size: 28px;
`;

const Subtitle = styled.p`
    text-align: center;
    color: #666;
    margin-bottom: 30px;
    font-size: 14px;
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

const Select = styled.select`
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e0e0e0;
    border-radius: 5px;
    font-size: 14px;
    background-color: white;
    transition: border-color 0.3s;
    box-sizing: border-box;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: #667eea;
    }

    &:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    color: #333;
    font-size: 14px;

    span {
        user-select: none;
    }
`;

const Checkbox = styled.input`
    cursor: pointer;
    width: 18px;
    height: 18px;

    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
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
    margin-bottom: 20px;
    font-size: 14px;
    border-left: 4px solid #3c3;
`;
