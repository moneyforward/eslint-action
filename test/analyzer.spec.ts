import { expect } from 'chai';
import stream from 'stream';
import { Transformers } from '@moneyforward/sca-action-core';
import Analyzer from '../src/analyzer'
import { AssertionError } from 'assert';

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
      public createTransformStreams(): Transformers {
        return super.createTransformStreams();
      }
    })();
    const [prev, next = prev] = analyzer.createTransformStreams();
    stream.Readable.from(text).pipe(prev);
    for await (const problem of next) {
      expect(problem).to.deep.equal(expected);
      return;
    }
    throw new AssertionError({ message: 'There was no problem to expect.', expected });
  });
});
