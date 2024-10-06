const { serveHTTP, publishToCentral } = require('stremio-addon-sdk')
const addonInterface = require('./index')

serveHTTP(addonInterface, { port: process.env.PORT || 7000 })

// Uncomment the following line if you want to publish your addon to the Stremio addon catalog
// publishToCentral("https://my-addon.awesome/manifest.json")
