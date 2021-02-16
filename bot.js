'use strict'

const debug = require('debug')('mcstatusbot:bot')
const discord = require('discord.js')
const fse = require('fs-extra')
const json5 = require('json5')
const minecraftUtil = require('minecraft-server-util')

const embed = require('./embed')

const CONFIG_FILE = process.env.CONFIG_FILE || 'config.json5'
const DISCORD_TOKEN = process.env.DISCORD_TOKEN
const LAST_STATUS_FILE = process.env.CONFIG_FILE || 'laststatus.json5'

const query = async function(config) {
  try {
    const newStatus = await minecraftUtil.status(config.ip, {port: config.port})
    json5.stringify(newStatus)
    
    const status = {
      online: true,
      image: 'https://nuggetcraft.net/images/icons/server-icon.png',
      playerCount: newStatus.onlinePlayers,
      maxPlayerCount: newStatus.maxPlayers,
      version: newStatus.version
    }
    
    await fse.writeFile(LAST_STATUS_FILE, json5.stringify(status))
    
    return status
  } catch (e) {
    const statusRaw = await fse.readFile(LAST_STATUS_FILE)
    const status = json5.parse(statusRaw.toString())
    
    return {online: false, playerCount: 0, ...status}
  }
}

const updateEmbed = async function(client, config) {
  const status = await query(config)
  const messageId = await embed(client, config, status)
  // TODO debug update
}

;(async () => {
  try {
    const configRaw = await fse.readFile(CONFIG_FILE)
    const config = json5.parse(configRaw.toString())

    const client = new discord.Client({partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION']})

    client.on('ready', async () => {updateEmbed(client, config)})
    setInterval(async () => {updateEmbed(client, config)}, config.updateInterval)
    
    await client.login(DISCORD_TOKEN)
  } catch (e) {
    console.error(e)
  }
})()