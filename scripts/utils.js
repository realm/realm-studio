
/**
 * Wraps an action callback with something that prints errors before exiting with an appropriate status code
 */
module.exports = {
  wrapCommand: (callback) => {
    return (...args) => {
      callback(...args).then(undefined, err => {
        console.error(err.stack);
        process.exit(1);
      });
    };
  },
};
