const  { ButtonStyle, Client, Collection, IntentsBitField } = require('discord.js')
const config = require('./config.json')
const client = new Client({ intents: new IntentsBitField(53608447) })

client.buttons = new Collection()
client.commands = new Collection()
client.events = new Collection()
client.modals = new Collection()
client.selects = new Collection()

client.config = config

require('./handlers/commands.js')(client)
require('./handlers/interactions.js')(client)
require('./handlers/slashcommands.js')(client)
require('./handlers/events.js')(client)
require('./handlers/database.js')(client)

client.login(config.token)
    .catch((err) => console.error(`Erreur lors de la connection au bot`, err.stack)
)