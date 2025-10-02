import type { Request, Response } from 'express';
import { UserService } from '../services/UserService.js';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, age } = req.body;

      if (!name || typeof name !== 'string') {
        res.status(400).json({
          error: 'Bad request',
          message: 'Name is required and must be a string',
        });
        return;
      }

      if (age === undefined || typeof age !== 'number') {
        res.status(400).json({
          error: 'Bad request',
          message: 'Age is required and must be a number',
        });
        return;
      }

      const user = await this.userService.createUser(name, age);
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      const message = error instanceof Error ? error.message : 'Failed to create user';
      res.status(400).json({
        error: 'Bad request',
        message,
      });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          error: 'Bad request',
          message: 'User ID is required',
        });
        return;
      }

      const user = await this.userService.getUserById(id);

      if (!user) {
        res.status(404).json({
          error: 'Not found',
          message: 'User not found',
        });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      const message = error instanceof Error ? error.message : 'Failed to get user';
      res.status(400).json({
        error: 'Bad request',
        message,
      });
    }
  }

  async getAllUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to get users',
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!id) {
        res.status(400).json({
          error: 'Bad request',
          message: 'User ID is required',
        });
        return;
      }

      const user = await this.userService.updateUser(id, updates);

      if (!user) {
        res.status(404).json({
          error: 'Not found',
          message: 'User not found',
        });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      const message = error instanceof Error ? error.message : 'Failed to update user';
      res.status(400).json({
        error: 'Bad request',
        message,
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          error: 'Bad request',
          message: 'User ID is required',
        });
        return;
      }

      const deleted = await this.userService.deleteUser(id);

      if (!deleted) {
        res.status(404).json({
          error: 'Not found',
          message: 'User not found',
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting user:', error);
      const message = error instanceof Error ? error.message : 'Failed to delete user';
      res.status(400).json({
        error: 'Bad request',
        message,
      });
    }
  }

  async getAdultUsers(_req: Request, res: Response): Promise<void> {
    try {
      const adultUsers = await this.userService.getAdultUsers();
      res.json(adultUsers);
    } catch (error) {
      console.error('Error getting adult users:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to get adult users',
      });
    }
  }

  async getUserStatistics(_req: Request, res: Response): Promise<void> {
    try {
      const statistics = await this.userService.getUserStatistics();
      res.json(statistics);
    } catch (error) {
      console.error('Error getting user statistics:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to get user statistics',
      });
    }
  }
}
