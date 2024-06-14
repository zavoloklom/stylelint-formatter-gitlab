module.exports = {
    root: true,
    env: {
        node: true,
        es2024: true
    },
    globals: {
        process: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: 'tsconfig.eslint.json',
        tsconfigRootDir : __dirname,
        sourceType: 'module',
        ecmaVersion: 2024,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:sonarjs/recommended-legacy",
        "airbnb-base",
        "airbnb-typescript/base",
        "plugin:import/typescript",
        "plugin:prettier/recommended"
    ],
    plugins: [
        "@typescript-eslint",
        "sonarjs",
        "import",
        "prettier"
    ],
    rules: {
        // The core 'no-unused-vars' rules (in the eslint:recommended ruleset) does not work with type definitions.
        "no-unused-vars": 0,
        "@typescript-eslint/no-unused-vars": [
            2,
            {
                "args": "none"
            }
        ],
        // Prettier
        "prettier/prettier": 2,
        "arrow-body-style": 0,
        "prefer-arrow-callback": 0,
        // JS
        "prefer-rest-params": 0,
        // SonarJS
        "sonarjs/cognitive-complexity": 1,
        // Typescript
        "@typescript-eslint/triple-slash-reference": [
            2,
            {
                "path": "never",
                "types": "always",
                "lib": "always"
            }
        ],
        // Import
        "import/prefer-default-export": 0,
        "import/no-default-export": 0,
        'import/extensions': ['error', 'ignorePackages', {
            'ts': 'always',
            'tsx': 'never',
            'js': 'never',
            'jsx': 'never'
        }],
        "import/order": [
            2,
            {
                "groups": [
                    "builtin",
                    "external",
                    "internal"
                ],
                // "pathGroups": [
                //     {
                //         "pattern": "react",
                //         "group": "external",
                //         "position": "before"
                //     },
                //     {
                //         "pattern": "./*.scss",
                //         "group": "sibling",
                //         "position": "after"
                //     }
                // ],
                // "pathGroupsExcludedImportTypes": [
                //     "react"
                // ]
            }
        ],
    },
    ignorePatterns: ["node_modules", "dist", ".tsimp", "coverage"],
}
