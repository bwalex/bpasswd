// This is an active module of the bpasswd Add-on
exports.main = function(options) {

    var data = require("sdk/self").data;
    var tabs = require("sdk/tabs");
    var clipboard = require("sdk/clipboard");
    var prefs = require("sdk/preferences/service");
    var { Hotkey } = require("sdk/hotkeys");
    var _ = require("lodash");
    var { URI } = require("./uri");

    const { id } = require("sdk/self");
    const PREF_PATH = "extensions." + id + ".";

    var _pref = function(p) { return PREF_PATH + p };

    var _domain = function(url) {
        var u = URI(url);
        var domain = u.domain();
        var tld = u.tld();
        return domain.substring(0, domain.length-tld.length-1);
    }

    var pane = require("sdk/panel").Panel({
        contentURL: data.url("panel.html"),
        contentScriptFile: [
            data.url("bpasswd/enc_dec.js"),
            data.url("bpasswd/crypto_helper.js"),
            data.url("bpasswd/sha256.js"),
            data.url("bpasswd/sha1.js"),
            data.url("bpasswd/hmac.js"),
            data.url("bpasswd/blowfish.js"),
            data.url("bpasswd/bcrypt.js"),
            data.url("bpasswd/bpasswd.js"),
            data.url("vendor/jquery-2.0.3.min.js"),
            data.url("vendor/number-polyfill.js"),
            data.url("panel.js")
        ]
    });

    var widget = require("sdk/widget").Widget({
        label: "BPasswd2",
        id: "bpasswd2-widget",
        contentURL: data.url("key24.png"),
        panel: pane
    });

    var tbb = require("toolbarwidget").ToolbarWidget({
        toolbarID: "nav-bar",
        label: "BPasswd2",
        id: "bpasswd2-button",
        contentURL: data.url("key24.png"),
        panel: pane
    });

    if (options.loadReason == "install") {
        var defs = data.load("default_opts.json");

        _.each(JSON.parse(defs), function(v,k) {
            if (typeof(v) === "object") {
                prefs.set(_pref(k), JSON.stringify(v));
            } else {
                prefs.set(_pref(k), v);
            }
        });

        prefs.set("services.sync.prefs.sync." + _pref("global_options"), true);
        prefs.set("services.sync.prefs.sync." + _pref("salt_options"), true);
    }

    var genHotkey = function() {
        return Hotkey({
            combo: JSON.parse(prefs.get(_pref("global_options"))).hotkey,
            onPress: function() {
            if (pane.isShowing) {
                pane.hide();
            } else {
                pane.show();
            }
            }
        });
    }

    var toggleKey = genHotkey();

    pane.on("show", function() {
        var global_prefs = JSON.parse(prefs.get(_pref("global_options")));
        var site_prefs = JSON.parse(prefs.get(_pref("salt_options")));

        pane.port.emit("show", {
            currentUrl: _domain(tabs.activeTab.url),
            "global_options" : global_prefs,
            "salt_options"   : site_prefs
        });
    });

    pane.on("hide", function() {
        pane.port.emit("hide");
    });

    pane.port.on("copy", function (text) {
        clipboard.set(text);
    });

    pane.port.on("set-pref", function(p, v) {
        if (typeof(v) === "object")
            v = JSON.stringify(v);

        prefs.set(_pref(p), v);
    });

    pane.port.on("resize", function(sizes) {
        pane.resize(sizes.width, sizes.height);
    });

    pane.port.on("show-opts", function () {
        pane.hide();

        tabs.open({
            url: data.url("options.html"),
            onReady: function(tab) {
                worker = tab.attach({
                    contentScriptFile: [
                        data.url("vendor/lodash.min.js"),
                        data.url("vendor/jquery-2.0.3.min.js"),
                        data.url("vendor/number-polyfill.js"),
                        data.url("vendor/backbone-min.js"),
                        data.url("global_controller.js"),
                        data.url("options.js")
                    ]
                });

                worker.port.on("get-pref", function(p) {
                    worker.port.emit("pref-resp", p, prefs.get(_pref(p)));
                });

                worker.port.on("set-pref", function(p, v) {
                    if (typeof(v) === "object")
                        v = JSON.stringify(v);

                    prefs.set(_pref(p), v);
                    if (p == "global_options") {
                        toggleKey.destroy();
                        toggleKey = genHotkey();
                    }
                });
            }
        });
    });
}
