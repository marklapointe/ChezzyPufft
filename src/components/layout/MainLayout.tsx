import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { NavDrawer } from './NavDrawer';
import './MainLayout.css';

export function MainLayout() {
  return (
    <div className="mainLayout">
      <div className="backdropContainer" />
      <div className="backgroundContainer" />
      <NavDrawer />
      <Header />
      <main className="mainAnimatedPages skinBody">
        <Outlet />
      </main>
      <div className="mainDrawerHandle" />
    </div>
  );
}
