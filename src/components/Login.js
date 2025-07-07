import React, { useState } from 'react';
import { votanteAPI } from '../services/api';

const Login = ({ onLogin }) => {
    const [credencial, setCredencial] = useState('');
    const [cedula, setCedula] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!credencial.trim()) {
            setError('La credencial es requerida');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await votanteAPI.login(credencial);
            const { votante } = response.data;
            onLogin(votante);
        } catch (error) {
            setError(error.response?.data?.error || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>🗳️ Sistema Electoral</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="credencial">Credencial Cívica</label>
                        <input
                            type="text"
                            id="credencial"
                            value={credencial}
                            onChange={(e) => setCredencial(e.target.value)}
                            placeholder="Ingrese su credencial"
                            disabled={loading}
                        />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Verificando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;