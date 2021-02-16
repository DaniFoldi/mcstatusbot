'use strict'

const {MessageEmbed} = require('discord.js')

module.exports = async (client, config, status) => {
  if (!client.readyTimestamp)
    return
    
    const color = status.online ? '#1b913c' : '#d60018'
    const embed = new MessageEmbed().setColor(color)
        .setThumbnail(status.image)
        .setTitle(config.name)
        .setDescription(config.description)
        .addField('Játékosok száma', `${status.playerCount} / ${status.maxPlayerCount}`)
        .setFooter(`${config.ip}${config.port === 25565 ? '' : (':' + config.port)}`)

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