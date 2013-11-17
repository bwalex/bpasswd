CP= cp
MV= mv
RM= rm -f
ZIP= zip

populate-chrome:
	${CP} web/bcrypt.js     chrome/bpasswd/
	${CP} web/blowfish.js   chrome/bpasswd/
	${CP} web/bpasswd.js    chrome/bpasswd/
	${CP} web/encdec.js     chrome/bpasswd/
	${CP} web/helper.js     chrome/bpasswd/
	${CP} web/hmac.js       chrome/bpasswd/
	${CP} web/sha1.js       chrome/bpasswd/
	${CP} web/sha256.js     chrome/bpasswd/

populate-firefox:
	${CP} web/bcrypt.js     firefox/content/
	${CP} web/blowfish.js   firefox/content/
	${CP} web/bpasswd.js    firefox/content/
	${CP} web/encdec.js     firefox/content/
	${CP} web/helper.js     firefox/content/
	${CP} web/hmac.js       firefox/content/
	${CP} web/sha1.js       firefox/content/
	${CP} web/sha256.js     firefox/content/

clean-chrome:
	${RM} chrome/bpasswd/*.js

clean-firefox:
	${RM} firefox/content/bcrypt.js
	${RM} firefox/content/blowfish.js
	${RM} firefox/content/bpasswd.js
	${RM} firefox/content/encdec.js
	${RM} firefox/content/helper.js
	${RM} firefox/content/hmac.js
	${RM} firefox/content/sha1.js
	${RM} firefox/content/sha256.js


package-chrome: clean-chrome populate-chrome
	${RM} bpasswd-chrome.zip
	cd chrome; ${ZIP} -r ../bpasswd-chrome.zip *

package-firefox: clean-firefox populate-firefox
	${RM} bpasswd-firefox.xpi
	cd firefox; ${ZIP} -r ../bpasswd-firefox.zip *
	${MV} bpasswd-firefox.zip bpasswd-firefox.xpi


package: package-chrome package-firefox
clean: clean-chrome clean-firefox
populate: populate-firefox populate-chrome
