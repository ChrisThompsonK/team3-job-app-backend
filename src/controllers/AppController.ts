import type { Request, Response } from 'express';
import { AppService } from '../services/AppService.js';

export class AppController {
  private appService: AppService;

  constructor() {
    this.appService = new AppService();
  }

  async getRoot(_req: Request, res: Response): Promise<void> {
    try {
      const appInfo = await this.appService.getApplicationInfo();
      res.json(appInfo);
    } catch (error) {
      console.error('Error getting app info:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to get application information',
      });
    }
  }

  async getHealth(_req: Request, res: Response): Promise<void> {
    try {
      const healthInfo = await this.appService.getHealthStatus();
      res.json(healthInfo);
    } catch (error) {
      console.error('Error getting health status:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to get health status',
      });
    }
  }

  async getGreeting(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.query;
      const greeting = await this.appService.generateGreeting((name as string) || 'Developer');

      res.json({
        greeting,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error generating greeting:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to generate greeting',
      });
    }
  }
}
