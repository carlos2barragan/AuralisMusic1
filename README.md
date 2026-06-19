# Auralis Music 🎵

Plataforma de streaming de música con diseño inmersivo, reproductor persistente y exploración por géneros.

---

## Características

- **Reproductor de música persistente** — continúa reproduciendo al navegar entre páginas, con controles de play/pause, siguiente, anterior y barra de progreso
- **Hero animado 3D** — sección principal con parallax al mover el mouse, notas flotantes y animaciones de entrada escalonadas
- **Explorador de géneros** — sidebar que se abre al acercar el mouse al borde izquierdo de la pantalla, mostrando géneros con conteo de canciones
- **Página por género** — vista dedicada `/genre/:nombre` con todas las canciones filtradas
- **Acceso rápido** — grid con las canciones reproducidas recientemente y las más escuchadas
- **Artistas que escuchas** — sección dinámica basada en el historial de reproducción local
- **Búsqueda global** — barra de búsqueda centrada en el header con resultados en tiempo real
- **Gestión de playlists** — crear, editar y reproducir playlists propias y privadas
- **Autenticación** — registro, login, verificación por email y guards de rutas

---

## Stack tecnológico

### Frontend
| Tecnología | Uso |
|---|---|
| Angular 19 | Framework principal (standalone components) |
| Howler.js | Motor de audio |
| WaveSurfer.js | Visualización de forma de onda |
| SweetAlert2 | Alertas y modales |
| RxJS | Estado reactivo y servicios |

### Backend
| Tecnología | Uso |
|---|---|
| Node.js + Express | API REST |
| MongoDB + Mongoose | Base de datos |
| Cloudinary | Almacenamiento de imágenes y audio |
| JWT + bcrypt | Autenticación y seguridad |
| Nodemailer | Verificación de email |
| Multer | Upload de archivos |

---

## Estructura del proyecto

```
AuralisMusic1/
├── Frontend/
│   └── src/app/
│       ├── components/
│       │   ├── header/           # Barra superior con búsqueda
│       │   ├── sidebar/          # Drawer de géneros (edge-trigger)
│       │   ├── music-player/     # Reproductor persistente
│       │   ├── most-played-songs/
│       │   ├── recent-songs/
│       │   └── random-song-list/
│       ├── pages/
│       │   ├── home/             # Hero 3D + secciones de contenido
│       │   ├── genre/            # Canciones por género
│       │   ├── artist-info/      # Perfil de artista
│       │   ├── playlist/         # Playlists públicas
│       │   ├── private-playlist/ # Playlists privadas
│       │   ├── profile/          # Perfil de usuario
│       │   ├── login/
│       │   ├── register/
│       │   └── subir-cancion/    # Upload de canciones
│       ├── services/
│       │   ├── song.service.ts   # Estado global de reproducción
│       │   └── ui-state.service.ts # Estado del sidebar
│       ├── guards/               # AuthGuard para rutas protegidas
│       └── models/               # Interfaces TypeScript
└── Backend/
    └── src/
        ├── routes/
        ├── models/
        └── controllers/
```

---

## Instalación y uso

### Requisitos
- Node.js 18+
- MongoDB
- Cuenta de Cloudinary

### Backend

```bash
cd Backend
npm install
# Crear archivo .env con las variables necesarias
node app.js
```

Variables de entorno requeridas en `Backend/.env`:
```
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
SESSION_SECRET=
```

### Frontend

```bash
cd Frontend
npm install
ng serve
```

La app estará disponible en `http://localhost:4200`.

---

## Paleta de colores

| Color | Valor | Uso |
|---|---|---|
| Dorado | `#B2A179` | Acento principal, botones, shimmer |
| Fondo oscuro | `#07070f` | Background general |
| Morado | `rgba(120,60,220,…)` | Orbs secundarios, gradientes |

---

## Rutas principales

| Ruta | Descripción |
|---|---|
| `/home` | Página principal con hero y secciones |
| `/genre/:name` | Canciones filtradas por género |
| `/artist/:id` | Perfil y discografía del artista |
| `/playlist` | Playlists públicas del usuario |
| `/profile` | Perfil y configuración |
| `/subir-cancion` | Upload de nuevas canciones |
| `/login` / `/register` | Autenticación |
