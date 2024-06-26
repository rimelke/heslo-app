const { compilerOptions } = require("./tsconfig.json");

const alias = Object.keys(compilerOptions.paths).reduce(
  (acc, key) => ({
    ...acc,
    [key.replace("/*", "")]: `./${compilerOptions.paths[key][0].replace(
      "/*",
      ""
    )}`,
  }),
  {
    src: "./src",
  }
);

module.exports = (api) => {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [".ts", ".tsx", ".jsx", ".js", ".json"],
          alias,
        },
      ],
      [
        "module-resolver",
        {
          alias: {
            crypto: "react-native-quick-crypto",
            stream: "stream-browserify",
            buffer: "@craftzdog/react-native-buffer",
          },
        },
        "react-native-quick-crypto",
      ],
      "inline-dotenv",
    ],
  };
};
