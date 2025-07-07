import React, { useState } from 'react';
import Login from './components/Login';
import VotingInterface from './components/VotingInterface';
import PresidenteMesa from './components/PresidenteMesa';
import Results from './components/Results';
import MemberSelection from './components/MemberSelection';
import './index.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');

  const handleLogin = (votante) => {
    setCurrentUser(votante);

    // Determinar vista según el rol
    if (votante.rol.tipo === 'miembro_mesa') {
      setCurrentView('member-selection');
    } else {
      setCurrentView('voting');
    }
  };

  const handleRoleSelection = (selectedRole) => {
    setCurrentView(selectedRole);
  };

  const handleBackToSelection = () => {
    if (currentUser && currentUser.rol.tipo === 'miembro_mesa') {
      setCurrentView('member-selection');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <div>
            <Login onLogin={handleLogin} />
            <div className="public-access">
              <button
                onClick={() => setCurrentView('results')}
                className="btn btn-link"
              >
                Ver Resultados Públicos
              </button>
            </div>
          </div>
        );
      case 'member-selection':
        return <MemberSelection 
          votante={currentUser} 
          onSelectRole={handleRoleSelection}
          onLogout={handleLogout} 
        />;
      case 'voting':
        return <VotingInterface 
          votante={currentUser} 
          onLogout={handleLogout}
          onBackToSelection={handleBackToSelection}
        />;
      case 'presidente':
        return <PresidenteMesa 
          votante={currentUser} 
          onLogout={handleLogout}
          onBackToSelection={handleBackToSelection}
        />;
      case 'results':
        return <Results onBack={() => setCurrentView('login')} />;
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
    </div>
  );
}

export default App;