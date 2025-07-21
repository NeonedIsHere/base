const { MessageFlags } = require("discord.js");

module.exports = {
    customId: 'add_owner_select',
    async execute(interaction, client) {
        console.log("Interaction add_owner_select déclenchée !");

        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            const added = [];
            const already = [];
            const failed = [];

            for (const userId of interaction.values) {
                try {
                    const user = await client.users.fetch(userId);

                    const isAlready = await new Promise((resolve, reject) => {
                        client.db.get('SELECT * FROM owners WHERE id = ?', [user.id], (err, row) => {
                            if (err) return reject(err);
                            resolve(!!row);
                        });
                    });

                    if (isAlready) {
                        already.push(user.username);
                        continue;
                    }

                    await new Promise((resolve, reject) => {
                        client.db.run(
                            'INSERT INTO owners (id, username, added_by) VALUES (?, ?, ?)',
                            [user.id, user.username, `${interaction.user.username} (${interaction.user.id})`],
                            (err) => {
                                if (err) return reject(err);
                                resolve();
                            }
                        );
                    });

                    added.push(user.username);
                } catch (err) {
                    console.error(`❌ Erreur pour l'utilisateur ${userId}:`, err);
                    failed.push(userId);
                }
            }

            const messages = [];
            if (added.length) messages.push(`✅ **Ajouté(s)**: ${added.join(', ')}`);
            if (already.length) messages.push(`⚠️ **Déjà owner**: ${already.join(', ')}`);
            if (failed.length) messages.push(`❌ **Échec(s)**: ${failed.join(', ')}`);

            return interaction.editReply({
                content: messages.join('\n') || "Aucune action effectuée.",
                flags: MessageFlags.Ephemeral
            });

        } catch (err) {
            console.error("Erreur principale :", err);
            return interaction.reply({
                content: "❌ Une erreur inconnue est survenue.",
                flags: MessageFlags.Ephemeral
            });
        }
    }
};