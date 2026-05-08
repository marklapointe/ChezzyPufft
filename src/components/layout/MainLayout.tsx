import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { NavDrawer } from './NavDrawer';
import './MainLayout.css';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="mainLayout">
      <div className="backdropContainer" />
      <div className="backgroundContainer" />
      <NavDrawer />
      <Header />
      <main className="mainAnimatedPages skinBody">
        {children}
        <Outlet />
      </main>
      <div className="mainDrawerHandle" />
    </div>
  );
}
