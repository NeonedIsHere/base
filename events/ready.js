const { Events } = require("discord.js");
const { checkBotExpiration } = require("../core/function");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {

        console.log(`(${process.pid}) [✅] » [${client.user.tag}] The bot is now ready and fully operational`);
        client.user.setActivity("Sur Discord", { type: "WATCHING" });

        setInterval(() => checkBotExpiration(client), 60 * 60 * 1000)
    }
}