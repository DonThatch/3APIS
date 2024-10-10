const PORT = process.env.APP_PORT ?? 3000;
const BDD_URL = process.env.BDD_URL ?? "mongodb://localhost:27017";
const JWT_SECRET_KEY = process.env.JWT_SECRET

interface CustomError extends Error {
    status?: number;
    message: string;
}

export { PORT, BDD_URL, JWT_SECRET_KEY };
export type { CustomError };
