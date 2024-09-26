export { ExampleService } from './service';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		return new Response('Hello World!');
	},
} satisfies ExportedHandler<Env>;
