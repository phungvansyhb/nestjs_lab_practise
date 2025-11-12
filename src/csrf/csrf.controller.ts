import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { CsrfService } from './csrf.service';

@Controller('csrf')
export class CsrfController {
  constructor(private readonly csrfService: CsrfService) {}

  /**
   * Endpoint to get a CSRF token
   * This should be called by the client before making any POST/PUT/DELETE requests
   * GET /csrf/token
   */
  @Get('token')
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    const token = this.csrfService.generateToken(req, res);
    
    return res.json({
      token,
      message: 'Include this token in the x-csrf-token header for protected requests',
    });
  }
}
