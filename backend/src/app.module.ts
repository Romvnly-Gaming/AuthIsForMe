import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RootController } from './modules/root.controller.js';
import { PrismaModule } from './modules/prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { AuthController } from './modules/auth/auth.controller.js';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		PrismaModule,
		AuthModule,
	],
	controllers: [RootController, AuthController],
})
export class AppModule {}
