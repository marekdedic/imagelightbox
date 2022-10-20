/* eslint-env node */

const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "production",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        onlyCompileBundledFiles: true,
                    },
                },
            },
        ],
    },
    externals: {
        jquery: "jQuery",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        filename: "[name].js",
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
            }),
        ],
    },
};
