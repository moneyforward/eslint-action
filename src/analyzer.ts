import stream from 'stream';
import util from 'util';
import { StaticCodeAnalyzer, Transformers, tool } from '@moneyforward/sca-action-core';

const debug = util.debuglog('eslint-action');

export default class Analyzer extends StaticCodeAnalyzer {
  constructor(options: string[] = []) {
    super('npx', ['eslint'].concat(options).concat(['-f', 'unix']), undefined, 2, undefined, 'ESLint');
  }

  protected async prepare(): Promise<unknown> {
    console.log('::group::Installing packages...');
    try {
      return tool.execute('npm', ['install']);
    } finally {
      console.log('::endgroup::');
    }
  }

  protected createTransformStreams(): Transformers {
    const transformers = [
      new tool.LineTransformStream(),
      new stream.Transform({
        readableObjectMode: true,
        writableObjectMode: true,
        transform: function (warning: string, _encoding, done): void {
          debug('%s', warning);
          const regex = /^(.+):(\d+):(\d+): (.+) \[(Error|Warning)(?:|\/(.+))\]$/;
          const [matches, file, line, column, message, severity, code] = regex.exec(warning) || [];
          done(null, matches && {
            file,
            line,
            column,
            message: `${message}${code ? ` (${code})` : ''}`,
            severity,
            code
          });
        }
      })
    ];
    transformers.reduce((prev, next) => prev.pipe(next));
    return [transformers[0], transformers[transformers.length - 1]];
  }
}
