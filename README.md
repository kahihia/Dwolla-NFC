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

## License

(The MIT License)

Copyright (c) 2014 [Troy Blank](mailto:troy@troyblank.com, "Troy Blank")

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.