import { WorkerEntrypoint } from 'cloudflare:workers';

export class ExampleService extends WorkerEntrypoint<Env> {
	getValue() {
		const random = Math.random();
		this.log('getting value ' + random);

		return random;
	}

	newGetValue() {
		return () => this.getValue();
	}

	private log(message: string) {
		this.ctx.waitUntil(Promise.resolve(console.log(message)));
	}
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		return new Response('Hello World!');
	},
} satisfies ExportedHandler<Env>;
