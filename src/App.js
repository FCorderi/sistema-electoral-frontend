import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login'); // 'login', 'voting', 'results'
  const [opciones, setOpciones] = useState([]);
  const [selectedOpcion, setSelectedOpcion] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Limpiar mensajes después de 5 segundos
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Componente de Login
  const LoginComponent = () => {
    const [cedula, setCedula] = useState('');

    const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        const response = await axios.post(`${API_URL}/login`, { cedula });
        setCurrentUser(response.data.votante);

        // Cargar opciones
        const opcionesResponse = await axios.get(`${API_URL}/opciones`);
        setOpciones(opcionesResponse.data.opciones);

        setView('voting');
        setSuccess(`Bienvenido, ${response.data.votante.nombre}!`);
      } catch (err) {
        setError(err.response?.data?.error || 'Error al iniciar sesión');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="container">
        <div className="header">
          <h1>Sistema Electoral</h1>
          <p>Versión 1.0 - Iteración Básica</p>
        </div>

        <div className="card">
          <h2>Acceso al Sistema</h2>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Cédula de Identidad:</label>
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="Ej: 12345678"
                required
                maxLength="8"
              />
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>

          <div className="info-box">
            <h4>Cédulas de prueba disponibles:</h4>
            <p>• <strong>12345678</strong> - Juan Pérez</p>
            <p>• <strong>87654321</strong> - María González</p>
            <p>• <strong>11111111</strong> - Carlos Rodríguez</p>
          </div>
        </div>
      </div>
    );
  };

  // Componente de Votación
  const VotingComponent = () => {
    const [voting, setVoting] = useState(false);

    const handleVote = async () => {
      if (!selectedOpcion) {
        setError('Debe seleccionar una opción para votar');
        return;
      }

      setVoting(true);
      setError('');

      try {
        const response = await axios.post(`${API_URL}/votar`, {
          cedula: currentUser.cedula,
          opcionId: selectedOpcion.id
        });

        setSuccess(response.data.message);
        setCurrentUser({ ...currentUser, yaVoto: true });

        // Ir a resultados después de 2 segundos
        setTimeout(() => setView('results'), 2000);
      } catch (err) {
        setError(err.response?.data?.error || 'Error al registrar el voto');
      } finally {
        setVoting(false);
      }
    };

    if (currentUser?.yaVoto) {
      return (
        <div className="container">
          <div className="header">
            <h1>¡Voto Registrado!</h1>
          </div>
          <div className="card">
            <div className="success">
              Su voto ha sido registrado exitosamente. Gracias por participar.
            </div>
            <button
              className="btn"
              onClick={() => setView('results')}
            >
              Ver Resultados
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="header">
          <h1>Sistema de Votación</h1>
          <p>Seleccione su opción</p>
        </div>

        <div className="card">
          <div className="info-box">
            <p><strong>Votante:</strong> {currentUser.nombre}</p>
            <p><strong>Cédula:</strong> {currentUser.cedula}</p>
          </div>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <h3>Opciones disponibles:</h3>

          {opciones.map(opcion => (
            <div
              key={opcion.id}
              className={`opcion ${selectedOpcion?.id === opcion.id ? 'selected' : ''}`}
              onClick={() => setSelectedOpcion(opcion)}
            >
              <h4>{opcion.nombre}</h4>
              <p>{opcion.descripcion}</p>
            </div>
          ))}

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <button
              className="btn btn-success"
              onClick={handleVote}
              disabled={voting || !selectedOpcion}
              style={{ marginRight: '15px' }}
            >
              {voting ? 'Registrando...' : 'Confirmar Voto'}
            </button>

            <button
              className="btn"
              onClick={() => setView('results')}
            >
              Ver Resultados Actuales
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Componente de Resultados
  const ResultsComponent = () => {
    const [resultados, setResultados] = useState([]);
    const [totalVotos, setTotalVotos] = useState(0);

    const loadResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/resultados`);
        setResultados(response.data.resultados);
        setTotalVotos(response.data.totalVotos);
      } catch (err) {
        setError('Error al cargar resultados');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      loadResults();
    }, []);

    if (loading) {
      return (
        <div className="container">
          <div className="card">
            <div className="loading">Cargando resultados...</div>
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="header">
          <h1>Resultados de Votación</h1>
          <p>Total de votos emitidos: {totalVotos}</p>
        </div>

        <div className="card">
          {error && <div className="error">{error}</div>}

          <h3>Resultados por opción:</h3>

          {resultados.map(resultado => (
            <div key={resultado.id} className="resultado-item">
              <h4>{resultado.nombre}</h4>
              <p>{resultado.descripcion}</p>
              <p><strong>Votos:</strong> {resultado.votos}</p>
              <p><strong>Porcentaje:</strong> {resultado.porcentaje}%</p>
              <div
                style={{
                  width: '100%',
                  height: '20px',
                  background: '#e1e8ed',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  marginTop: '10px'
                }}
              >
                <div
                  style={{
                    width: `${resultado.porcentaje}%`,
                    height: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          ))}

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <button
              className="btn"
              onClick={loadResults}
              style={{ marginRight: '15px' }}
            >
              Actualizar Resultados
            </button>

            <button
              className="btn"
              onClick={() => {
                setCurrentUser(null);
                setView('login');
                setSelectedOpcion(null);
              }}
            >
              Nuevo Usuario
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {view === 'login' && <LoginComponent />}
      {view === 'voting' && <VotingComponent />}
      {view === 'results' && <ResultsComponent />}
    </div>
  );
}

export default App;