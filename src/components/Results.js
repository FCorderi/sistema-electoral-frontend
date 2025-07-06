import React, { useState, useEffect } from 'react';
import { eleccionAPI } from '../services/api';

const Results = ({ onBack }) => {
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [totalVotos, setTotalVotos] = useState(0);

    useEffect(() => {
        loadResultados();
    }, []);

    const loadResultados = async () => {
        try {
            const response = await eleccionAPI.obtenerResultadosNacionales();
            setResultados(response.data.resultados);
            setTotalVotos(response.data.totalVotos);
        } catch (error) {
            setError('Error al cargar resultados');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Cargando resultados...</div>;
    }

    return (
        <div className="results-container">
            <div className="results-header">
                <h2>📊 Resultados Nacionales</h2>
                <button onClick={onBack} className="btn btn-secondary">Volver</button>
            </div>

            {error && <div className="error">{error}</div>}

            <div className="results-summary">
                <h3>Total de Votos: {totalVotos}</h3>
            </div>

            <div className="results-list">
                {resultados.map((resultado, index) => (
                    <div key={index} className="result-item">
                        <div className={`color-bar ${resultado.Color.toLowerCase()}`}
                            style={{ width: `${resultado.Porcentaje}%` }}></div>
                        <div className="result-info">
                            <h4>{resultado.Color}</h4>
                            <p>{resultado.Tipo}</p>
                            <div className="result-stats">
                                <span className="votes">{resultado.CantidadVotos} votos</span>
                                <span className="percentage">{resultado.Porcentaje}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Results;