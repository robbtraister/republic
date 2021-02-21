import path from "path";
import webpack from "webpack";
import TerserJSPlugin from "terser-webpack-plugin";

import getWebpackConfig from "./webpack.config";

function getDependencies(rootDir) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Object.keys(require(path.join(rootDir, "package.json")).dependencies || {})
      // react-query/devtools are not exposed via the root import
      .concat("react-query/devtools")
      .filter((dep) => {
        // verify that an import exists for this module
        try {
          require.resolve(dep);
        } catch (e) {
          if (e.code === "MODULE_NOT_FOUND") {
            return false;
          }
        }
        return true;
      })
  );
}

export default (env, argv) => {
  argv.linting = false;
  argv.vendors = false;

  const baseConfig = getWebpackConfig(env, argv);

  return {
    // use the same basic configuration as other builds (primarily module.rules)
    ...baseConfig,
    devtool: "cheap-source-map",
    // build a static script that includes each of the following modules
    entry: {
      vendors: getDependencies(__dirname),
    },
    optimization: {
      minimize: baseConfig.mode === "production",
      splitChunks: false,
      minimizer: [
        new TerserJSPlugin({
          extractComments: false,
          sourceMap: true,
        }),
      ],
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "public"),
      // expose the modules via a global require function called `vendors_abc123` (or whatever)
      library: "[name]_[hash]",
    },
    performance: {
      maxAssetSize: 100 * 2 ** 20, // 100MB
      maxEntrypointSize: 100 * 2 ** 20, // 100MB
    },
    plugins: [
      // export a manifest file to be used by dev config
      new webpack.DllPlugin({
        path: path.join(__dirname, "public", "[name]-manifest.json"),
        name: "[name]_[hash]",
      }),
    ],
    // don't use the TS resolve configuration
    resolve: undefined,
    watch: false,
  };
};
