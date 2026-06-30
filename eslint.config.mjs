import next from "eslint-config-next";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = [
  ...next,
  {
    name: "jsx-a11y/recommended",
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      // Explicitly enforce at error level the 7 rules that were previously
      // set to error in the legacy .eslintrc.json.
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/label-has-associated-control": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",
    },
  },
];

export default eslintConfig;
