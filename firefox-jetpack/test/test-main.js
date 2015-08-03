const { Cu } = require('chrome');
const { Loader } = require('sdk/test/loader');
const { data } = require('sdk/self');
const { open, focus, close } = require('sdk/window/helpers');
const { setTimeout } = require('sdk/timers');
const { getMostRecentBrowserWindow } = require('sdk/window/utils');
const { partial } = require('sdk/lang/functional');
const { gc } = require('sdk/test/memory');
const { isTravisCI } = require("sdk/test/utils");
const packaging = require("@loader/options");
const openBrowserWindow = partial(open, null, {features: {toolbar: true}});
const openPrivateBrowserWindow = partial(open, null,
                                         {features: {toolbar: true, private: true}});

function getWidget(buttonId, window = getMostRecentBrowserWindow()) {
  const { CustomizableUI } = Cu.import('resource:///modules/CustomizableUI.jsm', {});
  const { AREA_NAVBAR } = CustomizableUI;
  let widgets = CustomizableUI.getWidgetIdsInArea(AREA_NAVBAR).
    filter((id) => id.startsWith('toggle-button--') && id.endsWith(buttonId));
  if (widgets.length === 0)
    throw new Error('Widget with id `' + buttonId +'` not found.');
  if (widgets.length > 1)
    throw new Error('Unexpected number of widgets: ' + widgets.length)
  return CustomizableUI.getWidget(widgets[0]).forWindow(window);
};

var { main } = require("../lib/main");

exports["test main"] = function(assert) {
  assert.pass("Unit test running!");
};

exports["test main async"] = function(assert, done) {
  assert.pass("async Unit test running!");
  done();
};

exports['test button added'] = function(assert) {
  main({loadReason: "install"});
  let { node } = getWidget('bpasswd2-button');

  assert.ok(!!node, 'The button is in the navbar');

  node.click();

  assert.ok(true, 'The button can be clicked');
};

require("sdk/test").run(exports);
