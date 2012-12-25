CP= cp
JS= bcrypt.js blowfish.js bpasswd.js encdec.js helper.js hmac.js sha1.js sha256.js

populate-chrome:
	${CP} web/bcrypt.js     chrome/
	${CP} web/blowfish.js   chrome/
	${CP} web/bpasswd.js    chrome/
	${CP} web/encdec.js     chrome/
	${CP} web/helper.js     chrome/
	${CP} web/hmac.js       chrome/
	${CP} web/sha1.js       chrome/
	${CP} web/sha256.js     chrome/

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
	${RM} chrome/bcrypt.js
	${RM} chrome/blowfish.js
	${RM} chrome/bpasswd.js
	${RM} chrome/encdec.js
	${RM} chrome/helper.js
	${RM} chrome/hmac.js
	${RM} chrome/sha1.js
	${RM} chrome/sha256.js
	${RM} bpasswd-chrome.zip

clean-firefox:
	${RM} firefox/content/bcrypt.js
	${RM} firefox/content/blowfish.js
	${RM} firefox/content/bpasswd.js
	${RM} firefox/content/encdec.js
	${RM} firefox/content/helper.js
	${RM} firefox/content/hmac.js
	${RM} firefox/content/sha1.js
	${RM} firefox/content/sha256.js
	${RM} bpasswd-firefox.zip

package-chrome2:
	cd chrome; zip -r ../bpasswd-chrome.zip *

package-firefox2:
	cd firefox; zip -r ../bpasswd-firefox.zip *

package-chrome: clean-chrome populate-chrome package-chrome2 clean-chrome

package-firefox: clean-firefox populate-firefox package-firefox2 clean-firefox


package: package-chrome package-firefox
clean: clean-chrome clean-firefox
populate: populate-firefox populate-chrome
