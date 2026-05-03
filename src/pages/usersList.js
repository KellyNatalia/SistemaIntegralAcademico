import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import usersService from '../services/users.service';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function UsersListPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
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
        fetchUsers();
    }, [user, authLoading, navigate]);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await usersService.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message || 'Error cargando usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('¿Estás seguro de que quieres desactivar este usuario?')) {
            return;
        }

        try {
            await usersService.deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
            setError(err.message || 'Error desactivando usuario');
        }
    };

    const handleEdit = (userId) => {
        navigate(`/edit-user/${userId}`);
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <Container>
                <LoadingText>Cargando usuarios...</LoadingText>
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <Title>Gestionar Usuarios</Title>
                <BackButton onClick={() => navigate('/principal')}>
                    ← Volver
                </BackButton>
            </Header>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <SearchBox>
                <SearchInput
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ResultCount>
                    {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
                </ResultCount>
            </SearchBox>

            {filteredUsers.length === 0 ? (
                <NoUsers>No hay usuarios que coincidan con tu búsqueda</NoUsers>
            ) : (
                <TableWrapper>
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(u => (
                                <tr key={u.id}>
                                    <td>#{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <RoleBadge $role={u.role}>
                                            {u.role === 'admin' && 'Admin'}
                                            {u.role === 'student' && 'Estudiante'}
                                            {u.role === 'teacher' && 'Docente'}
                                        </RoleBadge>
                                    </td>
                                    <td>
                                        <StatusBadge $status={u.status}>
                                            {u.status ? 'Activo' : 'Inactivo'}
                                        </StatusBadge>
                                    </td>
                                    <td>
                                        <ActionButtons>
                                            <EditButton onClick={() => handleEdit(u.id)}>
                                                ✏️ Editar
                                            </EditButton>
                                            <DeleteButton onClick={() => handleDelete(u.id)}>
                                                🗑️ Desactivar
                                            </DeleteButton>
                                        </ActionButtons>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </TableWrapper>
            )}
        </Container>
    );
}

export default UsersListPage;

const Container = styled.div`
    min-height: 100vh;
    background: #f5f7fa;
    padding: 30px 20px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
`;

const Title = styled.h1`
    color: #333;
    font-size: 32px;
    margin: 0;
`;

const BackButton = styled.button`
    padding: 10px 20px;
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

const ErrorMessage = styled.div`
    background-color: #fee;
    color: #c33;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
    border-left: 4px solid #c33;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
`;

const SearchBox = styled.div`
    display: flex;
    gap: 15px;
    align-items: center;
    margin-bottom: 30px;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
`;

const SearchInput = styled.input`
    flex: 1;
    padding: 12px 15px;
    border: 2px solid #e0e0e0;
    border-radius: 5px;
    font-size: 14px;
    transition: border-color 0.3s;

    &:focus {
        outline: none;
        border-color: #667eea;
    }
`;

const ResultCount = styled.span`
    color: #666;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
`;

const NoUsers = styled.div`
    text-align: center;
    padding: 40px;
    background: white;
    border-radius: 10px;
    color: #999;
    font-size: 16px;
    max-width: 1200px;
    margin: 0 auto;
`;

const TableWrapper = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow-x: auto;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;

    thead tr {
        background: #f8f9fa;
        border-bottom: 2px solid #e0e0e0;
    }

    th {
        padding: 15px;
        text-align: left;
        font-weight: 600;
        color: #333;
        font-size: 14px;
    }

    tbody tr {
        border-bottom: 1px solid #e0e0e0;
        transition: background-color 0.2s;

        &:hover {
            background-color: #f8f9fa;
        }

        &:last-child {
            border-bottom: none;
        }
    }

    td {
        padding: 15px;
        color: #333;
        font-size: 14px;
    }
`;

const RoleBadge = styled.span`
    display: inline-block;
    padding: 6px 12px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 600;
    background-color: ${props => {
        if (props.$role === 'admin') return '#ffe6e6';
        if (props.$role === 'teacher') return '#e6f3ff';
        if (props.$role === 'student') return '#e6ffe6';
        return '#f0f0f0';
    }};
    color: ${props => {
        if (props.$role === 'admin') return '#c33';
        if (props.$role === 'teacher') return '#0066cc';
        if (props.$role === 'student') return '#009900';
        return '#333';
    }};
`;

const StatusBadge = styled.span`
    display: inline-block;
    padding: 6px 12px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 600;
    background-color: ${props => props.$status ? '#e6ffe6' : '#ffe6e6'};
    color: ${props => props.$status ? '#009900' : '#c33'};
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 10px;
`;

const EditButton = styled.button`
    padding: 6px 12px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.8;
    }
`;

const DeleteButton = styled.button`
    padding: 6px 12px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.8;
    }
`;

const LoadingText = styled.div`
    text-align: center;
    font-size: 16px;
    color: #667eea;
    padding: 50px;
`;
