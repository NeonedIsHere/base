const { MessageFlags } = require("discord.js")

module.exports = {
    customId: 'add_member_blr_select',
    async execute(interaction, client) {

        const memberId = interaction.values[0]
        const member = await client.users.fetch(memberId)

        client.db.get(`SELECT * FROM members WHERE id =?`,
            [member.id],
            (err, row) => {
                if (err) {
                    console.log(err)
                    return interaction.reply({ content: 'Une erreur est survenue', flags: MessageFlags.Ephemeral })
                }

                if (row) {
                    return interaction.reply(`${member} est déjà dans la liste des blr et ne peux donc pas être rank.`)
                }

                client.db.run(`INSERT INTO members (id, username, added_by) VALUES (?, ?, ?)`,
                    [member.id, member.username, `${interaction.user.username} (${interaction.user.id})`],
                    (err) => {
                        if (err) {
                            console.log(err)
                            return interaction.reply({ content: 'Une erreur est survenue', flags: MessageFlags.Ephemeral })
                        }

                        interaction.reply(`<@${member.id}> à bien été ajouté à la blr`)
                    }
                )   
            }
        )
    }
}