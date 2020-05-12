import fs from 'fs';
import stream from 'stream';
import util from 'util';
import Command from '@moneyforward/command';
import StaticCodeAnalyzer from '@moneyforward/sca-action-core';
import { Lines } from '@moneyforward/stream-util';

const debug = util.debuglog('eslint-action');

export default class Analyzer extends StaticCodeAnalyzer {
  constructor(options: string[] = []) {
    super('npx', ['eslint'].concat(options).concat(['-f', 'unix']), undefined, 2, undefined, 'ESLint');
  }

  protected async prepare(): Promise<void> {
    console.log('::group::Installing packages...');
    try {
      const [command, args] = fs.existsSync('yarn.lock') ? ['yarn', ['--frozen-lockfile']] : ['npm', ['ci']];
      await Command.execute(command, args);
    } finally {
      console.log('::endgroup::');
    }
  }

  protected createTransformStreams(): stream.Transform[] {
    return [
      new Lines(),
      new stream.Transform({
        objectMode: true,
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
  }
}
