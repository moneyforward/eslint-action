import { StaticCodeAnalyzer, Transformers } from '@moneyforward/sca-action-core';
export default class Analyzer extends StaticCodeAnalyzer {
    constructor(options?: string[]);
    prepare(): Promise<unknown>;
    createTransformStreams(): Transformers;
}
