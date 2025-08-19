import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login_auth.dto';
import { RegisterAuthDto } from './dto/register_auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  registerUser(@Body() userObject : RegisterAuthDto){
    return this.authService.register(userObject);
  }

  @Post('/login')
  @HttpCode(200)
  loginUser(@Body() userObject : LoginAuthDto){
    return this.authService.login(userObject);
  }
}
