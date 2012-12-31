function bpasswdDeriveKey() {
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


function bpasswdTogglePane() {
  document.getElementById("bpasswd-salt").value = "";
  document.getElementById("bpasswd-password").value = "";
  document.getElementById("bpasswd-dkey").value = "";
  var pane = document.getElementById('bpasswd-panel');
  if (pane.state === "open")
    pane.hidePopup();
  else if (pane.state === "closed")
    pane.openPopup(document.getElementById('bpasswd-button'));
}


function bpasswdReveal() {
  var type = document.getElementById("bpasswd-show-pwd").checked ? null : "password";
  document.getElementById("bpasswd-password").type = type;
}


function bpasswdFocus() {
	document.getElementById("bpasswd-password").focus();
}
