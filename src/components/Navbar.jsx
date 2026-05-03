import { useState } from 'react'
import styled from 'styled-components'
import BurgerButton from './burgerButton'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

function NavContainer() {
    const [clicked, setClicked] = useState(false)
    const navigate = useNavigate()
    const { user, logout, tokenExpired } = useAuth()

    // Si el token está expirado, redirige
    if (tokenExpired) {
        navigate('/login?expired=true')
        return null
    }

    const handleClicked = () => {
        setClicked(!clicked)
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const handleNavigate = (path) => {
        navigate(path)
        setClicked(false)
    }

    return (
        <>
            <Navbar>
                <BrandContainer>
                    <h2>Sistema Integral Académico</h2>
                </BrandContainer>
                
                <div className={`links ${clicked ? 'active' : ''}`}>
                    <NavLink onClick={() => handleNavigate('/principal')}>
                        Dashboard
                    </NavLink>
                    {user?.role === 'admin' && (
                        <NavLink onClick={() => handleNavigate('/create-user')}>
                            Crear Usuario
                        </NavLink>
                    )}
                    <NavLink onClick={handleLogout}>
                        Cerrar Sesión
                    </NavLink>
                </div>

                <div className="burger">
                    <BurgerButton clicked={clicked} handleClicked={handleClicked} />
                </div>
                <BgDiv className={`initial ${clicked ? ' active' : ''}`}></BgDiv>
            </Navbar>

            <DashboardContainer>
                <DashboardContent>
                    <WelcomeSection>
                        <h1>Bienvenido, {user?.name}!</h1>
                        <UserInfoCard>
                            <InfoItem>
                                <Label>Email:</Label>
                                <Value>{user?.email}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label>Rol:</Label>
                                <RoleBadge role={user?.role}>
                                    {user?.role === 'admin' && 'Administrador'}
                                    {user?.role === 'student' && 'Estudiante'}
                                    {user?.role === 'teacher' && 'Docente'}
                                </RoleBadge>
                            </InfoItem>
                            <InfoItem>
                                <Label>Estado:</Label>
                                <StatusBadge status={user?.status}>
                                    {user?.status ? 'Activo' : 'Inactivo'}
                                </StatusBadge>
                            </InfoItem>
                        </UserInfoCard>
                    </WelcomeSection>

                    {user?.role === 'admin' && (
                        <AdminSection>
                            <h2>Opciones de Administrador</h2>
                            <OptionsGrid>
                                <OptionCard onClick={() => handleNavigate('/create-user')}>
                                    <OptionIcon>👤</OptionIcon>
                                    <OptionTitle>Crear Usuario</OptionTitle>
                                    <OptionDesc>Agregar nuevo usuario al sistema</OptionDesc>
                                </OptionCard>
                                <OptionCard onClick={() => handleNavigate('/users-list')}>
                                    <OptionIcon>📋</OptionIcon>
                                    <OptionTitle>Gestionar Usuarios</OptionTitle>
                                    <OptionDesc>Ver, editar y desactivar usuarios</OptionDesc>
                                </OptionCard>
                                
                                    
                            </OptionsGrid>
                        </AdminSection>
                    )}

                    {user?.role === 'student' && (
                        <StudentSection>
                            <h2>Opciones de Estudiante</h2>
                            <OptionsGrid>
                                <OptionCard disabled>
                                    <OptionIcon>📚</OptionIcon>
                                    <OptionTitle>Mis Cursos</OptionTitle>
                                    <OptionDesc>Ver tus cursos inscritos</OptionDesc>
                                </OptionCard>
                                <OptionCard disabled>
                                    <OptionIcon>📝</OptionIcon>
                                    <OptionTitle>Calificaciones</OptionTitle>
                                    <OptionDesc>Ver tus calificaciones</OptionDesc>
                                </OptionCard>
                                <OptionCard disabled>
                                    <OptionIcon>📄</OptionIcon>
                                    <OptionTitle>Tareas</OptionTitle>
                                    <OptionDesc>Ver tareas asignadas</OptionDesc>
                                </OptionCard>
                            </OptionsGrid>
                        </StudentSection>
                    )}

                    {user?.role === 'teacher' && (
                        <TeacherSection>
                            <h2>Opciones de Docente</h2>
                            <OptionsGrid>
                                <OptionCard disabled>
                                    <OptionIcon>👨‍🎓</OptionIcon>
                                    <OptionTitle>Mis Estudiantes</OptionTitle>
                                    <OptionDesc>Gestionar estudiantes de tus cursos</OptionDesc>
                                </OptionCard>
                                <OptionCard disabled>
                                    <OptionIcon>📊</OptionIcon>
                                    <OptionTitle>Calificar</OptionTitle>
                                    <OptionDesc>Ingresar calificaciones</OptionDesc>
                                </OptionCard>
                                <OptionCard disabled>
                                    <OptionIcon>📋</OptionIcon>
                                    <OptionTitle>Mis Cursos</OptionTitle>
                                    <OptionDesc>Gestionar tus cursos</OptionDesc>
                                </OptionCard>
                            </OptionsGrid>
                        </TeacherSection>
                    )}
                </DashboardContent>
            </DashboardContainer>
        </>
    )
}

export default NavContainer

const Navbar = styled.nav`
    font-family: ui-serif, Georgia, serif;
    padding: 0.4rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    position: sticky;
    top: 0;
    z-index: 1000;

    h2 {
        color: white;
        font-weight: 800;
        font-size: 1.5rem;
        margin: 0;
    }

    .links {
        display: flex;
        gap: 2rem;
        align-items: center;

        @media (max-width: 768px) {
            position: fixed;
            left: -100%;
            top: 50px;
            flex-direction: column;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            width: 100%;
            text-align: center;
            transition: 0.3s;
            gap: 1rem;
            padding: 2rem 0;

            &.active {
                left: 0;
            }
        }
    }

    .burger {
        display: none;

        @media (max-width: 768px) {
            display: block;
        }
    }
`;

const BrandContainer = styled.div`
    padding: 0 1rem;
`;

const NavLink = styled.a`
    color: white;
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.8;
    }
`;

const BgDiv = styled.div`
    @media (max-width: 768px) {
        position: fixed;
        background: rgba(0, 0, 0, 0.3);
        width: 100%;
        height: 100%;
        top: 50px;
        left: -100%;
        transition: 0.3s;

        &.active {
            left: 0;
        }
    }
`;

const DashboardContainer = styled.div`
    min-height: calc(100vh - 60px);
    background: #f5f7fa;
    padding: 20px;
`;

const DashboardContent = styled.div`
    max-width: 1200px;
    margin: 0 auto;
`;

const WelcomeSection = styled.section`
    margin-bottom: 40px;

    h1 {
        color: #333;
        margin-bottom: 20px;
        font-size: 32px;
    }
`;

const UserInfoCard = styled.div`
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
`;

const InfoItem = styled.div`
    display: flex;
    flex-direction: column;
`;

const Label = styled.span`
    color: #999;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 8px;
`;

const Value = styled.span`
    color: #333;
    font-size: 16px;
    font-weight: 500;
`;

const RoleBadge = styled.span`
    display: inline-block;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    width: fit-content;
    background-color: ${props => {
        if (props.role === 'admin') return '#ffe6e6';
        if (props.role === 'teacher') return '#e6f3ff';
        if (props.role === 'student') return '#e6ffe6';
        return '#f0f0f0';
    }};
    color: ${props => {
        if (props.role === 'admin') return '#c33';
        if (props.role === 'teacher') return '#0066cc';
        if (props.role === 'student') return '#009900';
        return '#333';
    }};
`;

const StatusBadge = styled.span`
    display: inline-block;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    width: fit-content;
    background-color: ${props => props.status ? '#e6ffe6' : '#ffe6e6'};
    color: ${props => props.status ? '#009900' : '#c33'};
`;

const AdminSection = styled.section`
    margin-top: 40px;

    h2 {
        color: #333;
        margin-bottom: 20px;
        font-size: 24px;
    }
`;

const StudentSection = styled.section`
    margin-top: 40px;

    h2 {
        color: #333;
        margin-bottom: 20px;
        font-size: 24px;
    }
`;

const TeacherSection = styled.section`
    margin-top: 40px;

    h2 {
        color: #333;
        margin-bottom: 20px;
        font-size: 24px;
    }
`;

const OptionsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
`;

const OptionCard = styled.div`
    background: white;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
    opacity: ${props => props.disabled ? 0.6 : 1};
    text-align: center;

    &:hover {
        ${props => !props.disabled && `
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        `}
    }
`;

const OptionIcon = styled.div`
    font-size: 48px;
    margin-bottom: 15px;
`;

const OptionTitle = styled.h3`
    color: #333;
    margin-bottom: 10px;
    font-size: 18px;
`;

const OptionDesc = styled.p`
    color: #999;
    font-size: 14px;
    margin: 0;
`;