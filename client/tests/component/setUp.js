const jsdom = require('jsdom');
const $ = require('jquery');
const m = require('module');

const originalLoader = m._load;

m._load = function hookedLoader(request, parent, isMain) {
  if (request.match(/.jpeg|.jpg|.png$/)) {
    return { uri: request };
  }

  return originalLoader(request, parent, isMain);
};

// const doc = jsdom.jsdom('<!doctype html><html><body></body></html>', {
//   url: 'http://localhost'
// });
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;
global.$ = $(global.window);

// mock calls to localStorage
global.window.localStorage = {
  getItem: () => {
    return null
  },
  setItem: () => {
    // do nothing
  }
};

Object.keys(doc.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = doc.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};
