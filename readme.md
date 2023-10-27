# THAT Insomnia Signing Plugin

Insomnia plugin for signing THAT Requests from Insomnia

## Install

This plugin is scoped to `@thatconference` and therefore doesn't appear on Insomnia's Plugin Hub.

1. From Insomnia go to Preferences, Plugins tab
1. Click `Reveal Plugins Folder` button
1. This will open the plugins folder
    a. MacOS: /Users/username/Library/Application Support/Insomnia/Plugins
1. Open a terminal pointing to the directory
1. run `npm install @thatconference/insomnia-plugin-that-signing`

After refreshing the Plugins tab in Insomnia you should see this plugin listed.

## Usage

The signature needs to be sent as a Request Header. The plugin supports any header name. Setting up your header in Insomnia for THAT:  
Header name: `that-request-signature`  
Header Value: for the header's value, press <ctrl+space> to get a list of Insomnia `tags`. Use the `THAT Signature` tag. When you click on the tag a form for values is opened. The `Signing Key` field is required. Set your environment value for the signing key in this field.

The `Live Preview` field will show something like, `~headerdataplaceholder~` when all is set.

### Making Requests

Troubleshooting and throwing errors in Insomnia Plugins isn't great. If you discover that a signature value is not being sent try looking in the console (view > Toggle Dev Tools) and review the output from the plugin.

When there is an error which was swallowed by Insomnia, the Timeline tag will be blank and no request would have been made.
