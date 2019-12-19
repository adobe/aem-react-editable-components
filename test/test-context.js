var context = require.context('.', true, /\.test\.(js|jsx)$/);
context.keys().forEach(context);

// needed for code coverage, all files from 'src' folder are reported
var coverageContext = require.context('../src/', true, /\.js$/);
coverageContext.keys().forEach(coverageContext);
