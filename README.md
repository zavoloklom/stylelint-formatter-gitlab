# Stylelint Gitlab Codequality Formatter

[![Latest Release](https://img.shields.io/npm/v/%40gitlab-formatters%2Fstylelint-formatter-gitlab?style=flat-square)](https://www.npmjs.com/package/@gitlab-formatters/stylelint-formatter-gitlab)
![Coverage Badge](https://img.shields.io/codacy/coverage/8420b859b4654c05a2ba9201620081c7?style=flat-square&label=Coverage)
[![Codacy Code Quality Badge](https://img.shields.io/codacy/grade/8420b859b4654c05a2ba9201620081c7?style=flat-square&logo=codacy&label=Code%20Quality)](https://app.codacy.com/gl/gitlab-formatters/stylelint-formatter-gitlab/dashboard?utm_source=gl&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=whit&style=flat-square)](https://conventionalcommits.org)

Formatter that transforms [Stylelint](https://stylelint.io/) reports into a format suitable for use
with [GitLab widgets](https://docs.gitlab.com/ee/ci/testing/code_quality.html).

> The source code is hosted on [GitLab](https://gitlab.com/gitlab-formatters/stylelint-formatter-gitlab).
> Although there is an automatic mirror of this repository
> on [GitHub](https://github.com/zavoloklom/stylelint-formatter-gitlab), all bug reports, feature requests, and merge
> requests should be submitted through GitLab.

## Usage

Install `stylelint` and `@gitlab-formatters/stylelint-formatter-gitlab` using your package manager:

```bash
npm install --save-dev stylelint @gitlab-formatters/stylelint-formatter-gitlab
```

```bash
yarn add --dev stylelint @gitlab-formatters/stylelint-formatter-gitlab
```

To use in your project, simply run:

```bash
npx stylelint . --custom-formatter=@gitlab-formatters/stylelint-formatter-gitlab
```

For integration with GitLab CI, add the following to your `.gitlab-ci.yml`:

```yml
stylelint:
  image: node:20.14.0-alpine3.20
  stage: codequality
  script:
    - npm ci
    - npx stylelint . --custom-formatter=@gitlab-formatters/stylelint-formatter-gitlab --output-file=gl-codequality.json
  artifacts:
    reports:
      codequality: gl-codequality.json
```

## Report Example

Below is a JSON example of how the formatter reports issues.

This particular example outputs a detailed report that goes beyond the minimal fields required by GitLab's code quality
widgets.

While GitLab requires only a subset of fields according to
the [Gitlab Code Quality specification](https://docs.gitlab.com/ee/ci/testing/code_quality.html#implement-a-custom-tool),
this formatter implements the full set of fields as outlined in
the [Code Climate Issue Data Type specification](https://github.com/codeclimate/platform/blob/master/spec/analyzers/SPEC.md#issues).

This comprehensive implementation enhances the depth of information available and facilitates better issue tracking and
resolution.

```json
[
  {
    "type": "issue",
    "check_name": "unit-no-unknown",
    "description": "Unexpected unknown unit \"pp\" (unit-no-unknown)",
    "content": {
      "body": "Error found in unit-no-unknown. See https://stylelint.io/user-guide/rules/unit-no-unknown for more details."
    },
    "categories": [
      "Style"
    ],
    "location": {
      "path": "src/app.module.scss",
      "lines": {
        "begin": 2,
        "end": 2
      },
      "positions": {
        "begin": {
          "line": 2,
          "column": 14
        },
        "end": {
          "line": 2,
          "column": 16
        }
      }
    },
    "severity": "major",
    "fingerprint": "d87ffdeffd6374e748011a709a4d648a"
  }
]
```

You can see an example of the widget and how errors are displayed
in [Merge Request #1](https://gitlab.com/gitlab-formatters/stylelint-formatter-gitlab/-/merge_requests/1).

This merge request includes detailed examples and explanations of the widget's functionality, showcasing how it
integrates with GitLab to display code quality issues reported by Stylelint.

## Contributing

If you'd like to contribute to this project, please read through [CONTRIBUTING.md](./CONTRIBUTING.md) file.

## Changelog

> Changelog is automatically generated based on [semantic-release](https://github.com/semantic-release/changelog)
> and [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

See the [CHANGELOG.md](./CHANGELOG.md) file for detailed lists of changes for each version.

## License

MIT License. See the [License File](./LICENSE) for more information.

## Contact

If you have any questions or suggestions, feel free to reach out by:

- Email: [s.kupletsky@gmail.com](mailto:s.kupletsky@gmail.com)
- X/Twitter: <https://x.com/zavoloklom>
- GitHub: <https://github.com/zavoloklom>
