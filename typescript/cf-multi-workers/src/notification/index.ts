import { WorkerEntrypoint } from 'cloudflare:workers';

export class SlackNotification extends WorkerEntrypoint {
	async fetch() {
		return new Response(null);
	}

	async send(message: string) {
		console.log('sent to Slack!', message);
	}
}

export class DiscordNotification extends WorkerEntrypoint {
	async fetch() {
		return new Response(null);
	}

	async send(message: string) {
		console.log('sent to Discord!', message);
	}
}

export default class extends WorkerEntrypoint {
	async fetch() {
		return new Response(null);
	}
}
