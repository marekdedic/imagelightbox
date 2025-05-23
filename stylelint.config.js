/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard", "stylelint-prettier/recommended"],
  plugins: ["stylelint-no-unsupported-browser-features"],
  rules: {
    "color-function-notation": "legacy",
    "media-feature-range-notation": "prefix",
    "plugin/no-unsupported-browser-features": [
      true,
      {
        severity: "warning",
      },
    ],
    "selector-class-pattern": "ilb-.*",
    "selector-id-pattern": "ilb-.*",
  },
};
