// This is an active module of the bpasswd Add-on
exports.main = function(options) {

    const { id }         = require("sdk/self");
    var data             = require("sdk/self").data;
    var tabs             = require("sdk/tabs");
    var clipboard        = require("sdk/clipboard");
    var prefs            = require("sdk/preferences/service");
    var { Hotkey }       = require("sdk/hotkeys");
    var { URL, getTLD }  = require("sdk/url");
    var { ToggleButton } = require('sdk/ui/button/toggle');
    var _                = require("./lodash");

    const PREF_PATH      = "extensions." + id + ".";

    var _pref = function(p) { return PREF_PATH + p };

    var _domain = function(prefs, url) {
        var u = URL(url);
        var tld = getTLD(url) || "";
        var hostname = (u.hostname || "");
        var domain = hostname.substring(0, hostname.length-tld.length-1);
        var parts = domain.split(".");
        var site_name = parts[parts.length-1];

        for (var s in prefs.salt_options) {
            if (typeof(prefs.salt_options[s]["aliases"]) !== "undefined") {
                console.log(prefs.salt_options[s]["aliases"]);
                for (var a in prefs.salt_options[s]["aliases"]) {
                    if (prefs.salt_options[s]["aliases"][a].length == 0)
                        continue;
                    var re = new RegExp(prefs.salt_options[s]["aliases"][a], "i");
                    console.log(re);
                    if (re.test(hostname)) {
                        return s;
                    }
                }
            }
        }
        return site_name;
    }

    var tbb = ToggleButton({
        label: "BPasswd2",
        id: "bpasswd2-button",
        icon: {
          "24": data.url("key24.png")
        },
        onChange: handleChange
    });

    var pane = require("sdk/panel").Panel({
        contentURL: data.url("panel.html"),
        contentScriptFile: [
            data.url("bpasswd/bpasswd.js"),
            data.url("vendor/jquery-2.1.0.js"),
            data.url("vendor/number-polyfill.js"),
            data.url("panel.js")
        ],
        onHide: function() {
          tbb.state('window', {checked: false});
        }
    });

    function handleChange(state) {
        if (state.checked) {
            pane.show({
                position: tbb
            });
        }
    }

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
            currentUrl: _domain({"salt_options": site_prefs}, tabs.activeTab.url),
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
                        data.url("vendor/lodash.js"),
                        data.url("vendor/jquery-2.1.0.js"),
                        data.url("vendor/number-polyfill.js"),
                        data.url("vendor/backbone.js"),
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
