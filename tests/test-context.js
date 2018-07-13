require("babel-polyfill");

var context = require.context('.', true, /\.test\.(js|jsx)$/);
context.keys().forEach(context);

// needed for code coverage, all files from 'dist' folder are reported
var coverageContext = require.context('../dist/', true, /\.js$/);
coverageContext.keys().forEach(coverageContext);

