import { Request, Response } from 'express';

// Error-handling middleware
const errorHandler = (err: any, req: Request, res: Response) => {
   // Set a generic status if none was set
   const statusCode = err.statusCode || 500;
   res.status(statusCode).json({
      message: err.message || 'Internal Server Error',
      status: statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
   });
};

export default errorHandler;
