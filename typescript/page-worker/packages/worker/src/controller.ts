import { Usecase } from './usecase';

export class Controller {
	constructor(private readonly context: ExecutionContext, private readonly usecase: Usecase) {}

	get() {
		return this.usecase.get();
	}
}
