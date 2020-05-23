import { AssertionError } from 'assert';
import { expect } from 'chai';
import stream from 'stream';
import { reporter } from '@moneyforward/code-review-action';
import Analyzer from '../src'

type ReporterConstructor = reporter.ReporterConstructor

describe('Transform', () => {
  it('should return the problem object', async () => {
    const expected = {
      file: 'src/index.ts',
      line: '16',
      column: '29',
      severity: 'Warning',
      message: 'Missing return type on function. (@typescript-eslint/explicit-function-return-type)',
      code: '@typescript-eslint/explicit-function-return-type'
    };
    const text = 'src/index.ts:16:29: Missing return type on function. [Warning/@typescript-eslint/explicit-function-return-type]';
    const analyzer = new (class extends Analyzer {
      get Reporter(): ReporterConstructor {
        throw new Error("Method not implemented.");
      }
      public constructor() {
        super();
      }
      public createTransformStreams(): stream.Transform[] {
        return super.createTransformStreams();
      }
    })();
    const transform = analyzer.createTransformStreams()
      .reduce((previous, current) => previous.pipe(current), stream.Readable.from(text));
    for await (const problem of transform) return expect(problem).to.deep.equal(expected);
    throw new AssertionError({ message: 'There was no problem to expect.', expected });
  });
});
