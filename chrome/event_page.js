chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
        $.getJSON('default_opts.json', function(defs) {
            _.each(defs, function(v,k) {
                var save = {};
                save[k] = v;
                chrome.storage.sync.set(save);
	    });
        });
    }
});
