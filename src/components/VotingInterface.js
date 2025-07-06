import React, { useState, useEffect } from 'react';
import { eleccionAPI, votanteAPI } from '../services/api';

const VotingInterface = ({ votante, onLogout }) => {
    const [eleccion, setEleccion] = useState(null);
    const [papeletas, setPapeletas] = useState([]);
    const [selectedPapeleta, setSelectedPapeleta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadEleccionData();
    }, []);

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

        setVoting(true);
        setError('');

        try {
            const response = await votanteAPI.votar(
                votante.cedula,
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
                <button onClick={onLogout} className="btn btn-secondary">Salir</button>
            </div>

            <div className="papeletas-container">
                <h3>Seleccione su opción:</h3>
                {papeletas.map((papeleta) => (
                    <div
                        key={papeleta.Id_papeleta}
                        className={`papeleta ${selectedPapeleta?.Id_papeleta === papeleta.Id_papeleta ? 'selected' : ''}`}
                        onClick={() => setSelectedPapeleta(papeleta)}
                    >
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