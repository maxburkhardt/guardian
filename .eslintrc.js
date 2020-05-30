module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    settings: {
        react: {
            version: "detect",
        },
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint'
    ],
}