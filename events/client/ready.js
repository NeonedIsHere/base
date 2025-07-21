const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`(${process.pid}) [✅] » [READY] Bot prêt et connecté en tant que ${client.user.tag}`);
    }        
}
