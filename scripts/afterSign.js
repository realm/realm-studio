const { notarizeMacApp } = require("./mac/notarize");

exports.default = async (context) => {
  console.log("electron-builder.afterSign hook triggered.");

  switch (context.electronPlatformName) {
    case "darwin":
      await notarizeMacApp(context);
      break
  }
};