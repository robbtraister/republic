import path from "path";
import webpack from "webpack";

import { CleanWebpackPlugin } from "clean-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import HtmlWebpackTagsPlugin from "html-webpack-tags-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import TerserJSPlugin from "terser-webpack-plugin";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

import { name, version } from "./package.json";

const PRODUCTION_PATTERN = /^prod/i;

const buildVersion = process.env.BUILD_VERSION || version;

class OnBuildPlugin {
  private fn: () => void;

  constructor(fn: () => void) {
    this.fn = fn;
  }

  apply(compiler) {
    compiler.hooks.done.tap(this.constructor.name, this.fn);
  }
}

let built = false;

const appEntry = "./src/ui";
const hmrEntry = require.resolve("react-dev-utils/webpackHotDevClient");
const overlayEntry = require.resolve("react-dev-utils/refreshOverlayInterop");

export default function (_, argv: any = {}) {
  const isProd =
    Boolean(argv.production) ||
    PRODUCTION_PATTERN.test(process.env.NODE_ENV || "") ||
    PRODUCTION_PATTERN.test(argv.mode || "");

  const hmr = !isProd && argv.hmr !== false;
  const https = argv.https !== false;
  const linting = argv.linting !== false;
  const pathPrefix = argv.pathPrefix === false ? "" : `/${name}`;
  const preact = isProd && argv.preact !== false;
  const vendors = !isProd && argv.vendors !== false;

  // dev should default to watch=true; prod should default to watch=false
  const watch = isProd ? Boolean(argv.watch) : argv.watch !== false;

  const liveReload = watch && !hmr && Boolean(argv.liveReload);

  const port = Number(argv.port) || 8080;

  return {
    entry: hmr ? [hmrEntry, appEntry] : appEntry,
    devtool: isProd ? "source-map" : "eval-source-map",
    mode: isProd ? "production" : "development",
    optimization: isProd
      ? {
          minimize: true,
          splitChunks: {
            chunks: "all",
          },
          minimizer: [
            new TerserJSPlugin({
              sourceMap: true,
            }),
            new OptimizeCSSAssetsPlugin({}),
          ],
        }
      : undefined,
    output: {
      filename: isProd ? "[name].[contenthash].js" : "[name].js",
      path: path.resolve(__dirname, "docs"),
      publicPath: `${pathPrefix}/`,
    },
    plugins: [
      new OnBuildPlugin(() => {
        built = true;
      }),
      new webpack.DefinePlugin({
        "process.env.BUILD_VERSION": JSON.stringify(buildVersion),
        "process.env.PATH_PREFIX": JSON.stringify(pathPrefix),
      }),
      new FaviconsWebpackPlugin({
        logo: "./src/images/favicon.ico",
        favicons: {
          appName: "Application",
        },
      }),
      new HtmlWebpackPlugin({
        minify: isProd,
        scriptLoading: "defer",
        template: "./src/ui/index.html",
        title: "Re:Public Diabetes Tracker",
        version: buildVersion,
      }),
      isProd &&
        new HtmlWebpackPlugin({
          filename: "404.html",
          minify: false,
          pathPrefix,
          scriptLoading: "defer",
          template: "./src/ui/redirect.html",
          title: "Redirect",
          version: buildVersion,
        }),
      linting &&
        new ForkTsCheckerWebpackPlugin({
          eslint: {
            enabled: true,
            files: ["src/**/*.{ts,tsx}"],
          },
          logger: {
            devServer: false,
          },
          typescript: {
            configFile: path.resolve(__dirname, "tsconfig.json"),
          },
        }),
      isProd &&
        new MiniCssExtractPlugin({
          filename: "[name].[contenthash].css",
          chunkFilename: "[id].[contenthash].css",
        }),
      isProd && new CleanWebpackPlugin(),
      // because the `vendors.js` artifact is built separately, HtmlWebpackPlugin doesn't know about it
      // HtmlWebpackTagsPlugin manually injects a <script src="/vendors.js"> tag into the index.html artifact
      vendors &&
        new HtmlWebpackTagsPlugin({
          files: ["index.html"],
          tags: ["vendors.js"],
          append: false,
        }),
      // this replaces imports of vendor libs with references to a static require function imported above
      // see ./webpack.vendors.js for configuration to build the vendors script
      vendors &&
        new webpack.DllReferencePlugin({
          context: __dirname,
          manifest: require("./public/vendors-manifest.json"),
        }),
      hmr &&
        new ReactRefreshWebpackPlugin({
          overlay: {
            entry: hmrEntry,
            // The expected exports are slightly different from what the overlay exports,
            // so an interop is included here to enable feedback on module-level errors.
            module: overlayEntry,
            // Since we ship a custom dev client and overlay integration,
            // the bundled socket handling logic can be eliminated.
            sockIntegration: false,
          },
        }),
    ].filter(Boolean),
    resolve: {
      alias: preact
        ? {
            react: "preact/compat",
            "react-dom": "preact/compat",
          }
        : undefined,
      extensions: [".tsx", ".ts", ".jsx", ".js", ".mjs"],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.resolve(__dirname, "tsconfig.json"),
        }),
      ],
    },
    stats: {
      cached: false,
      cachedAssets: false,
      children: false,
    },
    watch,
    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: [
            isProd
              ? {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    sourceMap: true,
                  },
                }
              : "style-loader",
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: "css-loader",
              options: {
                sourceMap: isProd,
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: "css-loader",
              options: {
                sourceMap: isProd,
                modules: {
                  localIdentContext: path.resolve(__dirname, "src", "ui"),
                  localIdentName: isProd
                    ? "[local]__[contenthash:base64:5]"
                    : "[path][name]_[local]",
                  exportLocalsConvention: "camelCase",
                },
              },
            }, // translates CSS into CommonJS
            {
              loader: "sass-loader",
              options: {
                sourceMap: isProd,
                sassOptions: {
                  includePaths: ["./"],
                },
              },
            }, // compiles Sass to CSS, using Node Sass by default
          ],
        },
        {
          test: /\.(jpg|png|gif)$/,
          use: "file-loader",
        },
        {
          test: /\.(tsx|ts)$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                compilerOptions: {
                  // module must be `commonjs` for webpack CLI
                  // but we need it to be `esnext` for proper tree-shaking
                  module: "esnext",
                },
                configFile: path.resolve(__dirname, "tsconfig.json"),
                transpileOnly: true,
                experimentalWatchApi: true,
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          enforce: "pre",
          test: /\.[jt]sx?$/,
          loader: "source-map-loader",
        },
        {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          use: "url-loader?limit=10000&mimetype=application/font-woff",
        },
        {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          use: "url-loader?limit=10000&mimetype=application/font-woff",
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: "url-loader?limit=10000&mimetype=application/octet-stream",
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          use: "file-loader",
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: "@svgr/webpack",
        },
      ],
    },
    devServer: {
      compress: true,
      contentBase: path.resolve(__dirname, "public"),
      contentBasePublicPath: `${pathPrefix}/`,
      disableHostCheck: true,
      historyApiFallback: {
        index: `${pathPrefix}/index.html`,
      },
      host: "0.0.0.0",
      hot: hmr,
      https,
      injectClient: liveReload,
      liveReload,
      open: argv.open !== false,
      openPage: `http${https ? "s" : ""}://localhost:${port}${pathPrefix}`,
      port,
      publicPath: `${pathPrefix}/`,
      transportMode: hmr ? "ws" : "sockjs",
      watchContentBase: false,
      watchOptions: {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: watch ? /node_modules/ : /./,
      },
      before(app) {
        if (argv.healthCheck !== false) {
          app.get("/health-check", (_req, res) => {
            res.send(`{"status":"${built ? "healthy" : "pending"}"}`);
          });
        }

        app.use(`${pathPrefix}/`, async (req, res, next) => {
          const { createApp } = await import("./mocks/express/app");
          createApp()(req, res, next);
        });
      },
      // proxy: argv.fakes
      //   ? undefined
      //   : {
      //       "/api": {
      //         target: API_TARGET,
      //         changeOrigin: true,
      //       },
      //     },
    },
  };
}
