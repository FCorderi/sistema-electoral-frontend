import React, { useState, useEffect } from 'react';
import { mesaAPI } from '../services/api';

const MemberSelection = ({ votante, onSelectRole, onLogout }) => {
    const [estadoMesa, setEstadoMesa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        verificarEstadoMesa();
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
            console.log('Estado de mesa verificado:', estadoMesaAdaptado);
        } catch (error) {
            console.error('Error al verificar estado de mesa:', error);
            setError('No se pudo verificar el estado de la mesa');
            // Si hay error, asumir que la mesa está abierta para no bloquear
            setEstadoMesa({ mesaAbierta: true });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="selection-container">
                <div className="selection-card">
                    <h2>🗳️ Verificando estado de mesa...</h2>
                    <div className="loading">Cargando...</div>
                </div>
            </div>
        );
    }
    return (
        <div className="selection-container">
            <div className="selection-card">
                <h2>🗳️ Bienvenido/a {votante.nombre}</h2>
                <p className="user-info">
                    Cédula: {votante.cedula}<br/>
                    Rol: {votante.rol.rol} de Mesa
                </p>
                
                <div className="role-selection">
                    <h3>Seleccione una opción:</h3>
                    
                    <div className="role-options">
                        {/* Mostrar error si hubo problema verificando */}
                        {error && <div className="error" style={{marginBottom: '15px'}}>{error}</div>}
                        
                        {/* Mostrar opción de votar solo si la mesa está abierta */}
                        {estadoMesa && estadoMesa.mesaAbierta ? (
                            <button 
                                onClick={() => onSelectRole('voting')}
                                className="btn btn-primary role-btn"
                            >
                                <div className="role-icon">🗳️</div>
                                <div className="role-text">
                                    <h4>Votar</h4>
                                    <p>Ejercer mi derecho al voto como ciudadano</p>
                                </div>
                            </button>
                        ) : (
                            <div className="role-btn disabled-option">
                                <div className="role-icon">🚫</div>
                                <div className="role-text">
                                    <h4>Votar - No Disponible</h4>
                                    <p>{estadoMesa?.mensaje || 'La mesa no está disponible para votación'}</p>
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={() => onSelectRole('presidente')}
                            className="btn btn-primary role-btn"
                        >
                            <div className="role-icon">👨‍💼</div>
                            <div className="role-text">
                                <h4>Gestión de Mesa</h4>
                                <p>Acceder a las funciones como {votante.rol.rol} de mesa</p>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="logout-section">
                    <button onClick={onLogout} className="btn btn-secondary">
                        Regresar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MemberSelection;
