import React from 'react';

const MemberSelection = ({ votante, onSelectRole, onLogout }) => {
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
                    <button onClick={onLogout} className="btn btn-link">
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MemberSelection;
