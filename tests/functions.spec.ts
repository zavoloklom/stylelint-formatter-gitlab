import test from 'ava';
import { LinterResult, Severity } from 'stylelint';
import { getRelativePath, generateFingerprint, determineSeverity, getRuleUrl } from '../src/functions.js';

// Test getRelativePath
test('getRelativePath returns correct relative path', (t) => {
    const path = '/path/to/src/file.css';
    const context: LinterResult = {
        cwd: '/path/to',
        results: [],
        output: '',
        report: '',
        reportedDisables: [],
        errored: false,
        ruleMetadata: {},
    };
    t.is(getRelativePath(path, context), 'src/file.css');
    t.is(getRelativePath(undefined, context), 'unknown path');
});

// Test generateFingerprint
test('generateFingerprint generates unique fingerprint', (t) => {
    const data = ['path/to/file.scss', undefined, 'Unused variable "y"', '10', '5'];
    const hashes: Set<string> = new Set();
    const fingerprint = generateFingerprint(data, hashes);
    t.is(hashes.has(fingerprint), true);
    t.is(fingerprint.length, 32);
    // Should be always the same
    t.is(fingerprint, 'd071a3fe67d469d450f53b464fbf7d3e');
});

test('generateFingerprint handles hash collisions by generating a new unique hash', (t) => {
    const data = ['path/to/file.css', 'no-unused-vars', 'Unused variable "x"', '10', '5'];
    const hashes: Set<string> = new Set();
    const initialFingerprint = generateFingerprint(data, hashes);

    hashes.add(initialFingerprint);

    const dataForCollision = ['path/to/file.css', 'no-unused-vars', 'Unused variable "x"', '10', '5'];

    const newFingerprint = generateFingerprint(dataForCollision, hashes);
    t.not(initialFingerprint, newFingerprint, 'New hash should be different from the initial to avoid collision');
    t.is(hashes.has(newFingerprint), true, 'New hash should be added to the set');
    t.is(hashes.size, 2, 'There should be two unique hashes in the set now');
});

// Test determineSeverity
test('determineSeverity returns correct severity levels', (t) => {
    t.is(determineSeverity('warning'), 'minor');
    t.is(determineSeverity('error'), 'major');
    t.is(determineSeverity('' as unknown as Severity), 'info');
});

// Test getRuleUrl
test('getRuleUrl returns correct rule url', (t) => {
    const linerResultEmpty = {
        cwd: '',
        errored: false,
        output: '',
        report: '',
        reportedDisables: [],
        results: [],
        ruleMetadata: {},
    };
    const linerResultOneRule = {
        cwd: '',
        errored: false,
        output: '',
        report: '',
        reportedDisables: [],
        results: [],
        ruleMetadata: { 'unit-no-unknown': { url: 'https://stylelint.io/user-guide/rules/unit-no-unknown' } },
    };

    t.is(getRuleUrl(undefined, linerResultEmpty), undefined);
    t.is(getRuleUrl('unit-no-unknown', linerResultEmpty), undefined);
    t.is(getRuleUrl('unit-no-unknown2', linerResultOneRule), undefined);
    t.is(getRuleUrl('unit-no-unknown', linerResultOneRule), 'https://stylelint.io/user-guide/rules/unit-no-unknown');
});
