import { Request, Response } from 'express';

export const healthCheckController = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'XForce Serverless API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};

