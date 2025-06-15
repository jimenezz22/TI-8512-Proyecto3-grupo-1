# StarWars API - Backend Project

<div align="center">

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

**Una API robusta de StarWars construida con NestJS y TypeORM**

Proyecto académico para el curso TI-8512 - Diseño de Aplicaciones Web

</div>

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Verificación](#-verificación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías](#-tecnologías)
- [Scripts Disponibles](#-scripts-disponibles)
- [Solución de Problemas](#-solución-de-problemas)
- [Próximos Pasos](#-próximos-pasos)

## ✨ Características

- 🏗️ **Arquitectura modular** con NestJS
- 🗄️ **Base de datos PostgreSQL** con TypeORM
- 🐳 **Dockerizado** para desarrollo local
- 🔄 **Migraciones** para control de versiones de BD
- 🌱 **Seeds** con datos de StarWars precargados
- 🔗 **Relaciones Many-to-Many** entre Characters y Movies
- ✅ **Validaciones** con class-validator
- 📊 **pgAdmin** incluido para gestión de BD

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (viene con Node.js)
- **Docker Desktop** ([Descargar aquí](https://www.docker.com/products/docker-desktop/))
- **Git** (para control de versiones)

### Verificar instalaciones:
```bash
node --version    # v18.0.0 o superior
npm --version     # 9.0.0 o superior  
docker --version  # 20.0.0 o superior
git --version     # 2.0.0 o superior
```

## 📦 Instalación

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# El archivo .env ya viene configurado correctamente:
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_USERNAME=starwars_user
# DATABASE_PASSWORD=starwars_password
# DATABASE_NAME=starwars_db
# PORT=3000
# NODE_ENV=development
# TYPEORM_SYNCHRONIZE=true
# TYPEORM_LOGGING=true
```

## 🚀 Configuración

### 1. Levantar la base de datos con Docker
```bash
# Iniciar contenedores de PostgreSQL y pgAdmin
npm run docker:up

# Verificar que los contenedores estén corriendo
docker ps
```

**Deberías ver:**
```
CONTAINER ID   IMAGE                   PORTS                           NAMES
xxxxxxxxx      postgres:15-alpine      0.0.0.0:5432->5432/tcp          starwars-postgres
xxxxxxxxx      dpage/pgadmin4:latest   0.0.0.0:8080->80/tcp            starwars-pgadmin
```

### 2. Ejecutar migraciones
```bash
# Crear las tablas en la base de datos
npm run migration:run
```

**Salida esperada:**
```
Migration InitialSchema1718000000001 has been executed successfully.
```

### 3. Cargar datos de ejemplo
```bash
# Insertar personajes y películas de StarWars
npm run seed
```

**Salida esperada:**
```
🌱 Starting seed process...
✅ Seeded 6 movies and 6 characters
✅ Seed completed successfully!
```

## ▶️ Ejecución

### Ejecutar la aplicación
```bash
# Modo desarrollo (con hot reload)
npm run start:dev
```

**Salida esperada:**
```
[Nest] Starting Nest application...
[Nest] Nest application successfully started
🚀 StarWars API running on: http://localhost:3000/api/v1
📊 Environment: development
```

## ✅ Verificación

### 1. Verificar que la API esté funcionando
```bash
# En otra terminal, probar la API
curl http://localhost:3000/api/v1

# Respuesta esperada:
StarWars API is running! 🚀
```

### 2. Acceder a pgAdmin
1. **Abrir navegador:** http://localhost:8080
2. **Credenciales:**
   - Email: `admin@starwars.com`
   - Password: `admin123`

### 3. Conectar pgAdmin a PostgreSQL
1. **Click derecho en "Servers"** → "Register" → "Server"
2. **General tab:**
   - Name: `StarWars DB`
3. **Connection tab:**
   - Host: `starwars-postgres`
   - Port: `5432`
   - Database: `starwars_db`
   - Username: `starwars_user`
   - Password: `starwars_password`

### 4. Verificar datos en la base de datos
```sql
-- Ver todas las películas
SELECT * FROM movies ORDER BY episode_id;

-- Ver todos los personajes
SELECT * FROM characters ORDER BY name;

-- Ver relaciones (qué personajes aparecen en cada película)
SELECT 
  c.name as character_name,
  m.title as movie_title,
  m.episode_id
FROM character_movies cm
JOIN characters c ON c.id = cm.character_id
JOIN movies m ON m.id = cm.movie_id
ORDER BY m.episode_id, c.name;
```

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── characters/
│   │   ├── entities/
│   │   │   └── character.entity.ts     
│   │   └── dto/
│   │       ├── create-character.dto.ts
│   │       ├── update-character.dto.ts
│   │       └── character-response.dto.ts
│   ├── movies/
│   │   ├── entities/
│   │   │   └── movie.entity.ts         
│   │   └── dto/
│   │       ├── create-movie.dto.ts
│   │       ├── update-movie.dto.ts
│   │       └── movie-response.dto.ts
│   ├── database/
│   │   ├── migrations/
│   │   │   └── 1718000000001-InitialSchema.ts
│   │   ├── seeds/
│   │   │   └── starwars-data.seed.ts
│   │   └── seed.ts
│   ├── shared/
│   │   └── entities/
│   │       └── base.entity.ts          # Entidad base con timestamps
│   ├── config/
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   └── database-cli.config.ts
│   ├── app.module.ts
│   └── main.ts
├── docker/
│   └── postgres/
│       └── init.sql
├── docker-compose.yml
├── .env
├── .env.example
├── .eslintrc.js
├── .prettierrc
└── package.json
```

## 🛠️ Tecnologías

### Backend
- **NestJS** - Framework de Node.js
- **TypeScript** - Lenguaje de programación
- **TypeORM** - ORM para base de datos
- **PostgreSQL** - Base de datos relacional
- **class-validator** - Validaciones de DTOs
- **class-transformer** - Transformación de datos

### DevOps
- **Docker** - Contenedorización
- **Docker Compose** - Orquestación de contenedores
- **ESLint** - Linting de código
- **Prettier** - Formateo de código

### Herramientas
- **pgAdmin** - Administración de PostgreSQL
- **ts-node** - Ejecución de TypeScript

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev         # Ejecutar en modo desarrollo
npm run start:prod        # Ejecutar en modo producción
npm run build             # Compilar proyecto

# Base de datos
npm run migration:run     # Ejecutar migraciones
npm run migration:revert  # Revertir última migración
npm run seed              # Cargar datos de ejemplo

# Docker
npm run docker:up         # Levantar contenedores
npm run docker:down       # Bajar contenedores
npm run docker:logs       # Ver logs de contenedores

# Calidad de código
npm run lint              # Ejecutar linting
npm run format            # Formatear código
npm run test              # Ejecutar tests
```

## 🗄️ Modelo de Base de Datos

### Entidades

#### Characters
- `id` (PK, auto-increment)
- `name` (varchar, unique)
- `height` (varchar, nullable)
- `mass` (varchar, nullable)
- `createdAt`, `updatedAt`, `deletedAt`

#### Movies
- `id` (PK, auto-increment)
- `title` (varchar, unique)
- `episode_id` (integer, unique, nullable)
- `director` (varchar, nullable)
- `createdAt`, `updatedAt`, `deletedAt`

#### Relación Many-to-Many
- Tabla: `character_movies`
- Campos: `character_id`, `movie_id`
- Un personaje puede aparecer en múltiples películas
- Una película puede tener múltiples personajes

### Datos Precargados

**Películas:**
- A New Hope (Episode 4)
- The Empire Strikes Back (Episode 5)
- Return of the Jedi (Episode 6)
- The Phantom Menace (Episode 1)
- Attack of the Clones (Episode 2)
- Revenge of the Sith (Episode 3)

**Personajes:**
- Luke Skywalker
- Darth Vader
- Leia Organa
- Obi-Wan Kenobi
- Anakin Skywalker
- Yoda

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto es para fines educativos - TI-8512 Diseño de Aplicaciones Web.

## 👥 Equipo

**Grupo 1 - StarWars API**
- Proyecto académico
- Universidad: Tecnológico de Costa Rica
- Curso: TI-8512 - Diseño de Aplicaciones Web
- Estudiantes: Luis Jiménez y Valentina Méndez

---

**Estado del Proyecto:** ✅ Fase 1 y 2 Completadas

## 🚀 Próximos Pasos

### Fase 3: Implementación de Módulos CRUD
- [ ] Módulo Characters con endpoints completos
- [ ] Módulo Movies con endpoints completos
- [ ] Controllers, Services, y Repositories
- [ ] Manejo global de errores
- [ ] Tests unitarios

### Endpoints a implementar en Fase 3:
```
Characters:
GET    /api/v1/characters           # Listar todos
GET    /api/v1/characters/:id       # Obtener uno
POST   /api/v1/characters           # Crear
PUT    /api/v1/characters/:id       # Actualizar
DELETE /api/v1/characters/:id       # Eliminar
GET    /api/v1/characters/:id/movies # Películas del personaje

Movies:
GET    /api/v1/movies               # Listar todas
GET    /api/v1/movies/:id           # Obtener una
POST   /api/v1/movies               # Crear
PUT    /api/v1/movies/:id           # Actualizar
DELETE /api/v1/movies/:id           # Eliminar
GET    /api/v1/movies/:id/characters # Personajes de la película
```