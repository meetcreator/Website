import React from 'react';

const Footer = () => {
    return (
        <footer id="contact" style={{
            padding: '80px 0 40px',
            background: 'black',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            marginTop: '60px',
            color: 'white'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 40px',
                width: '100%'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    paddingBottom: '60px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    marginBottom: '40px'
                }} className="footer-top-container">
                    <div className="footer-cta">
                        <span style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            fontSize: '0.8rem',
                            color: '#3b82f6',
                            marginBottom: '24px',
                            display: 'block'
                        }}>Ready to Scale?</span>
                        <h2 style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: '3rem',
                            fontWeight: 600,
                            letterSpacing: '-0.03em',
                            lineHeight: 1.1,
                            marginBottom: '24px'
                        }}>Let's build your<br />infrastructure.</h2>
                    </div>
                    <a href="mailto:404notfoundany@gmail.com" className="branding-btn" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px 32px',
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'transparent',
                        color: 'white',
                        textDecoration: 'none',
                        transition: 'all 0.3s'
                    }}>404notfoundany@gmail.com</a>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#52525b',
                    fontSize: '0.8rem'
                }}>
                    <div>&copy; 2026 TINMCO Consultancy.</div>
                    <div>Designed for Authority.</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
