/*! (C) 2017 Andrea Giammarchi & Claudio D'angelis */

// used to assert conditions
// equivalent of console.assert(...args)
// tressa(true)
// tressa(true, 'what am I testing')
function tressa(condition, message) {
  try {
    console.assert.apply(console, arguments);
    // in order to read or know failures on browsers
    if (!condition) tressa.exitCode = 1;
    if (typeof message === 'string' && condition) {
      tressa.console.log('#green(✔) ' + message);
    }
  } catch(error) {
    tressa.exitCode = 1;
    tressa.console.error('#red(✖) ' + error);
  }
}

// on top of the test to show a nice title
// test.title('My Library');
tressa.title = function (title) {
  tressa.testName = title;
  tressa.console.info('# ' + title);
  console.time(title);
};

// for asynchronous tests
/*
tressa.async(done => {
  // later on ...
  tressa(1);
  setTimeout(() => {
    tressa(2);
    done();
  });
});
*/
tressa.async = function (fn, timeout) {
  var timer = setTimeout(
    function () {
      tressa(false, '*timeout* ' + (fn.name || fn));
    },
    timeout || tressa.timeout
  );
  fn(function () { clearTimeout(timer); });
};

// default expiring timeout
tressa.timeout = 10000;

// for synchronous tests (alias)
tressa.assert = tressa.sync = tressa;

try {
  // to log Markdown like strings
  tressa.console = require('consolemd');
} catch(o_O) {
  tressa.console = console;
}
tressa.log = tressa.console.log;

// to end on browsers
tressa.end = function () {
  var title = tressa.testName;
  if (title) {
    console.log(Array(title.length + 10).join('─'));
    console.timeEnd(title);
    console.log('');
    tressa.testName = '';
  }
};

try {
  // show stats on exit, if any, on node
  if (!process.browser) process.on('exit', function () {
    tressa.end();
    process.exit(tressa.exitCode || 0);
  });
  module.exports = tressa;
} catch(o_O) {}
