const { addonBuilder } = require('stremio-addon-sdk')
const axios = require('axios')
const cheerio = require('cheerio')

const manifest = {
    id: 'org.usatvgo',
    version: '1.0.0',
    name: 'USA TV Go',
    description: 'Watch live USA TV channels',
    resources: ['catalog', 'stream'],
    types: ['tv'],
    catalogs: [
        {
            type: 'tv',
            id: 'usatvgo_catalog'
        }
    ]
}

const builder = new addonBuilder(manifest)

builder.defineCatalogHandler(async ({ type, id }) => {
    if (type === 'tv' && id === 'usatvgo_catalog') {
        const channels = await getChannels()
        return { metas: channels }
    } else {
        return { metas: [] }
    }
})

builder.defineStreamHandler(async ({ type, id }) => {
    if (type === 'tv') {
        const streamUrl = await getStreamUrl(id)
        if (streamUrl) {
            return { streams: [{ url: streamUrl }] }
        }
    }
    return { streams: [] }
})

async function getChannels() {
    try {
        const response = await axios.get('https://usatvgo.live')
        const $ = cheerio.load(response.data)
        const channels = []

        $('.channel-list a').each((index, element) => {
            const name = $(element).text().trim()
            const id = $(element).attr('href').split('/').pop()
            channels.push({
                id: id,
                type: 'tv',
                name: name,
                poster: `https://usatvgo.live/images/${id}.png`
            })
        })

        return channels
    } catch (error) {
        console.error('Error fetching channels:', error)
        return []
    }
}

async function getStreamUrl(channelId) {
    try {
        const response = await axios.get(`https://usatvgo.live/${channelId}`)
        const $ = cheerio.load(response.data)
        const streamUrl = $('iframe').attr('src')
        return streamUrl
    } catch (error) {
        console.error('Error fetching stream URL:', error)
        return null
    }
}

module.exports = builder.getInterface()
