import { promises as fsPromises } from "fs";
import path from "path";

import glob from "glob";
import { Compiler } from "webpack";

export class OnEmitPlugin {
  constructor(private fn: (compilation?: any) => void) {}

  apply(compiler: Compiler) {
    compiler.hooks.emit.tap(this.constructor.name, this.fn);
  }
}

export default {
  entry: glob.sync("./src/**/*.{css,scss}"),
  mode: "none",
  plugins: [
    new OnEmitPlugin((compilation) => {
      // prevent output of default js assets
      Object.keys(compilation.assets).forEach((asset) => {
        delete compilation.assets[asset];
      });

      // write the s?css type files
      compilation.modules
        .filter((mod: any) => mod._source?._value)
        .map((mod: any) =>
          fsPromises.writeFile(`${mod.resource}.d.ts`, mod._source._value)
        );
    }),
  ],
  stats: {
    cached: false,
    cachedAssets: false,
    children: false,
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentContext: path.resolve(__dirname, "src"),
                localIdentName: "[path][name]_[local]",
                exportLocalsConvention: "camelCase",
                exportOnlyLocals: true,
              },
            },
          }, // translates CSS into CommonJS
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: ["./"],
              },
            },
          }, // compiles Sass to CSS, using Node Sass by default
        ],
      },
    ],
  },
};
