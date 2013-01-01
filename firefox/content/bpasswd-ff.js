var bpasswd = {};

bpasswd.deriveKey = function() {
  var cost = 6;
  var salt = document.getElementById("bpasswd-salt").value;
  var pass = document.getElementById("bpasswd-password").value;
  var dkey = BPasswd.generate(salt, pass, cost);
  const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
  gClipboardHelper.copyString(dkey);
  var dkel = document.getElementById("bpasswd-dkey");
  dkel.value = dkey;
  dkel.focus();
  dkel.select();
}


bpasswd.clear = function() {
  document.getElementById("bpasswd-salt").value = "";
  document.getElementById("bpasswd-password").value = "";
  document.getElementById("bpasswd-dkey").value = "";
}


bpasswd.togglePane = function() {
  bpasswd.clear();
  var pane = document.getElementById('bpasswd-panel');
  if (pane.state === "open")
    pane.hidePopup();
  else if (pane.state === "closed")
    pane.openPopup(document.getElementById('bpasswd-button'));
}


bpasswd.reveal = function() {
  var type = document.getElementById("bpasswd-show-pwd").checked ? null : "password";
  document.getElementById("bpasswd-password").type = type;
}


bpasswd.focus = function() {
  document.getElementById("bpasswd-password").focus();
}



window.addEventListener("load", function() {
  try {
    var first;
    try {
      first = Services.prefs.getBoolPref("extensions.bpasswd.firstrun");
    } catch(e) {
      Services.prefs.setBoolPref("extensions.bpasswd.firstrun", true);
      first = true;
    }

    if (first) {
      Services.prefs.setBoolPref("extensions.bpasswd.firstrun", false);
      bpasswdInstallButton('nav-bar', 'bpasswd-button');
    }
  } catch(e) {
  }
}, true);



/**
 * Installs the toolbar button with the given ID into the given
 * toolbar, if it is not already present in the document.
 *
 * @param {string} toolbarId The ID of the toolbar to install to.
 * @param {string} id The ID of the button to install.
 * @param {string} afterId The ID of the element to insert after. @optional
 */
function bpasswdInstallButton(toolbarId, id, afterId) {
    if (!document.getElementById(id)) {
        var toolbar = document.getElementById(toolbarId);

        // If no afterId is given, then append the item to the toolbar
        var before = null;
        if (afterId) {
            var elem = document.getElementById(afterId);
            if (elem && elem.parentNode == toolbar)
                before = elem.nextElementSibling;
        }

        toolbar.insertItem(id, before);
        toolbar.setAttribute("currentset", toolbar.currentSet);
        document.persist(toolbar.id, "currentset");

        if (toolbarId == "addon-bar")
            toolbar.collapsed = false;
    }
}
