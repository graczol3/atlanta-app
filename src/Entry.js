import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Entry() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const loginAs = (type) => {
    setLoginDropdownOpen(false);
    if (type === 'admin') {
      navigate('/admin/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="entry-page">
      {/* Top Banner */}
      {bannerVisible && (
        <div className="entry-banner">
          <span>🏢 Profesjonalny system zarządzania nieruchomościami - zarządzaj efektywnie i oszczędzaj czas!</span>
          <button className="entry-banner-close" onClick={() => setBannerVisible(false)}>×</button>
        </div>
      )}

      {/* Header Navigation */}
      <header className="entry-header">
        <nav className="entry-nav">
          <div className="entry-logo-section">
            <div className="entry-logo">
              <div className="entry-logo-icon">
                <svg width="50" height="50" viewBox="0 0 200 200" fill="none">
                  <defs>
                    <linearGradient id="atlantaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#1e3a8a'}} />
                      <stop offset="100%" style={{stopColor: '#3b82f6'}} />
                    </linearGradient>
                  </defs>
                  <rect x="20" y="175" width="160" height="8" fill="url(#atlantaGradient)"/>
                  <rect x="30" y="120" width="35" height="55" fill="url(#atlantaGradient)"/>
                  <rect x="35" y="125" width="6" height="8" fill="white"/>
                  <rect x="44" y="125" width="6" height="8" fill="white"/>
                  <rect x="54" y="125" width="6" height="8" fill="white"/>
                  <rect x="35" y="138" width="6" height="8" fill="white"/>
                  <rect x="44" y="138" width="6" height="8" fill="white"/>
                  <rect x="54" y="138" width="6" height="8" fill="white"/>
                  <rect x="35" y="151" width="6" height="8" fill="white"/>
                  <rect x="44" y="151" width="6" height="8" fill="white"/>
                  <rect x="54" y="151" width="6" height="8" fill="white"/>
                  <rect x="35" y="164" width="6" height="8" fill="white"/>
                  <rect x="44" y="164" width="6" height="8" fill="white"/>
                  <rect x="54" y="164" width="6" height="8" fill="white"/>
                  <rect x="75" y="50" width="50" height="125" fill="url(#atlantaGradient)"/>
                  <polygon points="100,20 75,50 125,50" fill="url(#atlantaGradient)"/>
                  {[60,75,90,105,120,135,150,165].map((y) =>
                    [82,92,102,112].map((x) => (
                      <rect key={`${x}-${y}`} x={x} y={y} width="8" height="10" fill="white"/>
                    ))
                  )}
                  <rect x="135" y="100" width="35" height="75" fill="url(#atlantaGradient)"/>
                  {[105,118,131,144,157].map((y) =>
                    [140,149,158].map((x) => (
                      <rect key={`${x}-${y}`} x={x} y={y} width="6" height="8" fill="white"/>
                    ))
                  )}
                </svg>
              </div>
              <span className="entry-logo-text" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>ATLANTA</span>
            </div>
          </div>

          <ul className={`entry-nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
  <li><button className="entry-nav-link" onClick={() => navigate('/property-showcase')}>Nieruchomości</button></li>
  <li><button className="entry-nav-link" onClick={() => navigate('/cennik')}>Regulamin</button></li>
  <li><button className="entry-nav-link" onClick={() => navigate('/o-nas')}>O nas</button></li>
  <li><button className="entry-nav-link" onClick={() => navigate('/kontakt')}>Kontakt</button></li>
  <li><button className="entry-nav-link" onClick={() => navigate('/pomoc')}>Pomoc</button></li>
</ul>

          <div className="entry-auth-section">
            <div 
              className="entry-login-dropdown"
              onMouseEnter={() => setLoginDropdownOpen(true)}
              onMouseLeave={() => setLoginDropdownOpen(false)}
            >
              <button className="entry-login-btn">
                Zaloguj się ▼
              </button>

              <div className={`entry-dropdown-content ${loginDropdownOpen ? "open" : ""}`}>
                <button className="entry-dropdown-item" onClick={() => loginAs('admin')}>
                  👤 Administrator
                </button>
                <button className="entry-dropdown-item" onClick={() => loginAs('user')}>
                  👥 Użytkownik
                </button>
              </div>
            </div>

            <button className="entry-register-btn" onClick={() => navigate('/register')}>
              Zarejestruj się
            </button>
          </div>

          <button className="entry-mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            ☰
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="entry-hero">
        <div className="entry-hero-content">
          <div className="entry-hero-text">
            <p className="entry-hero-subtitle">System zarządzania nieruchomościami</p>
            <h1 className="entry-hero-title">Zarządzaj swoimi nieruchomościami w jednym miejscu</h1>
            <p className="entry-hero-description">
              Kompleksowe rozwiązanie do zarządzania portfelem nieruchomości. 
              Kontroluj umowy, płatności, najemców i generuj raporty - wszystko w intuicyjnym interfejsie.
            </p>
            <div className="entry-hero-buttons">
              <button className="entry-btn-primary" onClick={() => navigate('/register')}>
                Rozpocznij za darmo
              </button>
              {/* ZMIANA: Zobacz demo teraz prowadzi do podglądu nieruchomości */}
              <button className="entry-btn-secondary" onClick={() => navigate('/property-showcase')}>
                Zobacz nieruchomości
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="entry-features">
        <div className="entry-features-container">
          <h2 className="entry-section-title">Wszystko czego potrzebujesz w jednym miejscu</h2>
          
          <div className="entry-features-grid">
            {/* ZMIANA: Kliknięcie w kartę bazy nieruchomości też może przenosić do galerii */}
            <div className="entry-feature-card" onClick={() => navigate('/property-showcase')} style={{cursor: 'pointer'}}>
              <div className="entry-feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                  <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
                </svg>
              </div>
              <h3 className="entry-feature-title">Baza Nieruchomości</h3>
              <p className="entry-feature-description">
                Zarządzaj wszystkimi swoimi nieruchomościami w jednym miejscu. 
                Pełna dokumentacja, zdjęcia i historia każdej lokalizacji.
              </p>
            </div>

            <div className="entry-feature-card">
              <div className="entry-feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
              <h3 className="entry-feature-title">Zarządzanie Najemcami</h3>
              <p className="entry-feature-description">
                Kompletna baza najemców z historią płatności, umowami 
                i komunikacją. Przypomnienia o płatnościach i zakończeniu umów.
              </p>
            </div>

            <div className="entry-feature-card">
              <div className="entry-feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <h3 className="entry-feature-title">Raporty i Analityka</h3>
              <p className="entry-feature-description">
                Szczegółowe raporty finansowe, analizy rentowności 
                i wykresy. Eksportuj dane do Excel i PDF.
              </p>
            </div>

            <div className="entry-feature-card">
              <div className="entry-feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                  <path d="M9 2v2H7C5.9 4 5 4.9 5 6v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2V2H9zm2 2h2v2h-2V4zm-4 6h10v2H7v-2zm0 4h10v2H7v-2z"/>
                </svg>
              </div>
              <h3 className="entry-feature-title">Umowy i Dokumenty</h3>
              <p className="entry-feature-description">
                Generuj umowy najmu, aneksy i dokumenty. 
                Bezpieczne przechowywanie w chmurze z kontrolą wersji.
              </p>
            </div>

            <div className="entry-feature-card">
              <div className="entry-feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                </svg>
              </div>
              <h3 className="entry-feature-title">Kontrola Finansów</h3>
              <p className="entry-feature-description">
                Śledzenie płatności, przypomnień, historii transakcji.
                Automatyczne faktury i rozliczenia.
              </p>
            </div>

            <div className="entry-feature-card">
              <div className="entry-feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <h3 className="entry-feature-title">Komunikacja</h3>
              <p className="entry-feature-description">
                Wbudowany system wiadomości do najemców. 
                Automatyczne powiadomienia e-mail i SMS.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Entry;