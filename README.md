# Puzge Solution

## Projects Overview

- **Puzge.Api**  
  ASP.NET Core Web API backend project. Handles server-side logic and database interaction.

- **Puzge.Frontend**  
  Angular frontend project. User interface of the application.

## Database

- PostgreSQL is the database.
- Runs inside Docker for development (see `docker-compose.yaml`).
- Connection string configured in `Puzge.Api/appsettings.Development.json`.

## Running the Application

### Locally (without Docker)

1. Ensure PostgreSQL is running locally or use a managed database.
2. Run the backend API:
    ```bash
    cd Puzge.Api
    dotnet run
    ```
3. Run the frontend:
    ```bash
    cd Puzge.Frontend
    npm install
    npm start
    ```
4. Access the frontend at [http://localhost:4200](http://localhost:4200) and backend API at [http://localhost:5000](http://localhost:5000).

### Using Docker

1. Ensure Docker is installed and running.
2. From the root folder (`Puzge`), run:
    ```bash
    docker-compose up --build
    ```
3. This will start backend, frontend, and PostgreSQL containers.
4. Access the frontend at [http://localhost:4200](http://localhost:4200) and backend API at [http://localhost:5000](http://localhost:5000).

## Useful Commands

### Docker

- **Start containers in foreground (build if needed):**
  ```bash
  docker-compose up --build
  ```

- **Stop containers:**
  ```bash
  docker-compose down
  ```

- **Rebuild containers:**
  ```bash
  docker-compose build --no-cache
  ```

### Frontend

- **Install dependencies:**
  ```bash
  cd Puzge.Frontend
  npm install
  ```

- **Start frontend development server:**
  ```bash
  npm start
  ```

- **Build production frontend:**
  ```bash
  npm run build
  ```

### Backend

- **Run backend API:**
  ```bash
  cd Puzge.Api
  dotnet run
  ```

- **Build backend:**
  ```bash
  dotnet build
  ```

- **Run tests:**
  ```bash
  dotnet test
  ```

- **Add Migration:**
  ```bash
  dotnet ef migrations add InitialCreate --output-dir Data/Migrations
  ```

- **Update the Database:**
  ```bash
  dotnet ef database update
  ```

- **Remove Migration**
  ```bash
  dotnet ef migrations remove
  ```