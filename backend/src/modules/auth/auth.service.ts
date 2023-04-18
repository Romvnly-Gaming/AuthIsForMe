/* eslint-disable no-useless-constructor */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthService {
	constructor(private prismaService: PrismaService) {}

	async handleSignUp() {
		console.log('sign up');
	}

	async handleSignIn() {
		console.log('sign in');
	}
}
