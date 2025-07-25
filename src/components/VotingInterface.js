import React, { useState, useEffect } from 'react';
import { eleccionAPI, votanteAPI, mesaAPI } from '../services/api';

const VotingInterface = ({ votante, onLogout, onBackToSelection }) => {
    const [eleccion, setEleccion] = useState(null);
    const [papeletas, setPapeletas] = useState([]);
    const [selectedPapeleta, setSelectedPapeleta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [estadoMesa, setEstadoMesa] = useState(null);

    useEffect(() => {
        loadEleccionData();
        if (votante.rol.tipo === 'miembro_mesa') {
            verificarEstadoMesa();
        }
    }, []);

    const verificarEstadoMesa = async () => {
        try {
            // Usar la API de mesas existente con el circuito del miembro de mesa
            const response = await mesaAPI.obtenerEstado(votante.rol.circuito);
            const estadoMesaData = response.data.estado;
            
            // Adaptar el formato para mantener compatibilidad
            const estadoMesaAdaptado = {
                mesaAbierta: estadoMesaData.Esta_abierta,
                mensaje: estadoMesaData.Esta_abierta 
                    ? 'La mesa está abierta para votación' 
                    : 'La mesa está cerrada'
            };
            
            setEstadoMesa(estadoMesaAdaptado);
        } catch (error) {
            console.error('Error verificando estado de mesa:', error);
        }
    };

    const loadEleccionData = async () => {
        try {
            const eleccionResponse = await eleccionAPI.obtenerActiva();
            const eleccionActiva = eleccionResponse.data.eleccion;
            setEleccion(eleccionActiva);

            const papeletasResponse = await eleccionAPI.obtenerPapeletas(eleccionActiva.Id_eleccion);
            setPapeletas(papeletasResponse.data.papeletas);
        } catch (error) {
            setError('Error al cargar datos de elección');
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async () => {
        if (!selectedPapeleta) {
            setError('Debe seleccionar una papeleta');
            return;
        }

        // Verificar estado de la mesa antes de votar (solo para votantes regulares)
        if (votante.rol.tipo === 'votante') {
            try {
                const response = await mesaAPI.obtenerEstado(votante.circuito);
                const estadoMesaData = response.data.estado;
                if (!estadoMesaData.Esta_abierta) {
                    setError('No se puede votar: la mesa electoral está cerrada');
                    return;
                }
            } catch (error) {
                setError('Error al verificar el estado de la mesa');
                return;
            }
        }

        setVoting(true);
        setError('');

        try {
            const response = await votanteAPI.votar(
                votante.credencial,
                selectedPapeleta.Id_papeleta,
                votante.circuito
            );

            setMessage(response.data.message);
            setTimeout(() => {
                onLogout();
            }, 3000);
        } catch (error) {
            setError(error.response?.data?.error || 'Error al registrar voto');
        } finally {
            setVoting(false);
        }
    };

    if (loading) {
        return <div className="loading">Cargando opciones de votación...</div>;
    }

    if (message) {
        return (
            <div className="success-container">
                <h2>✅ Voto Registrado</h2>
                <p>{message}</p>
                <p>Redirigiendo...</p>
            </div>
        );
    }

    return (
        <div className="voting-container">
            <div className="voting-header">
                <h2>🗳️ Elección Municipal</h2>
                <div className="voter-info">
                    <p><strong>Votante:</strong> {votante.nombre}</p>
                    <p><strong>Cédula:</strong> {votante.cedula}</p>
                    <p><strong>Circuito:</strong> {votante.circuito}</p>
                </div>
                <div className="header-actions">
                    {votante.rol.tipo === 'miembro_mesa' && onBackToSelection && (
                        <button onClick={onBackToSelection} className="btn btn-link">
                            ← Volver a selección
                        </button>
                    )}
                    <button onClick={onLogout} className="btn btn-secondary">Salir</button>
                </div>
            </div>

            {/* Mostrar advertencia si la mesa está cerrada para miembros de mesa */}
            {votante.rol.tipo === 'miembro_mesa' && estadoMesa && !estadoMesa.mesaAbierta && (
                <div className="warning-message">
                    <p><strong>⚠️ Advertencia:</strong> {estadoMesa.mensaje}</p>
                    <p>Como miembro de mesa, puede acceder a esta vista, pero la votación puede no estar disponible.</p>
                </div>
            )}

            <div className="papeletas-container">
                <h3>Seleccione su opción:</h3>
                {papeletas.map((papeleta) => (
                    <div
                        key={papeleta.Id_papeleta}
                        className={`papeleta ${selectedPapeleta?.Id_papeleta === papeleta.Id_papeleta ? 'selected' : ''}`}
                        onClick={() => setSelectedPapeleta(papeleta)}
                    >
                        <h4 className='numero-lista' >{papeleta.NumeroLista}</h4>
                        <div className={`papeleta-color ${papeleta.Color.toLowerCase()}`}></div>

                        <div className="papeleta-info">
                            <h4>{papeleta.Color}</h4>
                            <p>{papeleta.Descripcion}</p>
                            {papeleta.NombreCandidato && <p><strong>{papeleta.NombreCandidato}</strong></p>}
                        </div>
                    </div>
                ))}
            </div>

            {error && <div className="error">{error}</div>}

            <div className="voting-actions">
                <button
                    onClick={handleVote}
                    disabled={!selectedPapeleta || voting}
                    className="btn btn-primary btn-large"
                >
                    {voting ? 'Registrando voto...' : 'Confirmar Voto'}
                </button>
            </div>
        </div>
    );
};

export default VotingInterface;