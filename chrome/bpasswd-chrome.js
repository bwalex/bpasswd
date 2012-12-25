function bpasswdDeriveKey() {
  var cost = 6;
  var salt = document.getElementById("bpasswd-salt").value;
  var pass = document.getElementById("bpasswd-password").value;
  var dkey = BPasswd.generate(salt, pass, cost);
  var dkEl = document.getElementById("bpasswd-dkey")
  dkEl.value = dkey;
  dkEl.focus();
  dkEl.select();
  document.execCommand('Copy');
}

function bpasswdClearAll() {
  document.getElementById("bpasswd-salt").value = "";
  document.getElementById("bpasswd-password").value = "";
  document.getElementById("bpasswd-dkey").value = "";
}

document.getElementById("bpasswd-derive-key").onclick = bpasswdDeriveKey;
document.getElementById("bpasswd-clear-all").onclick = bpasswdClearAll;
