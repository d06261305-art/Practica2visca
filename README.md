# Practica 2A - Integracion full-stack NoSQL guiada

Esta carpeta sigue la practica del segundo PDF con dos proyectos separados:

- `inventario-backend`: servidor Node.js/Express con MongoDB Atlas.
- `inventario-frontend`: interfaz HTML, CSS y JavaScript para consumir el backend.

Se conserva la idea del PDF y se completa con actualizar y eliminar para tener CRUD completo.

## Backend

```bash
cd inventario-backend
npm install
copy .env.example .env
npm start
```

## Frontend

Abre `inventario-frontend/index.html` en el navegador o despliegalo en Vercel.

Antes de desplegar, edita `inventario-frontend/app.js` y cambia `API_URL` por la URL publica de Render terminando en `/productos`.
