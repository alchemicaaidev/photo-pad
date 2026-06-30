import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import nextConfig from 'eslint-config-next';

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  ...nextConfig
];


export default eslintConfig;
