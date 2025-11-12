import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { createCsrfUtilities } from './csrf.config';
import { DoubleCsrfUtilities } from 'csrf-csrf';

@Injectable()
export class CsrfService {
  private csrfUtilities : DoubleCsrfUtilities;

  constructor() {
    // Initialize CSRF utilities with shared configuration
    this.csrfUtilities = createCsrfUtilities();
  }

  generateToken(req: Request, res: Response): string {
    const token = this.csrfUtilities.generateCsrfToken(req, res);
    return token;
  }

  validateToken(req: Request): boolean {
    try {
      this.csrfUtilities.validateRequest(req);
      return true;
    } catch (error) {
      return false;
    }
  }
}
