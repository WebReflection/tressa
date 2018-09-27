export default function (context = document.body, {allowHTML = true} = {}) {
  const {assert, time, timeEnd} = console;

  // Keep track of timers ourselves (only approximate to that in console)
  const htmlMsg = ({element, text, backgroundColor, textColor}) => {
    const elem = document.createElement(element || 'span');
    elem[allowHTML ? 'innerHTML' : 'textContent'] = text;
    if (backgroundColor) elem.style.backgroundColor = backgroundColor;
    if (textColor) elem.style.color = textColor;
    return elem;
  };
  const htmlWarn = (msg) => {
    const warning = htmlMsg({
      text: msg,
      backgroundColor: 'lightyellow',
      textColor: 'black'
    });
    context.append(warning, document.createElement('br'));
  };
  const htmlLog = (msg) => {
    const log = htmlMsg({
      text: msg
    });
    context.append(log, document.createElement('br'));
  };
  const timers = {};
  console.time = function (label) {
    if (label in timers) {
        htmlWarn(`Timer "${label}" already exists.`);
        return;
    }
    timers[label] = new Date();
    return time.apply(console, arguments);
  };
  console.timeEnd = function (label) {
    if (!(label in timers)) {
      htmlWarn(`Timer "${label}" doesn't exist.`);
      return;
    }
    var elapsed = new Date() - timers[label];
    htmlLog(`${label}: ${elapsed}ms`);
    delete timers[label];
    return timeEnd.apply(console, arguments);
  };
  console.assert = function (passed, stringOrObj, ...args) {
    if (!passed) {
      if (!stringOrObj || typeof stringOrObj !== 'object') {
        const assertionFailed = htmlMsg({
          text: 'Assertion failed: ',
          backgroundColor: 'lightpink',
          textColor: 'purple'
        });
        const message = htmlMsg({
          text: stringOrObj === undefined ? '' : stringOrObj,
          textColor: 'deeppink'
        });
        assertionFailed.append(message);
        context.append(assertionFailed, document.createElement('br'));
      } else {
        // Todo: Handle objects if user passes
      }
    }
    return assert.apply(console, arguments);
  };
};
