import { Notifier } from '../notification/index';

type Env = {
	NOTIFIER: Service<Notifier>;
};

// 注文を受け付ける HTTP API
export default {
	async fetch(request, env, ctx): Promise<Response> {
		await env.NOTIFIER.send('order has been completed!Please wait for shipment!');
		return new Response('order and notification completed!');
	},
} satisfies ExportedHandler<Env>;
