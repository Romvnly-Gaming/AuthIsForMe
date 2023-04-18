// If your router file starts getting too big,
//  split your router into several subrouters each implemented in its own file.
// Then merge them into a single root appRouter.

import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const users = {
	dos: {
		name: 'The oldest',
		bio: 'Thez',
	},
};

export const t = initTRPC.create();

export const appRouter = t.router({
	getUserById: t.procedure.input(z.string()).query(({ input }) => {
		return users[input]; // input type is string
	}),
});

// export type definition of API
export type AppRouter = typeof appRouter;
