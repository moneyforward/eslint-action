/// <reference types="node" />
import stream from 'stream';
import StaticCodeAnalyzer from '@moneyforward/sca-action-core';
export default class Analyzer extends StaticCodeAnalyzer {
    constructor(options?: string[]);
    protected prepare(): Promise<void>;
    protected createTransformStreams(): stream.Transform[];
}
