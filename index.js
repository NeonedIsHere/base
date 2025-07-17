const  { ButtonStyle, Client, Collection, IntentsBitField } = require('discord.js')
const config = require('./config.json')
const db = require('./handlers/database.js')
const cluster = require('cluster')

const client = new Client({ intents: new IntentsBitField(53608447) })

client.buttons = new Collection()
client.commands = new Collection()
client.events = new Collection()
client.modals = new Collection()
client.selects = new Collection()

client.db = db
client.config = config

require('./handlers/commands.js')(client)
require('./handlers/interaction.js')(client)
require('./handlers/slashcommand.js')(client)
require('./handlers/events.js')(client)

client.login(config.token)
    .catch((err) => console.error(`Erreur lors de la connection au bot`, err.stack)
)