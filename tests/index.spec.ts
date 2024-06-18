import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LintResult, LinterResult } from 'stylelint';
import test from 'ava';
import * as TJS from 'typescript-json-schema';
import { Schema } from 'ajv/lib/types';
import { Ajv } from 'ajv';
import gitlabCodeQualityFormatter from '../src/index.js';
import type { Issue } from '../src/types.d.ts';

// Get the directory name from the URL of the current module
const DIRNAME = dirname(fileURLToPath(import.meta.url));

// Mock Stylelint results, see https://stylelint.io/developer-guide/formatters/
const mockResults: LintResult[] = [
    {
        source: '/path/to/file.css',
        deprecations: [
            {
                text: 'Feature X has been deprecated and will be removed in the next major version.',
                reference: 'https://stylelint.io/docs/feature-x.md',
            },
        ],
        invalidOptionWarnings: [
            {
                text: 'Invalid option X for rule Y',
            },
        ],
        parseErrors: [],
        errored: true,
        warnings: [
            {
                line: 1,
                column: 9,
                endLine: 3,
                endColumn: 2,
                rule: 'prettier/prettier',
                severity: 'warning',
                text: 'Delete "·····" (prettier/prettier)',
            },
            {
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 2,
                rule: 'unit-no-unknown',
                severity: 'error',
                text: 'Unexpected unknown unit "pp" (unit-no-unknown)',
            },
        ],
    },
    {
        source: '/path/to/correct-file.css',
        deprecations: [],
        invalidOptionWarnings: [],
        parseErrors: [],
        errored: false,
        warnings: [],
        ignored: true,
    },
    {
        source: '/path/to/another-file.css',
        deprecations: [],
        invalidOptionWarnings: [],
        parseErrors: [],
        errored: true,
        warnings: [
            {
                line: 1,
                column: 9,
                rule: 'scss/no-global-function-names',
                severity: 'warning',
                text: 'Expected map.merge instead of map-merge (scss/no-global-function-names)',
            },
        ],
    },
];

const mockReturnValue: LinterResult = {
    cwd: '/path/to',
    results: mockResults,
    output: '',
    report: '',
    reportedDisables: [],
    errored: false, // `true` if there were any warnings with "error" severity
    maxWarningsExceeded: {
        // Present if Stylelint was configured with a `maxWarnings` count
        maxWarnings: 10,
        foundWarnings: 15,
    },
    ruleMetadata: {
        'unit-no-unknown': {
            url: 'https://stylelint.io/user-guide/rules/unit-no-unknown',
        },
    },
};

const expectedReport: Issue[] = [
    {
        type: 'issue',
        check_name: 'prettier/prettier',
        description: 'Delete "·····" (prettier/prettier)',
        content: {
            body: 'Error found in prettier/prettier.',
        },
        categories: ['Style'],
        location: {
            path: 'file.css',
            lines: {
                begin: 1,
                end: 3,
            },
            positions: {
                begin: {
                    line: 1,
                    column: 9,
                },
                end: {
                    line: 3,
                    column: 2,
                },
            },
        },
        severity: 'minor',
        fingerprint: '81d5f908b6c8e2e6591919bd9e1bd508',
    },
    {
        type: 'issue',
        check_name: 'unit-no-unknown',
        description: 'Unexpected unknown unit "pp" (unit-no-unknown)',
        content: {
            body: 'Error found in unit-no-unknown. See https://stylelint.io/user-guide/rules/unit-no-unknown for more details.',
        },
        categories: ['Style'],
        location: {
            path: 'file.css',
            lines: {
                begin: 1,
                end: 1,
            },
            positions: {
                begin: {
                    line: 1,
                    column: 1,
                },
                end: {
                    line: 1,
                    column: 2,
                },
            },
        },
        severity: 'major',
        fingerprint: 'd9752f8a0a21a5d6c96d947cb21bd0ed',
    },
    {
        type: 'issue',
        check_name: 'scss/no-global-function-names',
        description: 'Expected map.merge instead of map-merge (scss/no-global-function-names)',
        content: {
            body: 'Error found in scss/no-global-function-names.',
        },
        categories: ['Style'],
        location: {
            path: 'another-file.css',
            lines: {
                begin: 1,
                end: 1,
            },
            positions: {
                begin: {
                    line: 1,
                    column: 9,
                },
                end: {
                    line: 1,
                    column: 9,
                },
            },
        },
        severity: 'minor',
        fingerprint: 'e415b1dceb3f3acc23b9639c8d0dcd6d',
    },
];

test('gitlabCodeQualityFormatter returns correct report', (t) => {
    const generatedReport = gitlabCodeQualityFormatter(mockResults, mockReturnValue);
    t.is(generatedReport, JSON.stringify(expectedReport));

    // Validate result with schema
    const program = TJS.getProgramFromFiles([join(DIRNAME, '../src/types.d.ts')]);
    const schema = TJS.generateSchema(program, 'Issue', {}) as Schema;
    const ajv = new Ajv({ strict: false });
    const validate = ajv.compile(schema);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const messages = JSON.parse(generatedReport);

    // eslint-disable-next-line
    const allValid = messages.every((message: any) => {
        const valid = validate(message);
        if (!valid) {
            // eslint-disable-next-line no-console
            console.log(validate.errors);
        }
        return valid;
    });

    t.true(allValid, 'JSON data is valid according to the schema');
});
