module.exports = {
   env: {
      browser: true,
      es2021: true,
   },
   extends: ["airbnb-base", "plugin:prettier/recommended"],
   parser: "@typescript-eslint/parser",
   parserOptions: {
      ecmaVersion: 12,
      sourceType: "module",
   },
   plugins: ["@typescript-eslint"],
   rules: {
      indent: ["off"],

      "@typescript-eslint/indent": ["error", 3, { SwitchCase: 1 }],

      // 不使用tab
      "no-tabs": "error",

      // 双引号
      quotes: ["error", "double"],

      // import 排序
      "import/order": "off",

      // 强制使用 Windows 换行符
      "linebreak-style": "off",

      // for in 循环使用if
      "guard-for-in": "off",

      // 不使用new
      "no-new": "off",

      // 引入文件必须再packagejson声明
      "import/no-extraneous-dependencies": "off",

      // 自增 自减
      "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],

      // 箭头函数使用括号
      "arrow-parens": ["error", "always"],

      // 该规则可以强制或禁止使用命名函数表达式。
      "func-names": "off",

      // 未使用变量
      "no-unused-vars": "warn",

      // 修改函数参数
      "no-param-reassign": "off",

      // 只有一个使用默认导出
      "import/prefer-default-export": "off",
   },
};
