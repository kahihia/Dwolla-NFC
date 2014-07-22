echo -e "\n\E[30;34m\033[1m---------STARTING DWOLLA NFC CORDOVA INSTALL---------\033[0m\n\n"
echo ' (\_(\'
echo ' ( -.-)'
echo '0((“)(“)'

echo -e "\n\E[30;34m\033[1m---------ADDING ANDROID PLATFORM---------\033[0m"
mkdir plugins
mkdir platforms
cordova platform add android

echo -e "\n\E[30;34m\033[1m---------ADDING CORDOVA PLUGINS---------\033[0m"
cordova plugin add https://github.com/Initsogar/cordova-webintent.git
cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git
cordova plugin add https://github.com/chariotsolutions/phonegap-nfc

echo -e "\n\E[30;34m\033[1m---------ADDING CUSTOM TAILORED FILES---------\033[0m"
echo -e "adding custom res/xml/config.xml generator..."
cp installFiles/android.json plugins/android.json
echo -e "adding custom AndroidManifest.xml..."
cp installFiles/AndroidManifest.xml platforms/android/AndroidManifest.xml

echo -e "adding icons..."
cp installFiles/icons/drawable/icon.png platforms/android/res/drawable/icon.png
cp installFiles/icons/drawable-hdpi/icon.png platforms/android/res/drawable-hdpi/icon.png
cp installFiles/icons/drawable-ldpi/icon.png platforms/android/res/drawable-ldpi/icon.png
cp installFiles/icons/drawable-mdpi/icon.png platforms/android/res/drawable-mdpi/icon.png
cp installFiles/icons/drawable-xhdpi/icon.png platforms/android/res/drawable-xhdpi/icon.png

echo -e "\n\E[30;34m\033[1m---------DONE WITH DWOLLA NFC INSTALL, HAVE A NICE DAY---------\033[0m"