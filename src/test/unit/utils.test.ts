import * as util from 'src/services/utils.js';
import { Response } from 'express';
import { ApiResponse } from 'src/types/entity.types.js';
import { describe, expect, it, vi } from 'vitest';

vi.mock('express');
describe('Util methods', () => {
   it('should hashpassword', async () => {
      const password = await util.hashPassword('password');
      expect(password).not.toBeNull();
   });
   it('should verifyPassword', async () => {
      const hashPassword = await util.hashPassword('password');
      const verifyPassword = await util.verifyPassword('password', hashPassword);
      expect(verifyPassword).toBeTruthy();
   });
   it('should format API Response', async () => {
      const message = { statusCode: 200, message: 'format' };
      const response = await util.formatResponse(message);
      expect(response).toEqual({ careconnect: message });
   });
   it('should set the status code and call json when careconnect has a statusCode', () => {
      const mockResponse = () => {
         const res: Partial<Response> = {};
         res.status = vi.fn().mockReturnThis(); // Mock chainable .status()
         res.json = vi.fn(); // Mock .json()
         return res as Response;
      };
      const res = mockResponse();
      const apiResults: ApiResponse.Signature = {
         careconnect: {
            statusCode: 404,
            message: 'Not Found',
         },
      };
      util.sendResponse(res, apiResults);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(apiResults);
   });
   it('should directly call json when careconnect does not have a statusCode', () => {
      const mockResponse = () => {
         const res: Partial<Response> = {};
         res.status = vi.fn().mockReturnThis(); // Mock chainable .status()
         res.json = vi.fn(); // Mock .json()
         return res as Response;
      };
      const res = mockResponse();
      const apiResults: ApiResponse.Signature = {
         careconnect: {
            identifiers: [{ id: 1 }],
            generatedMaps: [],
            raw: [],
         },
      };
      util.sendResponse(res, apiResults);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(apiResults);
   });
});
