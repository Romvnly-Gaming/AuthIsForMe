import { Controller, Get, Render } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';

@Controller('/')
export class RootController {
	// eslint-disable-next-line no-useless-constructor
	constructor(private prismaService: PrismaService) {}

	@Get()
	@Render('index')
	root() {
		return {
			message: 'The oldest',
		};
	}

	@Get('users')
	getAllUsers() {
		return this.prismaService.user.findMany({
			select: {
				id: true,
				userId: true,
				username: true,
				biography: true,
				profileViews: true,
				lastSeen: true,
				avatar: true,
				mojangAccount: true,
				discordAccount: true,
        twitchAccount: true,
        role: true,
        posts: true,
			},
			where: {
				profilePrivate: false,
				banned: false,
			},
		});
	}
}
