import { pathsToModuleNameMapper } from "ts-jest/utils";
import { compilerOptions } from "./tsconfig.json";

export default {
  collectCoverage: true,
  coveragePathIgnorePatterns: ["/mocks/", "/node_modules/"],
  moduleFileExtensions: ["tsx", "ts", "jsx", "js", "json"],
  moduleNameMapper: {
    "\\.(scss)$": "identity-obj-proxy",
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: "<rootDir>/",
    }),
  },
  transform: {
    "\\.tsx?$": "ts-jest",
  },
};
