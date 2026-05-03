import { useState } from 'react'
import styled from 'styled-components'
import BurgerButton from './burgerButton'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

function NavigationBar() {
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
        <Navbar>
            <BrandContainer>
                <h2>Sistema Integral Académico</h2>
            </BrandContainer>
            
            <div className={`links ${clicked ? 'active' : ''}`}>
                <NavLink onClick={() => handleNavigate('/principal')}>
                    Dashboard
                </NavLink>
                {user?.role === 'admin' && (
                    <>
                        <NavLink onClick={() => handleNavigate('/create-user')}>
                            Crear Usuario
                        </NavLink>
                        <NavLink onClick={() => handleNavigate('/users-list')}>
                            Gestionar Usuarios
                        </NavLink>
                    </>
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
    )
}

export default NavigationBar;

const Navbar = styled.nav`
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
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
        font-weight: 600;
        font-size: 1.3rem;
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
    font-size: 14px;
    cursor: pointer;
    transition: opacity 0.2s;
    position: relative;
    z-index: 1001;

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
        pointer-events: none;

        &.active {
            left: 0;
        }
    }
`;
