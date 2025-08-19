<div align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</div>

<h1 align="center">API Parking</h1>

## Prerrequisitos

- Node.js
- TypeScript
- NestJs
- PostgreSQL (u otra base de datos compatible con Prisma ORM)

## Configuración e Instalación
1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/Pola03/API-Parking.git

2. **Instalar dependencias**:
   
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno**:
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

   ```ts
   DB_NAME=<your_postgreSQL_database_name>
   DB_USER=<your_postgreSQL_database_user>
   DB_PASSWORD=<your_postgreSQL_database_password>

   DATABASE_URL="postgresql://DB_USER:DB_PASSWORD@localhost:5432/DB_NAME?schema=public"
   MONGODB_URI="mongodb://localhost/<your_mongodb_database_url>"
   JWT_SECRET=<your_jwt_secret>
   ```

4. **Configuración de la base de datos**:
   Cree las bases de datos en PostgreSQL y MongoDB especificadas en el paso anterior. Luego realice la migración hacia PostgreSQL utilizando Prisma como ORM.

   ```bash
   npx prisma migrate dev --name init
   ```
   
5. **Correr la aplicación**:

   ```bash
    # development
    npm run start

    # watch mode
    npm run start:dev

    # production mode
    npm run start:prod
   ```