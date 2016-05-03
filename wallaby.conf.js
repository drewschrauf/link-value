module.exports = function (wallaby) {
  return {
    files: ['src/**/*.js'],
    tests: ['test/**/*.spec.js'],
    env: {
      type: 'node'
    },
    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },
    setup: function (wallaby) {
      require('jsdom-global')()
    }
  }
}
