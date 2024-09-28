import { WorkerEntrypoint } from 'cloudflare:workers';
import { Controller } from './controller';
import { Reposiotry } from './repository';
import { Usecase } from './usecase';

export class ExampleService extends WorkerEntrypoint<Env> {
	getValue() {
		const ctrl = new Controller(this.ctx, new Usecase(new Reposiotry(), this.ctx));

		const value = ctrl.get();
		this.log('getting value ' + value);

		return value;
	}

	newGetValue() {
		return () => this.getValue();
	}

	private log(message: string) {
		this.ctx.waitUntil(Promise.resolve(console.log(message)));
	}
}
