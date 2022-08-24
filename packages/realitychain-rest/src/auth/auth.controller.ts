
import { Controller, Get } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  @Get('login')
  async login() {
    return {
      access_token: this.jwtService.sign({ username: "username" }),
    };
  }
}