#Dwolla NFC

This is an Android Cordova app, an understanding of Cordova is needed to build the application. Pre-built application files will be found on [troyblank.com](http://troyblank.com, "Troy Blank dot Com") in the near future.

##Installation

To install the Android platform as well as required plugins run the following in the project.

    ./install.sh

##Configuration
First you must copy the example config to make a place to enter your Dwolla API Keys.

    cp www/scripts/config.example.js www/scripts/config.js
    
Then place your keys in config.js on the vars API_KEY, and API_SECRET. API_KEY_UAT and API_SECRET_UAT are optional and used if SANDBOX is set to true allowing you to switch between Dwolla sandbox and production easily.

##Requirements
* [Cordova](http://cordova.apache.org/, "Cordova")
* [Android SDK](https://developer.android.com/sdk/index.html, "Android SDK")
* Dwolla API keys, get them by [creating a Dwolla app](https://www.dwolla.com/applications/create "Dwolla API"). 