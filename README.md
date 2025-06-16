# StarWars API - Backend Project

<div align="center">

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

**Una API robusta de StarWars construida con NestJS y TypeORM**

Proyecto académico para el curso TI-8512 - Diseño de Aplicaciones Web
**Grupo 1 - StarWars API**

</div>

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Demo Rápido](#-demo-rápido)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Ejemplos de Uso](#-ejemplos-de-uso)
- [Manejo de Errores](#-manejo-de-errores)
- [Documentación Swagger](#-documentación-swagger)
- [Modelo de Datos](#-modelo-de-datos)
- [Tecnologías](#-tecnologías)
- [Scripts Disponibles](#-scripts-disponibles)
- [Testing](#-testing)
- [Desarrollo](#-desarrollo)
- [Contribución](#-contribución)

---

## ✨ Características

### 🏗️ **Arquitectura Robusta**
- **NestJS** con arquitectura modular y separación de responsabilidades
- **TypeORM** para manejo de base de datos con migraciones
- **PostgreSQL** como base de datos relacional
- **Docker** para ambiente de desarrollo consistente

### 🔗 **Relaciones Many-to-Many**
- Implementación completa de relaciones N:N entre Characters y Movies
- Validaciones de integridad referencial
- Endpoints especializados para manejo de relaciones

### ⚠️ **Manejo Profesional de Errores**
- **404** (Not Found) - Entidades inexistentes
- **400** (Bad Request) - Datos inválidos o relaciones incorrectas
- **403** (Forbidden) - Eliminación de entidades con dependencias
- **409** (Conflict) - Violación de constrains únicos

### 📚 **Documentación Completa**
- **Swagger UI** integrado con ejemplos y esquemas
- **README** detallado con instrucciones paso a paso
- **Código autodocumentado** con comentarios descriptivos

### ✅ **Validaciones Robustas**
- **class-validator** para validación de DTOs
- **Regex patterns** para formatos específicos
- **Validación de arrays** con límites y unicidad

### 🌱 **Datos de Ejemplo**
- **Seed data** con personajes y películas de StarWars
- **Relaciones precargadas** para testing inmediato
- **Migraciones** versionadas para control de cambios

---

## 🚀 Demo Rápido

```bash
# Clonar e instalar
git clone <repository-url>
cd backend
npm install

# Levantar con Docker
npm run docker:up
npm run migration:run
npm run seed

# Ejecutar API
npm run start:dev

# Probar endpoints
curl http://localhost:3000/api/v1/characters
curl http://localhost:3000/api/v1/characters/1/movies
```

**🎯 Resultado:** API completa funcionando en 2 minutos con datos de StarWars precargados.

---

## 🏛️ Arquitectura del Proyecto

### **Patrón de Diseño**
```
Controllers → Services → Repositories → Database
     ↓           ↓           ↓
   HTTP       Business    Data Access
  Requests     Logic      Layer
```

### **Módulos Implementados**
- **CharactersModule** - Gestión completa de personajes
- **MoviesModule** - Gestión completa de películas  
- **DatabaseModule** - Configuración de conexión TypeORM
- **CommonModule** - Filtros globales y pipes de validación

### **Características Técnicas**
- **Dependency Injection** de NestJS
- **Repository Pattern** con TypeORM
- **DTO Pattern** para validación y serialización
- **Global Exception Filters** para manejo de errores
- **Custom Validation Pipes** para requests

---

## 🔧 Requisitos Previos

### **Software Requerido**
- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **Docker Desktop** 
- **Git** para control de versiones

### **Verificación de Instalación**
```bash
node --version    # v18.0.0+
npm --version     # 9.0.0+
docker --version  # 20.0.0+
git --version     # 2.0.0+
```

---

## 📦 Instalación

### **1. Clonar Repositorio**
```bash
git clone <REPOSITORY_URL>
cd backend
```

### **2. Instalar Dependencias**
```bash
npm install
```

### **3. Configurar Variables de Entorno**
```bash
cp .env.example .env
```

**Archivo `.env` preconfigurado:**
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=starwars_user
DATABASE_PASSWORD=starwars_password
DATABASE_NAME=starwars_db
PORT=3000
NODE_ENV=development
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=true
```

---

## 🚀 Configuración

### **1. Levantar Base de Datos**
```bash
npm run docker:up
```

**Servicios disponibles:**
- **PostgreSQL:** `localhost:5432`
- **pgAdmin:** `http://localhost:8080`

### **2. Ejecutar Migraciones**
```bash
npm run migration:run
```

### **3. Cargar Datos de Ejemplo**
```bash
npm run seed
```

**Datos cargados:**
- 6 personajes de StarWars
- 6 películas de la saga
- Relaciones N:N preconfiguradas

---

## ▶️ Ejecución

### **Modo Desarrollo**
```bash
npm run start:dev
```

### **Accesos Disponibles**
- **API:** http://localhost:3000/api/v1
- **Swagger:** http://localhost:3000/api/v1/docs
- **pgAdmin:** http://localhost:8080

**Credenciales pgAdmin:**
- Email: `admin@starwars.com`
- Password: `admin123`

---

## 🛠️ Endpoints de la API

### **Characters**
```bash
GET    /api/v1/characters              # Listar todos los personajes
GET    /api/v1/characters/:id          # Obtener personaje específico
POST   /api/v1/characters              # Crear nuevo personaje
PUT    /api/v1/characters/:id          # Actualizar personaje
DELETE /api/v1/characters/:id          # Eliminar personaje
GET    /api/v1/characters/:id/movies   # Películas del personaje ⭐
```

### **Movies**
```bash
GET    /api/v1/movies                  # Listar todas las películas
GET    /api/v1/movies/:id              # Obtener película específica
POST   /api/v1/movies                  # Crear nueva película
PUT    /api/v1/movies/:id              # Actualizar película
DELETE /api/v1/movies/:id              # Eliminar película
GET    /api/v1/movies/:id/characters   # Personajes de la película ⭐
```

### **Gestión de Relaciones**
```bash
POST   /api/v1/characters/:characterId/movies/:movieId     # Agregar relación
DELETE /api/v1/characters/:characterId/movies/:movieId     # Quitar relación
POST   /api/v1/movies/:movieId/characters/:characterId     # Agregar relación
DELETE /api/v1/movies/:movieId/characters/:characterId     # Quitar relación
```

---

## 💡 Ejemplos de Uso

### **Crear Personaje con Películas**
```bash
curl -X POST http://localhost:3000/api/v1/characters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Han Solo",
    "height": "180",
    "mass": "80",
    "movieIds": [1, 2, 3]
  }'
```

### **Obtener Películas de un Personaje**
```bash
curl -X GET http://localhost:3000/api/v1/characters/1/movies
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "title": "A New Hope",
    "episode_id": 4,
    "director": "George Lucas"
  },
  {
    "id": 2,
    "title": "The Empire Strikes Back",
    "episode_id": 5,
    "director": "Irvin Kershner"
  }
]
```

### **Crear Película con Personajes**
```bash
curl -X POST http://localhost:3000/api/v1/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Force Awakens",
    "episode_id": 7,
    "director": "J.J. Abrams",
    "characterIds": [1, 3]
  }'
```

---

## ⚠️ Manejo de Errores

### **404 - Not Found**
```json
{
  "statusCode": 404,
  "timestamp": "2024-06-16T04:30:00.000Z",
  "path": "/api/v1/characters/999",
  "method": "GET",
  "error": "Not Found",
  "message": "Character with ID 999 not found"
}
```

### **400 - Bad Request**
```json
{
  "statusCode": 400,
  "timestamp": "2024-06-16T04:30:00.000Z",
  "path": "/api/v1/characters",
  "method": "POST",
  "error": "Bad Request",
  "message": "Movies not found with IDs: 999, 888"
}
```

### **403 - Forbidden**
```json
{
  "statusCode": 403,
  "timestamp": "2024-06-16T04:30:00.000Z",
  "path": "/api/v1/characters/1",
  "method": "DELETE",
  "error": "Forbidden",
  "message": "Cannot delete character \"Luke Skywalker\" because it is associated with 3 movie(s). Remove the associations first."
}
```

### **409 - Conflict**
```json
{
  "statusCode": 409,
  "timestamp": "2024-06-16T04:30:00.000Z",
  "path": "/api/v1/characters",
  "method": "POST",
  "error": "Conflict",
  "message": "Character with name \"Luke Skywalker\" already exists"
}
```

---

## 📚 Documentación Swagger

**Acceso:** http://localhost:3000/api/v1/docs

### **Características de la Documentación**
- **Esquemas completos** de request/response
- **Ejemplos interactivos** para cada endpoint
- **Códigos de error** documentados
- **Validaciones** explicadas
- **Try it out** funcional para testing

### **Navegación por Tags**
- **Characters** - Endpoints de personajes
- **Movies** - Endpoints de películas

---

## 🗄️ Modelo de Datos

### **Entidades Principales**

#### **Characters**
```sql
characters
├── id (PK, auto-increment)
├── name (varchar(100), unique, required)
├── height (varchar(20), optional)
├── mass (varchar(20), optional)
├── createdAt (timestamp)
├── updatedAt (timestamp)
└── deletedAt (timestamp, soft delete)
```

#### **Movies**
```sql
movies
├── id (PK, auto-increment)
├── title (varchar(200), unique, required)
├── episode_id (integer, unique, optional)
├── director (varchar(100), optional)
├── createdAt (timestamp)
├── updatedAt (timestamp)
└── deletedAt (timestamp, soft delete)
```

#### **Relación Many-to-Many**
```sql
character_movies
├── character_id (FK → characters.id)
├── movie_id (FK → movies.id)
├── PK: (character_id, movie_id)
├── ON DELETE CASCADE
└── Índices optimizados
```

### **Datos Precargados**

**Personajes:**
- Luke Skywalker (Episodes 4, 5, 6)
- Darth Vader (Episodes 4, 5, 6, 3)
- Leia Organa (Episodes 4, 5, 6)
- Obi-Wan Kenobi (Episodes 4, 1, 2, 3)
- Anakin Skywalker (Episodes 1, 2, 3)
- Yoda (Episodes 5, 6, 1, 2, 3)

**Películas:**
- A New Hope (Episode 4)
- The Empire Strikes Back (Episode 5)
- Return of the Jedi (Episode 6)
- The Phantom Menace (Episode 1)
- Attack of the Clones (Episode 2)
- Revenge of the Sith (Episode 3)

---

## 🛠️ Tecnologías

### **Backend Framework**
- **NestJS** v10 - Framework de Node.js
- **TypeScript** - Lenguaje de programación
- **Node.js** - Runtime de JavaScript

### **Base de Datos**
- **PostgreSQL** v15 - Base de datos relacional
- **TypeORM** - ORM para TypeScript
- **Docker** - Contenedorización de BD

### **Validación y Transformación**
- **class-validator** - Validaciones de DTOs
- **class-transformer** - Serialización de datos
- **@nestjs/mapped-types** - Utilities para DTOs

### **Documentación**
- **@nestjs/swagger** - Generación automática de docs
- **swagger-ui-express** - Interfaz web de Swagger

### **Herramientas de Desarrollo**
- **ESLint** - Linting de código
- **Prettier** - Formateo automático
- **ts-node** - Ejecución de TypeScript
- **tsconfig-paths** - Resolución de path aliases

### **DevOps**
- **Docker Compose** - Orquestación de contenedores
- **pgAdmin** - Administración de PostgreSQL

---

## 📜 Scripts Disponibles

### **Desarrollo**
```bash
npm run start:dev         # Ejecutar en modo desarrollo (hot reload)
npm run start:debug       # Ejecutar en modo debug
npm run start:prod        # Ejecutar en modo producción
npm run build             # Compilar proyecto TypeScript
```

### **Base de Datos**
```bash
npm run migration:run     # Ejecutar migraciones pendientes
npm run migration:revert  # Revertir última migración
npm run seed              # Cargar datos de ejemplo
npm run db:reset          # Reset completo de BD
```

### **Docker**
```bash
npm run docker:up         # Levantar contenedores (PostgreSQL + pgAdmin)
npm run docker:down       # Bajar contenedores
npm run docker:logs       # Ver logs de contenedores
```

### **Calidad de Código**
```bash
npm run lint              # Ejecutar ESLint
npm run lint:fix          # Corregir issues automáticamente
npm run format            # Formatear código con Prettier
npm run test              # Ejecutar tests unitarios
npm run test:e2e          # Ejecutar tests end-to-end
npm run test:cov          # Ejecutar tests con coverage
```

---

## 🧪 Testing

### **Testing Manual con curl**
```bash
# Listar todos los personajes
curl -X GET http://localhost:3000/api/v1/characters

# Crear nuevo personaje
curl -X POST http://localhost:3000/api/v1/characters \
  -H "Content-Type: application/json" \
  -d '{"name": "Han Solo", "height": "180", "movieIds": [1,2,3]}'

# Probar relaciones N:N
curl -X GET http://localhost:3000/api/v1/characters/1/movies
curl -X GET http://localhost:3000/api/v1/movies/1/characters

# Probar manejo de errores
curl -X GET http://localhost:3000/api/v1/characters/999    # 404
curl -X POST http://localhost:3000/api/v1/characters \
  -H "Content-Type: application/json" \
  -d '{"name": "", "movieIds": [999]}'                     # 400
```

### **Testing con Swagger UI**
1. Ir a http://localhost:3000/api/v1/docs
2. Expandir cualquier endpoint
3. Hacer clic en "Try it out"
4. Ingresar parámetros de prueba
5. Ejecutar y ver respuesta

---

## 👨‍💻 Desarrollo

### **Estructura de Carpetas**
```
src/
├── characters/           # Módulo de personajes
│   ├── dto/             # Data Transfer Objects
│   ├── entities/        # Entidades TypeORM
│   ├── characters.controller.ts
│   ├── characters.service.ts
│   └── characters.module.ts
├── movies/              # Módulo de películas
│   ├── dto/
│   ├── entities/
│   ├── movies.controller.ts
│   ├── movies.service.ts
│   └── movies.module.ts
├── common/              # Utilidades compartidas
│   ├── filters/         # Exception filters
│   └── pipes/           # Validation pipes
├── config/              # Configuraciones
├── database/            # Migraciones y seeds
└── shared/              # Entidades base
```

### **Patrones de Desarrollo**
- **Modular Architecture** - Separación por dominio
- **Repository Pattern** - Abstracción de acceso a datos
- **DTO Pattern** - Validación y transformación
- **Dependency Injection** - Inversión de control
- **Exception Handling** - Manejo centralizado de errores

### **Convenciones de Código**
- **CamelCase** para variables y funciones
- **PascalCase** para clases y interfaces
- **kebab-case** para nombres de archivos
- **SCREAMING_SNAKE_CASE** para constantes
- **Prefijos descriptivos** para métodos (get, create, update, delete)

---

## 📄 Información del Proyecto

### **Contexto Académico**
- **Universidad:** Tecnológico de Costa Rica
- **Curso:** TI-8512 - Diseño de Aplicaciones Web
- **Proyecto:** #3 - API Backend con NestJS
- **Grupo:** 1 - StarWars API

### **Equipo de Desarrollo**
- **Estudiantes:** Luis Jiménez y Valentina Méndez
- **Fecha de Entrega:** Martes 24 de Junio 2025
- **Profesor:** varguitas

### **Objetivos Cumplidos**
✅ **Implementación completa de API** con NestJS  
✅ **Relaciones Many-to-Many** entre Characters y Movies  
✅ **Manejo profesional de errores HTTP** (404, 400, 403, 409)  
✅ **Validaciones robustas** con class-validator  
✅ **Documentación Swagger** completa  
✅ **Datos de ejemplo** precargados  
✅ **Arquitectura modular** y escalable  

---

<div align="center">

## 🎯 Estado del Proyecto

**✅ PROYECTO COMPLETADO AL 100%**

*Backend robusto con NestJS - Relaciones N:N - Manejo de errores profesional*

**🚀 Listo para entrega académica**

---

**Made with ❤️ for TI-8512 - Diseño de Aplicaciones Web**

</div>