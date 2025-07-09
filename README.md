# Sistema Electoral - Frontend

## Descripción

Frontend del Sistema Electoral desarrollado en React. Proporciona una interfaz de usuario intuitiva para que los votantes puedan ejercer su derecho al voto y los miembros de mesa puedan gestionar el proceso electoral. Incluye diferentes vistas según el tipo de usuario y funcionalidades para consultar resultados públicos.

## Tecnologías Utilizadas

- **React** 19.1.0 - Biblioteca de JavaScript para interfaces de usuario
- **React Router DOM** - Navegación y enrutamiento
- **Axios** - Cliente HTTP para comunicación con la API
- **CSS3** - Estilos y diseño responsivo
- **React Scripts** - Herramientas de desarrollo y build

## Estructura del Proyecto

```
sistema-electoral-frontend/
├── public/
│   ├── favicon.ico           # Icono de la aplicación
│   └── index.html           # Plantilla HTML principal
├── src/
│   ├── components/          # Componentes React
│   │   ├── Login.js         # Componente de inicio de sesión
│   │   ├── VotingInterface.js # Interfaz de votación
│   │   ├── PresidenteMesa.js # Panel de presidente de mesa
│   │   ├── Results.js       # Visualización de resultados
│   │   └── MemberSelection.js # Selección de rol para miembros
│   ├── services/
│   │   └── api.js           # Configuración y servicios de API
│   ├── styles/              # Archivos de estilos adicionales
│   ├── utils/               # Utilidades y helpers
│   ├── App.js               # Componente principal
│   ├── index.js             # Punto de entrada
│   └── index.css            # Estilos globales
├── build/                   # Archivos de producción (generados)
└── package.json
```

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- Sistema Electoral Backend ejecutándose

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd sistema-electoral-frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno (opcional)**
   
   Crear un archivo `.env` en la raíz del proyecto si necesitas configurar la URL del backend:
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   ```

## Ejecución

### Modo Desarrollo
```bash
npm start
```
Abre [http://localhost:3000](http://localhost:3000) en el navegador. La página se recargará automáticamente cuando realices cambios.

### Construcción para Producción
```bash
npm run build
```
Genera una versión optimizada para producción en la carpeta `build/`.

### Ejecutar Pruebas
```bash
npm test
```
Ejecuta las pruebas en modo interactivo.

## Funcionalidades

### Para Votantes
- **Inicio de Sesión**: Autenticación con credencial
- **Interfaz de Votación**: Visualización de candidatos y opciones de voto
- **Confirmación de Voto**: Verificación antes del envío
- **Comprobante**: Confirmación del voto registrado

### Para Miembros de Mesa
- **Selección de Rol**: Elección entre Presidente o Vocal de Mesa
- **Panel de Presidente**: 
  - Apertura y cierre de mesa
  - Monitoreo de votantes
  - Gestión del proceso electoral
- **Panel de Vocal**: Asistencia en el proceso de votación

### Acceso Público
- **Resultados en Tiempo Real**: Consulta de resultados sin autenticación
- **Estadísticas**: Porcentajes de participación y resultados por candidato

## Componentes Principales

### Login.js
Maneja la autenticación de usuarios mediante credencial.

### VotingInterface.js
Interfaz principal de votación que muestra:
- Candidatos disponibles
- Opciones de voto (incluye voto en blanco)
- Confirmación de selección

### PresidenteMesa.js
Panel de control para presidentes de mesa con funcionalidades:
- Apertura/cierre de mesa
- Lista de votantes habilitados
- Control del proceso electoral

### Results.js
Visualización de resultados electorales:
- Resultados en tiempo real
- Gráficos y estadísticas
- Filtros por tipo de elección

### MemberSelection.js
Permite a los miembros de mesa seleccionar a que sección quieren acceder (para votar o gestionar mesa).

## Integración con Backend

La aplicación se comunica con el backend a través de la configuración en `src/services/api.js`:

```javascript
// Ejemplo de configuración
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
```

### Endpoints Utilizados
- `POST /votantes/login` - Autenticación
- `GET /elecciones/{id}/candidatos` - Obtener candidatos
- `POST /votantes/voto` - Registrar voto
- `GET /elecciones/{id}/resultados` - Obtener resultados
- `GET /mesas/{id}/votantes` - Lista de votantes por mesa

## Flujo de Usuario

### Votante Regular
1. Acceso a la aplicación
2. Inicio de sesión con credencial
3. Visualización de papeleta electoral
4. Selección de candidato o voto en blanco
5. Confirmación del voto
6. Comprobante de votación

### Miembro de Mesa
1. Inicio de sesión con credenciales especiales
2. Selección de sección (votar/gestionar mesa)
3. Acceso al panel de gestión correspondiente
4. Gestión del proceso electoral

### Usuario Público
1. Acceso directo a resultados
2. Consulta sin autenticación
3. Visualización de estadísticas

## Estilos y Diseño

- **Diseño Responsivo**: Compatible con dispositivos móviles y escritorio
- **UX Intuitiva**: Navegación simple y clara

## Configuración de Desarrollo

### Variables de Entorno Disponibles
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development
```

### Scripts Disponibles
- `npm start` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm test` - Ejecutar pruebas
- `npm run eject` - Exponer configuración (irreversible)

## Despliegue

### Build de Producción
```bash
npm run build
```

### Servidor Estático
Los archivos del directorio `build/` pueden ser servidos por cualquier servidor web estático:
- Apache
- Nginx
- Vercel
- Netlify

### Ejemplo con servidor HTTP simple
```bash
npm install -g serve
serve -s build -l 3000
```

## Consideraciones de Seguridad

- **Autenticación JWT**: Tokens seguros para sesiones
- **Validación Client-Side**: Verificación de datos antes del envío
- **Sanitización**: Limpieza de inputs del usuario
- **HTTPS**: Recomendado para producción