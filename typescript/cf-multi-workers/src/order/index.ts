import { DiscordNotification, SlackNotification } from '../notification/index';

type Env = {
	SLACK_NOTIFICATION: Service<SlackNotification>;
	DISCORD_NOTIFICATION: Service<DiscordNotification>;
};

export default {
	async fetch(request, env, ctx): Promise<Response> {
		console.log('order has been completed!');

		await env.SLACK_NOTIFICATION.send('order has been completed!Please wait for shipment!');
		await env.DISCORD_NOTIFICATION.send('order has been completed!Please wait for shipment!');

		return new Response('order and notification completed!');
	},
} satisfies ExportedHandler<Env>;
