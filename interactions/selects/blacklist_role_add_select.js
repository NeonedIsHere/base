const { MessageFlags } = require("discord.js");

module.exports = {
    customId: 'blacklist_role_add_select',
    async execute(interaction, client) {
        console.log("Interaction blacklist_role_add_select déclenchée !");

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            const added = [];
            const already = [];
            const failed = [];

            for (const roleId of interaction.values) {
                try {
                    const role = interaction.guild.roles.cache.get(roleId)

                    const isAlready = await new Promise((resolve, reject) => {
                        client.db.get('SELECT * FROM roles WHERE id = ?', [roleId], (err, row) => {
                            if (err) return reject(err)
                            resolve(!!row)
                        })
                    })

                    if (isAlready) {
                        already.push(`<@&${role.id}>`)
                        continue
                    }

                    await new Promise((resolve, reject) => {
                        client.db.run('INSERT INTO roles (id, name, added_by) VALUES (?, ?, ?)', 
                            [role.id, role.name, `${interaction.user.username} (${interaction.user.id})`],
                            (err) => {
                                if (err) return reject(err)
                                resolve()
                            }
                        )
                    })

                    added.push(`<@&${role.id}>`)
                } catch (error) {
                    console.error(`❌ Erreur pour l'utilisateur ${roleId}:`, error)
                    failed.push(roleId)
                }
            }

            const message = []
            if (added.length) message.push(`✅ **Ajouté(s)**: ${added.join(', ')}`)
            if (already.length) message.push(`⚠️ **Déjà blr**: ${already.join(', ')}`)
            if (failed.length) message.push(`❌ **Échec(s)**: ${failed.join(', ')}`)

            return interaction.editReply({ content: message.join('\n') || "Aucune action effectuée", flags: MessageFlags.Ephemeral })
        } catch (error) {
            console.error('Erreur principal:', error)
            return interaction.reply({ content: "Une erreur viens casser les couilles", flags: MessageFlags.Ephemeral })
        }
    }
};