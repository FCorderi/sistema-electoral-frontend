import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

// Servicios para votantes
export const votanteAPI = {
    login: (credencial) => api.post('/votantes/login', { credencial }),
    votar: (credencial, idPapeleta, idCircuito) =>
        api.post('/votantes/votar', { credencial, idPapeleta, idCircuito }),
};

// Servicios para elecciones
export const eleccionAPI = {
    obtenerActiva: () => api.get('/elecciones/activa'),
    obtenerPapeletas: (idEleccion) => api.get(`/elecciones/${idEleccion}/papeletas`),
    obtenerResultados: (idCircuito, cedulaSolicitante) =>
        api.get(`/elecciones/resultados/${idCircuito}?cedulaSolicitante=${cedulaSolicitante}`),
    obtenerResultadosDepartamento: (idDepartamento) =>
        api.get(`/elecciones/resultados/departamento/${idDepartamento}`),
    obtenerResultadosNacionales: () => api.get('/elecciones/resultados/nacionales'),
};

// Servicios para mesas
export const mesaAPI = {
    obtenerEstado: (idCircuito) => api.get(`/mesas/${idCircuito}/estado`),
    cerrarMesa: (idCircuito, cedulaPresidente) =>
        api.post(`/mesas/${idCircuito}/cerrar`, { cedulaPresidente }),
    obtenerAbiertas: () => api.get('/mesas/abiertas'),
};

export default api;