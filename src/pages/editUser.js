import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import UpdateUserDTO from '../models/updateUser.dto';
import usersService from '../services/users.service';
import useAuth from '../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';

function EditUserPage() {
    const { userId } = useParams();
    const [formData, setFormData] = useState(new UpdateUserDTO('', '', '', 'student', true));
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (authLoading) {
            return;
        }
        if (user?.role !== 'admin') {
            navigate('/unauthorized');
            return;
        }
        fetchUser();
    }, [user, authLoading, navigate, userId]);

    const fetchUser = async () => {
        setLoading(true);
        setError('');
        try {
            const userData = await usersService.getUserById(userId);
            setFormData(new UpdateUserDTO(
                userData.name,
                userData.email,
                '',
                userData.role,
                userData.status
            ));
        } catch (err) {
            setError(err.message || 'Error cargando usuario');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password) {
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

    const handleUpdateUser = async () => {
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setSaving(true);
        try {
            await usersService.updateUser(userId, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                status: formData.status
            });

            setSuccess('Usuario actualizado exitosamente');
            setTimeout(() => {
                navigate('/users-list');
            }, 1500);
        } catch (err) {
            setError(err.message || 'Error actualizando usuario');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(new UpdateUserDTO(
            field === 'name' ? value : formData.name,
            field === 'email' ? value : formData.email,
            field === 'password' ? value : formData.password,
            field === 'role' ? value : formData.role,
            formData.status
        ));
    };

    if (loading) {
        return (
            <Container>
                <LoadingText>Cargando usuario...</LoadingText>
            </Container>
        );
    }

    return (
        <Container>
            <FormWrapper>
                <Header>
                    <Title>Editar Usuario</Title>
                    <BackButton onClick={() => navigate('/users-list')}>
                        ← Volver
                    </BackButton>
                </Header>

                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <SuccessMessage>{success}</SuccessMessage>}

                <InputGroup>
                    <Label>Nombre Completo</Label>
                    <Input
                        type="text"
                        placeholder="Ej: Juan Pérez"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={saving}
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Correo Electrónico</Label>
                    <Input
                        type="email"
                        placeholder="Ej: usuario@ejemplo.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={saving}
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Nueva Contraseña</Label>
                    <PasswordInfo>Entre 8 y 10 caracteres</PasswordInfo>
                    <Input
                        type="password"
                        placeholder="Deja en blanco para no cambiar"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        disabled={saving}
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Rol</Label>
                    <Select
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        disabled={saving}
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
                            onChange={(e) => setFormData(new UpdateUserDTO(
                                formData.name,
                                formData.email,
                                formData.password,
                                formData.role,
                                e.target.checked
                            ))}
                            disabled={saving}
                        />
                        <span>Usuario activo</span>
                    </CheckboxLabel>
                </InputGroup>

                <Button onClick={handleUpdateUser} disabled={saving}>
                    {saving ? 'Guardando cambios...' : 'Guardar Cambios'}
                </Button>
            </FormWrapper>
        </Container>
    );
}

export default EditUserPage;

const Container = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 30px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const FormWrapper = styled.div`
    background: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 500px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
`;

const Title = styled.h1`
    color: #333;
    font-size: 28px;
    margin: 0;
`;

const BackButton = styled.button`
    padding: 8px 16px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.8;
    }
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

const LoadingText = styled.div`
    text-align: center;
    font-size: 16px;
    color: #667eea;
    padding: 50px;
`;
