module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node:true
    },
    extends: [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    parserOptions: {
        parser: require.resolve('babel-eslint'),
        ecmaVersion: 2018,
        sourceType: "module"
    },
    plugins: [
        "vue"
    ],
};