var prefs;

var updateOpts = function(onlyGlobal) {
    var salt = $('#bpasswd-salt').val();
    var found_salt = false;

    var cost = prefs.global_options.cost;
    var max_len = prefs.global_options.max_len;
    var gen_method = prefs.global_options.gen_method;
    var generation = 0;

    /* Apply overrides */
    if (!onlyGlobal && typeof(prefs.salt_options[salt]) !== "undefined") {
        found_salt = true;
        if (typeof(prefs.salt_options[salt]["cost"]) !== "undefined")
            cost = prefs.salt_options[salt]["cost"];
        if (typeof(prefs.salt_options[salt]["max_len"]) !== "undefined")
            max_len = prefs.salt_options[salt]["max_len"];
        if (typeof(prefs.salt_options[salt]["gen_method"]) !== "undefined")
            gen_method = prefs.salt_options[salt]["gen_method"];
        if (typeof(prefs.salt_options[salt]["generation"]) !== "undefined")
            generation = prefs.salt_options[salt]["generation"];
    }

    $('#more_max_len').val(max_len);
    $('#more_cost').val(cost);
    $('#more_gen_method').val(gen_method);
    $('#more_generation').val(generation);

    if (found_salt)
        $('#found_salt_config').show();
    else
        $('#found_salt_config').hide();
}

$('#bpasswd-salt').keyup(function() {
    updateOpts(false);
});

$('#bpasswd-more-options').click(function() {
    $('#more-options').toggle();
});

$('#bpasswd-derive-key').click(function() {
    var salt = $('#bpasswd-salt').val();
    var pass = $('#bpasswd-password').val();

    var cost = $('#more_cost').val();
    var max_len = $('#more_max_len').val();
    var gen_method = $('#more_gen_method').val();
    var generation = $('#more_generation').val();

    var dkey = BPasswd.generate(salt, pass, cost, gen_method, generation).substring(0, max_len);
    $('#bpasswd-dkey').val(dkey);
    $('#bpasswd-dkey').focus();
    //$('#bpasswd-dkey').select();

    /* Mobile Safari select() */
    var el = document.getElementById('bpasswd-dkey');
    el.setSelectionRange(0, dkey.length);
    //el.selectionStart = 0;
    //el.selectionEnd = el.value.length;

    if (document.queryCommandSupported('copy')) {
      console.log("Clipboard copy using execCommand");
      document.execCommand('copy');
    } else if (window.clipboardData && window.clipboardData.setData) {
      console.log("Clipboard copy using window.clipboardData.setData");
      window.clipboardData.setData(dkey);
    }
});

$('#bpasswd-show-options').click(function() {
    document.location.href = 'options.html';
});

$('#bpasswd-save-options').click(function() {
    var salt = $('#bpasswd-salt').val();
    var cost = $('#more_cost').val();
    var max_len = $('#more_max_len').val();
    var gen_method = $('#more_gen_method').val();
    var generation = $('#more_generation').val();

    if (salt == "")
        return;

    if (typeof(prefs.salt_options[salt]) === "undefined")
        prefs.salt_options[salt] = {};

    prefs.salt_options[salt].gen_method = gen_method;
    prefs.salt_options[salt].generation = generation;
    prefs.salt_options[salt].cost = cost;
    prefs.salt_options[salt].max_len = max_len;

    localStorage.setItem('bpasswd:salt_options', JSON.stringify(prefs.salt_options));

    updateOpts(false);

    $('#saved_salt_salt').html("" + salt);
    $('#saved_salt_config').show(100);
    $('#saved_salt_config').delay(3000).hide(100);
});

$('#bpasswd-show-pwd').change(function() {
    document.getElementById('bpasswd-password').type = $('#bpasswd-show-pwd').is(':checked') ? "text" : "password";
});

function qs(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

function find_salt(prefs, url) {
  var u = URI(url);
  var domain = u.domain();
  var hostname = u.hostname();
  var tld = u.tld();
  var site_name = domain.substring(0, domain.length-tld.length-1);

  for (var s in prefs.salt_options) {
    if (typeof(prefs.salt_options[s]["aliases"]) !== "undefined") {
      for (var a in prefs.salt_options[s]["aliases"]) {
        if (prefs.salt_options[s]["aliases"][a].length == 0)
          continue;
        var re = new RegExp(prefs.salt_options[s]["aliases"][a], "i");
        if (re.test(hostname)) {
          return s;
        }
      }
    }
  }
  return site_name;
}

$(function() {
    $('input[type="number"]').inputNumber();
    $('#more-options').hide();

    prefs = {};

    prefs['salt_options'] = JSON.parse(localStorage.getItem('bpasswd:salt_options') || "{}");
    prefs['global_options'] = JSON.parse(localStorage.getItem('bpasswd:global_options') ||
                               '{ "gen_method": "base64", "max_len": 32, "cost": 6 }');

    $('#bpasswd-password').focus();
    $('#saved_salt_config').hide();

    (function() {
      var url = [location.protocol, '//', location.host, location.pathname].join('');

      var a = '<a href="javascript:(function(){	open(\''+url+'?url=\' + window.location.href,\'targetname\',\'height=500,width=500\');})()" title="BPasswd">BPasswd Bookmarklet</a>';
      $(a).appendTo('#bookmarklet-div');
    })();

    var q = qs('url');
    if (q) {
      console.log("Passed URL query parameter: " + q);
      $('#bpasswd-salt').val(find_salt(prefs, q));
    }

    updateOpts(false);
});
