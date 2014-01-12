CP= cp
MV= mv
RM= rm -f
ZIP= zip

populate-chrome:
	${CP} common/bpasswd/*	chrome/bpasswd/

populate-firefox:
	${CP} common/bpasswd/*	firefox/content/

populate-firefox-jetpack:
	${CP} common/bpasswd/*	firefox-jetpack/bpasswd2/data/bpasswd/

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

clean-firefox-jetpack:
	${RM} firefox-jetpack/bpasswd2/data/bpasswd/*.js


package-chrome: clean-chrome populate-chrome
	${RM} dist/bpasswd-chrome.zip
	cd chrome; ${ZIP} -r ../dist/bpasswd-chrome.zip *

package-firefox: clean-firefox populate-firefox
	${RM} dist/bpasswd-firefox.xpi
	cd firefox; ${ZIP} -r ../bpasswd-firefox.zip *
	${MV} bpasswd-firefox.zip dist/bpasswd-firefox.xpi

package-firefox-jetpack: clean-firefox-jetpack populate-firefox-jetpack
	${RM} dist/bpasswd-jetpack.xpi
	cfx --package-path=firefox-jetpack/packages \
		--pkgdir=firefox-jetpack/bpasswd \
		--output-file=dist/bpasswd-jetpack.xpi


package: package-chrome package-firefox-jetpack
clean: clean-chrome clean-firefox-jetpack
populate: populate-chrome populate-firefox-jetpack
