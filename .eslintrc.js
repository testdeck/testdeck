{
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "overrides": [
        {
            "files": ["*.ts"],
            "extends": [
                "eslint:recommended",
                "plugin:@typescript-eslint/recommended",
                "plugin:@typescript-eslint/recommended-requiring-type-checking",
                "plugin:@typescript-eslint/strict"
            ],
            "parserOptions": {
                "ecmaVersion": "latest",
                "project": "./tsconfig.eslint.json"
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
}
