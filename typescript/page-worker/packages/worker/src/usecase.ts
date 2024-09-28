import { Reposiotry } from './repository';

export class Usecase {
	constructor(private readonly repository: Reposiotry, private readonly context: ExecutionContext) {}

	get() {
		return this.repository.get();
	}
}
