import React from 'react';

const Header = () => {
    return (
        <header style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            height: '80px',
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(3, 3, 5, 0.8)',
            color: 'white'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 40px',
                width: '100%'
            }}>
                <nav style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        letterSpacing: '1px'
                    }}>
                        <a href="/" style={{ color: 'white', textDecoration: 'none' }}>TINMCO</a>
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '40px'
                    }} className="nav-links-container">
                        <a href="/#methodology" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#a1a1aa', textDecoration: 'none' }}>Methodology</a>
                        <a href="/#capabilities" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#a1a1aa', textDecoration: 'none' }}>Capabilities</a>
                        <a href="/#portfolio" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#a1a1aa', textDecoration: 'none' }}>Portfolio</a>
                        <a href="/#contact" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#a1a1aa', textDecoration: 'none' }}>Initiate</a>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
