# Code review using ESLint

Analyze code statically by using [ESLint](https://eslint.org/) in Github actions

## Inputs

### `files`

Specify patterns by glob

(Multiple patterns can be specified by separating them with line feed)

### `options`

Changes `eslint` command line options.

Specify the options in JSON array format.
e.g.: `'["--ext", ".js", "--ext", ".ts"]'`

### `working_directory`

Changes the current working directory of the Node.js process

## Example usage

```yaml
name: Analyze code statically
"on": pull_request
jobs:
  eslint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Analyze code statically using ESLint
        uses: moneyforward/eslint-action@v0
```

## Contributing
Bug reports and pull requests are welcome on GitHub at https://github.com/moneyforward/eslint-action

## License
The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
