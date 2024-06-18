import { createHash } from 'node:crypto';
import { relative } from 'node:path';
import type { LinterResult, Severity as StylelintSeverity } from 'stylelint';
import type { Severity } from './types.d.ts';

export const getRelativePath = (path: string | undefined, context: LinterResult): string => {
    return path ? relative(context.cwd, path) : 'unknown path';
};

export const getRuleUrl = (rule: string | undefined, linterResult: LinterResult): string | undefined => {
    if (!rule || !linterResult.ruleMetadata) {
        return undefined;
    }

    const metadata = linterResult.ruleMetadata[rule];
    return metadata ? metadata.url : undefined;
};

export const generateFingerprint = (data: (string | undefined)[], hashes: Set<string>): string => {
    const hash = createHash('md5');

    data.forEach((part) => {
        if (part) {
            hash.update(part.toString());
        }
    });

    // Hash collisions should not happen, but if they do, a random hash will be generated.
    const hashCopy = hash.copy();
    let digest = hash.digest('hex');
    if (hashes.has(digest)) {
        hashCopy.update(Math.random().toString());
        digest = hashCopy.digest('hex');
    }

    hashes.add(digest);

    return digest;
};

export const determineSeverity = (severity: StylelintSeverity): Severity => {
    switch (severity) {
        case 'error':
            return 'major';
        case 'warning':
            return 'minor';
        default:
            return 'info';
    }
};
