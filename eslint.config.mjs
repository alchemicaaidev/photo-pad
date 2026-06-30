import next from "eslint-config-next";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = [
  ...next,
  {
    name: "jsx-a11y/recommended",
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },
];

export default eslintConfig;
