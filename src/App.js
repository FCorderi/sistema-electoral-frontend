import React, { useState } from 'react';
import Login from './components/Login';
import VotingInterface from './components/VotingInterface';
import PresidenteMesa from './components/PresidenteMesa';
import Results from './components/Results';
import MemberSelection from './components/MemberSelection';
import { votanteAPI } from './services/api';
import './index.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');

  const handleLogin = (votante) => {
    console.log('HandleLogin - Votante recibido:', votante);
    console.log('HandleLogin - Rol del votante:', votante.rol?.tipo);
    
    setCurrentUser(votante);

    // Determinar vista según el rol
    if (votante.rol && votante.rol.tipo === 'miembro_mesa') {
      console.log('Dirigiendo a member-selection');
      setCurrentView('member-selection');
    } else {
      // Para votantes regulares, verificar estado de mesa antes de permitir votación
      console.log('Votante regular - verificando estado de mesa...');
      verificarEstadoMesaYRedirigir(votante);
    }
  };

  const verificarEstadoMesaYRedirigir = async (votante) => {
    try {
      const response = await votanteAPI.verificarEstadoMesa(votante.credencial);
      const estadoMesa = response.data;
      
      if (estadoMesa.mesaAbierta) {
        console.log('Mesa abierta - dirigiendo a voting');
        setCurrentView('voting');
      } else {
        console.log('Mesa cerrada - dirigiendo a mesa-cerrada');
        // Agregar la información del estado de mesa al usuario
        setCurrentUser({...votante, estadoMesa});
        setCurrentView('mesa-cerrada');
      }
    } catch (error) {
      console.error('Error verificando estado de mesa:', error);
      // Si hay error, permitir votación (comportamiento por defecto)
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
      case 'mesa-cerrada':
        return (
          <div className="mesa-cerrada-container">
            <div className="mesa-cerrada-card">
              <h2>🚫 Mesa Cerrada</h2>
              <p className="user-info">
                Votante: {currentUser.nombre}<br/>
                Cédula: {currentUser.cedula}
              </p>
              <div className="mesa-cerrada-message">
                <p>{currentUser.estadoMesa?.mensaje || 'La mesa electoral no está disponible para votación en este momento.'}</p>
                <p>Por favor, consulte con los responsables de mesa para más información.</p>
              </div>
              <div className="mesa-cerrada-actions">
                <button onClick={handleLogout} className="btn btn-primary">
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        );
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