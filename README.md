# RailRoad API

RailRoad API is a project for managing users, tickets, trains, and train stations. It is built with TypeScript, Node.js, Express, and Bun.

## Prerequisites

- Node.js (v16 or higher)
- Bun (v0.1.0 or higher)
- MongoDB (running instance)

## Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/DonThatch/3APIS.git
    cd railroadapi
    ```

2. **Install dependencies:**

    ```sh
    bun install
    ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following variables:

    ```env
    JWT_SECRET_KEY=your_secret_key
    ```

## Running the Project

1. **Start the development server:**

    ```sh
    bun run dev
    ```

   The server will start on `http://localhost:3000`.

## API Documentation

The API documentation is available via Swagger. Once the server is running, you can access it at:

http://localhost:3000/api-docs

## Project Structure

- `src/controllers`: Contains the controller functions for handling requests.
- `src/middlewares`: Contains middleware functions for authentication and other purposes.
- `src/models`: Contains the Mongoose models for the database.
- `src/routes`: Contains the route definitions for the API.
- `src`: Contains the main entry point and other configuration files.

## Data Model

### User

- `_id`: string
- `email`: string
- `username`: string
- `password`: string
- `role`: string (enum: ["user", "employee", "admin"])

### Ticket

- `_id`: string
- `userId`: string
- `trainId`: string
- `seatNumber`: string
- `price`: number

### Train

- `_id`: string
- `name`: string
- `capacity`: number

### TrainStation

- `_id`: string
- `name`: string
- `location`: string

## Available Scripts

- `bun run dev`: Starts the development server with hot-reloading.
- `bun run build`: Builds the project for production.
- `bun run start`: Starts the production server.

## Usage

### User Routes

- `POST /register`: Register a new user.
- `POST /login`: Login a user.
- `GET /`: Get all users (requires authentication).
- `GET /:id`: Get user by ID (requires authentication).
- `PUT /:id`: Update user by ID (requires authentication).
- `DELETE /:id`: Delete user by ID (requires authentication).

### TrainStation Routes

- `POST /trainStations`: Create a new train station (requires admin authentication).
- `GET /trainStations`: Get all train stations.
- `GET /trainStations/:name`: Get train station by name.
- `PUT /trainStations/:id`: Update train station by ID (requires admin authentication).
- `DELETE /trainStations/:id`: Delete train station by ID (requires admin authentication).

### Train Routes

- `POST /trains`: Create a new train (requires admin authentication).
- `GET /trains`: Get all trains.
- `GET /trains/:id`: Get train by ID.
- `PUT /trains/:id`: Update train by ID (requires admin authentication).
- `DELETE /trains/:id`: Delete train by ID (requires admin authentication).

### Ticket Routes

- `POST /tickets`: Create a new ticket (requires authentication).
- `GET /tickets`: Get all tickets (requires authentication).
- `PUT /tickets/:id`: Update ticket by ID (requires authentication).
