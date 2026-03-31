import React, { useState } from 'react';
import UploadResume from './components/UploadResume';
import ViewResumes from './components/ViewResumes';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('view');
  };

  return (
    <div className="app">
      {/* Animated background */}
      <div className="bg-grid" />
      <div className="bg-glow" />

      <div className="app-wrapper">
        {/* Header */}
        <header className="header">
          <div className="header-brand">
            <div className="brand-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="2" width="10" height="13" rx="2" fill="#38bdf8" opacity="0.9"/>
                <rect x="16" y="2" width="10" height="6" rx="2" fill="#818cf8" opacity="0.9"/>
                <rect x="16" y="11" width="10" height="4" rx="2" fill="#38bdf8" opacity="0.6"/>
                <rect x="2" y="18" width="24" height="3" rx="1.5" fill="#818cf8" opacity="0.5"/>
                <rect x="2" y="23" width="16" height="3" rx="1.5" fill="#38bdf8" opacity="0.3"/>
              </svg>
            </div>
            <div>
              <h1 className="brand-title">ResumeAI</h1>
              <p className="brand-sub">Analyzer</p>
            </div>
          </div>

          <nav className="nav">
            <button
              className={`nav-btn ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              <span className="nav-icon">⊕</span>
              Upload
            </button>
            <button
              className={`nav-btn ${activeTab === 'view' ? 'active' : ''}`}
              onClick={() => setActiveTab('view')}
            >
              <span className="nav-icon">≡</span>
              All Resumes
            </button>
          </nav>
        </header>

        {/* Main content */}
        <main className="main">
          <div className={`tab-panel ${activeTab === 'upload' ? 'visible' : ''}`}>
            {activeTab === 'upload' && (
              <UploadResume onSuccess={handleUploadSuccess} />
            )}
          </div>
          <div className={`tab-panel ${activeTab === 'view' ? 'visible' : ''}`}>
            {activeTab === 'view' && (
              <ViewResumes refreshTrigger={refreshTrigger} />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <span>AI Resume Analyzer &nbsp;·&nbsp; Spring Boot + React</span>
          <span className="footer-dot">●</span>
          <span>Backend on :8080 &nbsp;·&nbsp; Frontend on :3000</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
