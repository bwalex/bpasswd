function bpasswdDeriveKey() {
  var cost = 6;
  var salt = document.getElementById("bpasswd-salt").value;
  var pass = document.getElementById("bpasswd-password").value;
  var dkey = BPasswd.generate(salt, pass, cost);
  const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
  gClipboardHelper.copyString(dkey);
  document.getElementById("bpasswd-dkey").value = dkey;
}

function bpasswdToggleBar() {
  document.getElementById("bpasswd-salt").value = "";
  document.getElementById("bpasswd-password").value = "";
  document.getElementById("bpasswd-dkey").value = "";
  var toolbar = document.getElementById('bpasswdToolbar');
  toolbar.collapsed = !toolbar.collapsed;
}
