import styled from 'styled-components';
import NavigationBar from './NavigationBar';

function Layout({ children }) {
  return (
    <LayoutContainer>
      <NavigationBar />
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
}

export default Layout;

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  background: #f5f7fa;
`;
