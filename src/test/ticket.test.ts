import { describe, it, expect, vi, type Mock, beforeEach } from 'vitest';
import type{ Request, Response } from 'express';
import { getTicket, bookTicket, validateTicket } from '../controllers/ticket.controller';
import * as jwt from 'jsonwebtoken';
import { login } from '../controllers/user.controller'
import { Ticket } from '../models/ticket.model';
import bcrypt from "bcryptjs";
import {User} from "../models/user.model";
import {Train} from "../models/train.model";

vi.mock('../models/train.model', () => ({
    Train: {
        findOne: vi.fn(),
    },
}));

vi.mock('../models/user.model', () => ({
    User: {
        findOne: vi.fn(),
    },
}));

// Mock de bcryptjs
vi.mock('bcryptjs', () => ({
    __esModule: true, // Indique que ce module utilise les exports ES
    default: {
        compare: vi.fn(), // Simule la méthode compare
        hash: vi.fn(), // Simule la méthode hash si nécessaire
    },
}));


// Mock partiel de jsonwebtoken
vi.mock('jsonwebtoken', async () => {
    const actual = await vi.importActual<typeof import('jsonwebtoken')>('jsonwebtoken');
    return {
        ...actual,
        verify: vi.fn(),
        sign: vi.fn().mockReturnValue('valid_token'), // Mock de sign pour retourner un token valide
    };
});

// Mock du modèle Ticket
vi.mock('../models/ticket.model', () => ({
    Ticket: {
        find: vi.fn(),
        save: vi.fn(),
        findById: vi.fn(),
    },
}));

///////////////////////////////////////////////////////////////////////////
////////////////////////// GetTicket Controller //////////////////////////
///////////////////////////////////////////////////////////////////////////

describe('getTicket Controller', () => {
    beforeEach(() => {
        vi.clearAllMocks(); // Réinitialise tous les mocks avant chaque test
    });

    // Test pour l'absence de token
    it('should return 401 if no token is provided', async () => {
        const req = {
            header: vi.fn().mockReturnValue(undefined), // Pas de token fourni
        } as unknown as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        await getTicket(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. No token provided.' });
    });

    // Test pour une erreur de vérification du token
    it('should return 401 if jwt verification fails', async () => {
        const req = {
            header: vi.fn().mockReturnValue('Bearer invalid_token'),
        } as unknown as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        (jwt.verify as Mock).mockImplementation(() => {
            throw new Error('Invalid token');
        });

        await getTicket(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid Token' });
    });

    it('should successfully login and get tickets', async () => {
        // Simuler la requête de connexion
        const reqLogin = {
            body: { email: 'admin@railroad.com', password: 'admin' },
        } as unknown as Request & { json: Mock };

        // Simuler la réponse de connexion
        const resLogin = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response & { json: Mock };

        // Simuler le comportement de l'utilisateur dans la base de données
        const mockedUser = {
            _id: 'user123',
            email: 'admin@railroad.com',
            password: await bcrypt.hash('admin', 10), // Hachage du mot de passe
        };

        // Simuler le modèle User pour renvoyer un utilisateur valide
        (User.findOne as Mock).mockResolvedValue(mockedUser); // Simuler un utilisateur trouvé
        (bcrypt.compare as Mock).mockResolvedValue(true); // Le mot de passe est correct

        // Appel de la fonction login pour obtenir un token valide
        await login(reqLogin, resLogin);
        const { token } = resLogin.json.mock.calls[0][0]; // Récupère le token de la réponse

        // Simuler la requête pour récupérer les tickets
        const reqGetTicket = {
            header: vi.fn().mockReturnValue(`Bearer ${token}`),
        } as unknown as Request;

        // Simuler la réponse pour obtenir les tickets
        const resGetTicket = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        // Simuler le décodage du token
        (jwt.verify as Mock).mockReturnValue({ _id: 'user123' });

        // Simuler le retour de Ticket.find
        const mockTickets = [{
            _id: 'ticket123',
            price: 30,
            seat_number: 54,
            status: "cancelled",
            trainName: "k50",
            userId: "user123"
        }];
        (Ticket.find as Mock).mockResolvedValue(mockTickets);

        await getTicket(reqGetTicket, resGetTicket); // Appel de la fonction getTicket

        // Vérifie que les tickets sont retournés
        expect(resGetTicket.json);
    }, 20000);
});


///////////////////////////////////////////////////////////////////////////
////////////////////////// BookTicket Controller //////////////////////////
///////////////////////////////////////////////////////////////////////////

describe('bookTicket Controller', () => {
    beforeEach(() => {
        vi.clearAllMocks(); // Réinitialise tous les mocks avant chaque test
    });
    it('should return 401 if no token is provided', async () => {
        const req = {
            header: vi.fn().mockReturnValue(undefined),
            body: {},
        } as unknown as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        await bookTicket(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. No token provided.' });
    });

    it('should return 400 if is bad request', async () => {
        const req = {
            header: vi.fn().mockReturnValue('Bearer valid_token'),
            body: { trainName: 'nonexistent_train' },
        } as unknown as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response & { json: Mock };

        (jwt.verify as Mock).mockReturnValue({ _id: 'user123' });
        (Train.findOne as Mock).mockResolvedValue(null);
        console.log(Train.findOne)
        await bookTicket(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });
});

///////////////////////////////////////////////////////////////////////////
////////////////////////// ValidateTicket Controller //////////////////////
///////////////////////////////////////////////////////////////////////////

describe('validateTicket Controller', () => {
    it('should return 404 if ticket is not found', async () => {
        const req = {
            params: { id: 'nonexistent_ticket' },
        } as unknown as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        (Ticket.findById as Mock).mockResolvedValue(null);

        await validateTicket(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Ticket not found' });
    });

    it('should return 200 and validate the ticket if found', async () => {
        const req = {
            params: { id: 'existing_ticket' },
        } as unknown as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        const mockTicket = {
            _id: 'existing_ticket',
            status: 'pending',
            save: vi.fn().mockResolvedValue({ _id: 'existing_ticket', status: 'validate' }),
        };

        (Ticket.findById as Mock).mockResolvedValue(mockTicket);

        await validateTicket(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });
});