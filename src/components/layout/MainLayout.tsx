import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { NavDrawer } from './NavDrawer';
import './MainLayout.css';

interface MainLayoutProps {
  children?: React.ReactNode;
  backdropUrl?: string;
}

export function MainLayout({ children, backdropUrl }: MainLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      navigate('/search');
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="mainLayout">
      <div
        className="backdropContainer"
        style={
          backdropUrl
            ? {
                backgroundImage: `url(${backdropUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      />
      <div className="backgroundContainer" />
      <NavDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose} />
      <Header onMenuToggle={handleMenuToggle} onSearchToggle={handleSearchToggle} />
      <main className="mainAnimatedPages skinBody">
        {children}
        <Outlet />
      </main>
      <div className="mainDrawerHandle" />
    </div>
  );
}