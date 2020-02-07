/**
 * Require this script using the -r runtime option to make an Electron app log any error messages to the console
 */

const Electron = require("electron");
const { inspect } = require("util");

const showErrorBox = Electron.dialog.showErrorBox;
Electron.dialog.showErrorBox = function() {
  const [title, content] = arguments;
  console.error("showErrorBox called with", { title, content });
  showErrorBox.call(this, ...arguments);
};
