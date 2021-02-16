'use strict'

const debug = require('debug')('mcstatusbot:bot')
const discord = require('discord.js')
const fse = require('fs-extra')
const json5 = require('json5')
const minecraftUtil = require('minecraft-server-util')
const path = require('path')

const embed = require('./embed')

const CONFIG_FILE = process.env.CONFIG_FILE || path.join('config', 'config.json5')
const IMAGE_FILE = process.env.IMAGE_FILE || path.join('config', 'image.png')
const DISCORD_TOKEN = process.env.DISCORD_TOKEN
const LAST_STATUS_FILE = process.env.CONFIG_FILE || path.join('config', 'laststatus.json5')

const query = async function(config) {
  try {
    const newStatus = await minecraftUtil.status(config.ip, {port: config.port})
    json5.stringify(newStatus)
    
    const status = {
      online: true,
      image: IMAGE_FILE,
      //image: 'https://nuggetcraft.net/images/icons/server-icon.png',
      playerCount: newStatus.onlinePlayers,
      maxPlayerCount: newStatus.maxPlayers,
      version: newStatus.version
    }
    
    await fse.writeFile(LAST_STATUS_FILE, json5.stringify(status))
    await fse.writeFile(IMAGE_FILE, newStatus.favicon.replace(/^data:image\/png;base64,/, ''), 'base64')
    
    return status
  } catch (e) {
    console.error(e)
    const statusRaw = await fse.readFile(LAST_STATUS_FILE)
    const status = json5.parse(statusRaw.toString())
    
    return {online: false, playerCount: 0, ...status}
  }
}

const updateActivity = async function(client) {
  await client.user.setActivity('play.nugget.hu', {
        type: 'PLAYING'
      })
  debug('Activity update')
}

const updateEmbed = async function(client, config) {
  const status = await query(config)
  const messageId = await embed(client, config, status)
  debug('Status update')
  
  config.messageID = messageId
  
  const configRaw = await fse.writeFile(CONFIG_FILE, json5.stringify(config))
}

;(async () => {
  try {
    const configRaw = await fse.readFile(CONFIG_FILE)
    const config = json5.parse(configRaw.toString())

    const client = new discord.Client({partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION']})

    client.on('ready', async () => {updateEmbed(client, config);
                                   updateActivity(client)})
    setInterval(async () => {updateEmbed(client, config)}, config.updateInterval)
    setInterval(async () => {updateActivity()}, 30 * 60 * 1000)
    
    await client.login(DISCORD_TOKEN)
  } catch (e) {
    console.error(e)
  }
})()