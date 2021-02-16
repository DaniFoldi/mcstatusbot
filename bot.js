'use strict'

const debug = require('debug')('mcstatusbot:bot')
const discord = require('discord.js')
const fse = require('fs-extra')
const json5 = require('json5')
const minecraftUtil = require('minecraft-server-util')

const CONFIG_FILE = process.env.CONFIG_FILE | 'config.json5'
const DISCORD_TOKEN = process.env.DISCORD_TOKEN

;(async ()=>{
  const configRaw = await fse.readFile('config.json5')
  const config = json5.parse(configRaw.toString())
  
  // TODO check config gile
  // TODO check discord token
  
  // TODO partials
  const client = new discord.Client({partials: []})
  
  //client.login(DISCORD_TOKEN)

  status = {
    online: true,
    image: 'blabla.png',
    'playerCount': 42,
    'maxPlayerCount': 69,
    'version': '1.69.420'
  }
})()