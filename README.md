# Weather Predictions

Weather Predictions es una aplicación web desarrollada con Vue.js y Vite que permite consultar el pronóstico del tiempo para diferentes ciudades. Ofrece una interfaz moderna y responsiva, mostrando información detallada por días y horas.

## Características
- Consulta de predicción meteorológica por ciudad
- Visualización de datos por días y horas
- Interfaz intuitiva y responsiva
- Componentes reutilizables en Vue
- Temas personalizados y estilos adaptados

## Estructura del Proyecto
```
weather_predictions/
├── app/
│   └── weather-predictions/
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── router/
│       │   └── utils/
│       ├── index.html
│       ├── package.json
│       └── vite.config.js
├── docker-compose.yml
├── Dockerfile
└── entrypoint.sh
```

## Instalación y Ejecución

### Requisitos previos
- Node.js >= 16.x
- npm >= 8.x
- Docker (opcional, para despliegue en contenedores)

### Instalación local
1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd weather_predictions/app/weather-predictions
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación en modo desarrollo:
   ```bash
   npm run dev
   ```
4. Accede a `http://localhost:5173` en tu navegador.

### Uso con Docker
1. Construye y levanta los contenedores:
   ```bash
   docker-compose up --build
   ```
2. La aplicación estará disponible en el puerto configurado (por defecto 5173).

## Scripts disponibles
- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Genera la versión de producción
- `npm run preview`: Previsualiza la build de producción

## Estructura principal de carpetas
- `src/components/`: Componentes Vue reutilizables
- `src/pages/`: Páginas principales de la app
- `src/router/`: Configuración de rutas
- `src/utils/`: Utilidades y helpers
- `public/`: Recursos estáticos

## Personalización
Puedes modificar los estilos en `src/style.css` y `src/theme-overrides.css`.

## Licencia
Este proyecto está bajo la licencia MIT.

## Autor
- [Tu nombre]

## Créditos
- Basado en Vue.js, Vite y otras librerías open source.
