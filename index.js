/*! (C) 2017 Andrea Giammarchi & Claudio D'angelis */

var
  consolemd = require('consolemd'),
  exitCode = 0,
  title
;

// used to assert conditions
// equivalent of console.assert(...args)
// test(true)
// test(true, 'what am I testing')
function test(condition, message) {
  try {
    console.assert.apply(console, arguments);
    if (typeof message === 'string') {
      consolemd.log('#green(✔) ' + message);
    }
  } catch(error) {
    exitCode = 1;
    consolemd.error('#red(✖) ' + error);
  }
}

// on top of the test to show a nice title
// test.title('My Library');
test.title = function (testName) {
  title = testName;
  consolemd.info('# ' + title);
  console.time(title);
};

// for asynchronous tests
/*
test.async(done => {
  // later on ...
  test(1);
  setTimeout(() => {
    test(2);
    // once finished
    done();
  });
});
*/
test.async = function (fn, timeout) {
  var timer = setTimeout(
    function () {
      test(false, fn.name);
    },
    timeout || test.timeout
  );
  fn(function () { clearTimeout(timer); });
};

// default expiring timeout
test.timeout = 10000;

// for synchronous tests (alias)
test.sync = test;

// to log Markdown like strings
test.log = consolemd.log;

// show stats on exit, if possible
process.on('exit', function () {
  if (title) {
    console.log(Array(title.length + 10).join('─'));
    console.timeEnd(title);
    console.log('');
    title = '';
  }
  process.exit(exitCode);
});

module.exports = test;
