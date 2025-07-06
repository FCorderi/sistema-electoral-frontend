import React, { useState, useEffect } from 'react';
import { mesaAPI, eleccionAPI } from '../services/api';

const PresidenteMesa = ({ votante, onLogout }) => {
    const [estadoMesa, setEstadoMesa] = useState(null);
    const [resultados, setResultados] = useState([]);
    const [mesasAbiertas, setMesasAbiertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Cargar estado de la mesa del presidente
            const estadoResponse = await mesaAPI.obtenerEstado(votante.rol.circuito);
            setEstadoMesa(estadoResponse.data.estado);

            // Cargar resultados si la mesa está cerrada o es presidente
            if (!estadoResponse.data.estado.Esta_abierta || votante.rol.rol === 'Presidente') {
                const resultadosResponse = await eleccionAPI.obtenerResultados(
                    votante.rol.circuito,
                    votante.cedula
                );
                setResultados(resultadosResponse.data.resultados);
            }

            // Cargar todas las mesas abiertas
            const mesasResponse = await mesaAPI.obtenerAbiertas();
            setMesasAbiertas(mesasResponse.data.mesas);
        } catch (error) {
            setError('Error al cargar datos de mesa');
        } finally {
            setLoading(false);
        }
    };

    const handleCerrarMesa = async () => {
        if (!window.confirm('¿Está seguro de que desea cerrar la mesa?')) {
            return;
        }

        try {
            await mesaAPI.cerrarMesa(votante.rol.circuito, votante.cedula);
            setMessage('Mesa cerrada exitosamente');
            loadData(); // Recargar datos
        } catch (error) {
            setError(error.response?.data?.error || 'Error al cerrar mesa');
        }
    };

    if (loading) {
        return <div className="loading">Cargando panel de mesa...</div>;
    }

    return (
        <div className="presidente-container">
            <div className="presidente-header">
                <h2>🏛️ Panel de Presidente de Mesa</h2>
                <div className="presidente-info">
                    <p><strong>Presidente:</strong> {votante.nombre}</p>
                    <p><strong>Cédula:</strong> {votante.cedula}</p>
                    <p><strong>Circuito:</strong> {votante.rol.circuito}</p>
                    <p><strong>Rol:</strong> {votante.rol.rol}</p>
                </div>
                <button onClick={onLogout} className="btn btn-secondary">Salir</button>
            </div>

            {message && <div className="success">{message}</div>}
            {error && <div className="error">{error}</div>}

            <div className="mesa-info">
                <h3>Estado de Mesa - Circuito {votante.rol.circuito}</h3>
                {estadoMesa && (
                    <div className="estado-card">
                        <p><strong>Estado:</strong> {estadoMesa.Esta_abierta ? '🟢 Abierta' : '🔴 Cerrada'}</p>
                        <p><strong>Ubicación:</strong> {estadoMesa.Ciudad}, {estadoMesa.Barrio}</p>
                        <p><strong>Departamento:</strong> {estadoMesa.Departamento}</p>
                        {estadoMesa.Fecha_apertura && (
                            <p><strong>Apertura:</strong> {new Date(estadoMesa.Fecha_apertura).toLocaleString()}</p>
                        )}
                        {estadoMesa.Fecha_cierre && (
                            <p><strong>Cierre:</strong> {new Date(estadoMesa.Fecha_cierre).toLocaleString()}</p>
                        )}
                    </div>
                )}

                {estadoMesa?.Esta_abierta && votante.rol.rol === 'Presidente' && (
                    <button onClick={handleCerrarMesa} className="btn btn-danger">
                        Cerrar Mesa
                    </button>
                )}
            </div>

            {resultados.length > 0 && (
                <div className="resultados-mesa">
                    <h3>Resultados del Circuito {votante.rol.circuito}</h3>
                    <div className="resultados-list">
                        {resultados.map((resultado, index) => (
                            <div key={index} className="resultado-item">
                                <div className={`color-indicator ${resultado.Color.toLowerCase()}`}></div>
                                <div className="resultado-info">
                                    <h4>{resultado.Color}</h4>
                                    <p>{resultado.Tipo}</p>
                                    <p><strong>{resultado.CantidadVotos} votos ({resultado.Porcentaje}%)</strong></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mesas-generales">
                <h3>Estado General de Mesas</h3>
                <div className="mesas-grid">
                    {mesasAbiertas.map((mesa) => (
                        <div key={mesa.Id_circuito} className="mesa-card">
                            <h4>Circuito {mesa.Id_circuito}</h4>
                            <p>{mesa.Ciudad}, {mesa.Barrio}</p>
                            <p>{mesa.Departamento}</p>
                            <p><strong>Votos:</strong> {mesa.VotosEmitidos}</p>
                            <p className="estado-abierta">🟢 Abierta</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PresidenteMesa;