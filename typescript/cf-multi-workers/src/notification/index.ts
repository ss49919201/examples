import { WorkerEntrypoint } from 'cloudflare:workers';

// どこかに通知するエントリポイント
export class Notifier extends WorkerEntrypoint {
	async send(message: string) {
		const timestamp = new Date().toISOString();
		const notification = {
			id: Math.random().toString(36).substr(2, 9),
			message,
			timestamp,
			status: 'sent',
		};

		console.log(`通知を送信しました: ${JSON.stringify(notification)}`);

		return notification;
	}
}
