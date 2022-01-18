import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() creds: AuthCredentialsDto): Promise<{ token: string }> {
    return this.authService.signUp(creds);
  }

  @Post('signin')
  signIn(@Body() creds: AuthCredentialsDto): Promise<{ token: string }> {
    return this.authService.signIn(creds);
  }
}
