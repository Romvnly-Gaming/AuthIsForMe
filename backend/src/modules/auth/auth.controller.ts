/* eslint-disable no-useless-constructor */
import { Body, Controller, Post } from '@nestjs/common';
import type { AuthDTO } from '@/src/dto';
import { AuthService } from './auth.service.js';

// Put it in reverse, Terry!

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signup')
	signUp(@Body() dto: AuthDTO) {
		console.log(dto);
		return this.authService.handleSignUp();
	}

	@Post('signin')
	signIn(@Body() dto: AuthDTO) {
		console.log(dto);
		return this.authService.handleSignIn();
	}
}
