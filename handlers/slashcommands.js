const { join } = require("path")
const { buildCommand } = require("../core/function")
const { REST, Routes } = require("discord.js")

module.exports = async (client) => {
    const commands = client.commands.map(command => {
        return buildCommand(command)
    }).filter(Boolean)

    const rest = new REST({ version: '10' }).setToken(client.config.token)
    try {
        await rest.put(Routes.applicationCommands(client.config.clientId), { body: commands })
        console.log(`(${process.pid}) [✅] » [Slashcommands] Successfully registered ${commands.length} commands.`)
    } catch (error) {
        console.error('Error updating application commands:', error)
        return
    }
}