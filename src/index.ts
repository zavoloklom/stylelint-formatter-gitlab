import { LinterResult, LintResult } from 'stylelint';
import type { Issue } from './types.d.ts';
import { getRelativePath, generateFingerprint, determineSeverity, getRuleUrl } from './functions.js';

const gitlabCodeQualityFormatter = (results: LintResult[], returnValue: LinterResult): string => {
    const hashes = new Set<string>();
    const issues: Issue[] = results.flatMap((result) =>
        result.warnings.map((message) => ({
            type: 'issue',
            check_name: message.rule ?? 'unknown_rule',
            description: message.text,
            content: {
                body: `Error found in ${message.rule}.${
                    getRuleUrl(message.rule, returnValue)
                        ? ` See ${getRuleUrl(message.rule, returnValue)} for more details.`
                        : ''
                }`,
            },
            categories: ['Style'],
            location: {
                path: getRelativePath(result.source, returnValue),
                lines: {
                    begin: message.line,
                    end: message.endLine ?? message.line,
                },
                positions: {
                    begin: {
                        line: message.line,
                        column: message.column,
                    },
                    end: {
                        line: message.endLine ?? message.line,
                        column: message.endColumn ?? message.column,
                    },
                },
            },
            severity: determineSeverity(message.severity),
            fingerprint: generateFingerprint(
                [result?.source, message.rule, message.text, `${message.line}`, `${message.column}`],
                hashes,
            ),
        })),
    );

    return JSON.stringify(issues);
};

export default gitlabCodeQualityFormatter;
