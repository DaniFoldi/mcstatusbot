'use strict'

const {MessageEmbed} = require('discord.js')

const listItem = require('./listItem')

module.exports = async (client, config, status) => {
  if (!client.readyTimestamp)
    return
    
  const color = status.online ? '#1b913c' : '#d60018'
  const ip = `${config.ip}${config.port === 25565 ? '' : (':' + config.port)}`
  
  const embed = new MessageEmbed().setColor(color)
    .setThumbnail('attachment://image.png')
    .setTitle(listItem(config.name).replace('{playerCount}', status.playerCount).replace('{maxPlayerCount}', status.maxPlayerCount).replace('{ip}', ip))
    .setDescription(listItem(config.description).replace('{playerCount}', status.playerCount).replace('{maxPlayerCount}', status.maxPlayerCount).replace('{ip}', ip))
    .addField('\u200b', '\u200b')
    .addField('Játékosok száma', `${status.playerCount} / ${status.maxPlayerCount}`)
    .addField('\u200b', '\u200b')
    .setFooter(ip)
    .attachFiles(['./config/image.png'])

  if (client.guilds.partial)
    await client.guilds.fetch()

  const guild = await client.guilds.cache.get(config.guildID)

  if (guild.channels.partial)
    await guild.channels.fetch()

  const channel = await guild.channels.cache.get(config.channelID)

  try {
    const message = await channel.messages.fetch(config.messageID, true, true)
    if (message === undefined) {
      const message = await channel.send(embed)
      return message.id
    } else {
      await message.edit(embed)
      return message.id
    }
  } catch (e) {
    const message = await channel.send(embed)
      return message.id
  }
}