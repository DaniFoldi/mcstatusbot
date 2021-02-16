'use strict'

const discord = require('discord.js')

module.exports = async (client, config, status) => {
    const color = status.online ? '#1b913c' : '#d60018'
    const embed = new Discord.MessageEmbed().setColor(color)
        .setThumbnail(status.image)
        .setTitle(config.name)
        .setDescription(config.description)
        .addField('Játékosok száma', `${status.playerCount} / ${status.maxPlayerCount}`)
        .setFooter(`${config.ip}${config.port === 25565 ? '' : (':' + config.port)}`)

    const guild = await client.guilds.cache.fetch(config.guildID)
    const channel = await guild.channels.cache.get(config.channelID)

    await channel.send(embed)
}