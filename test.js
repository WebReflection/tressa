var test = require('./');

test.title('Simple Test');

// test directly
test(1 === 1, '_one_ is _one_');
test(1); // silent OK
test(0); // error shown
test(0 === 1, 'zero is one');

// same via sync
test.assert(1);
test.assert(0);
test.sync(1, 'all good');
test.sync(0, 'fail');

// test asynchronously
test.async(function (done) {
  setTimeout(function () {
    // you can log via Markdown
    test.log('## Async');
    test(1, 'Async *OK*');
    test(0, 'Async *issue*');
    done();
  }, 250);
});

// force expiration
test.async(
  function goingToExpire(done) {
    setTimeout(function () {
      test.log('## Expired Async');
      test(0, 'expired');
      done();
    },
    200);
  },
  // passing a delay in ms
  // default timeout is 10000 (10 seconds)
  100
);
