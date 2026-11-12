import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('assign-role/:userId')
  @UseGuards(AuthGuard('jwt'))
  async assignRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Body('roleName') roleName: string,
  ) {
    return this.authService.assignRole(userId, roleName);
  }
}