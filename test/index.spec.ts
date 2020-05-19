import { AssertionError } from 'assert';
import { expect } from 'chai';
import stream from 'stream';
import util from 'util';
import Analyzer from '../src'

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
      public constructor() {
        super();
      }
      public createTransformStreams(): stream.Transform[] {
        return super.createTransformStreams();
      }
    })();
    const streams = [stream.Readable.from(text), ...analyzer.createTransformStreams()];
    await util.promisify(stream.pipeline)(streams);
    for await (const problem of streams[streams.length - 1]) {
      expect(problem).to.deep.equal(expected);
      return;
    }
    throw new AssertionError({ message: 'There was no problem to expect.', expected });
  });
});
