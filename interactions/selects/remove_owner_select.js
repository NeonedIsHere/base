const { MessageFlags } = require("discord.js");

module.exports = {
    customId: 'remove_owner_select',
    async execute(interaction, client) {
        console.log("Interaction remove_owner_select déclenchée !");

        try {
            await interaction.deferReply({ ephemeral: true });

            const removed = [];
            const notFound = [];
            const failed = [];

            for (const userId of interaction.values) {
                try {
                    const user = await client.users.fetch(userId);

                    const isOwner = await new Promise((resolve, reject) => {
                        client.db.get('SELECT * FROM owners WHERE id = ?', [user.id], (err, row) => {
                            if (err) return reject(err);
                            resolve(!!row);
                        });
                    });

                    if (!isOwner) {
                        notFound.push(user.username);
                        continue;
                    }

                    await new Promise((resolve, reject) => {
                        client.db.run('DELETE FROM owners WHERE id = ?', [user.id], (err) => {
                            if (err) return reject(err);
                            resolve();
                        });
                    });

                    removed.push(user.username);
                } catch (err) {
                    console.error(`❌ Erreur pour l'utilisateur ${userId}:`, err);
                    failed.push(userId);
                }
            }

            const messages = [];
            if (removed.length) messages.push(`✅ **Retiré(s)**: ${removed.join(', ')}`);
            if (notFound.length) messages.push(`⚠️ **Pas owner**: ${notFound.join(', ')}`);
            if (failed.length) messages.push(`❌ **Échec(s)**: ${failed.join(', ')}`);

            return interaction.editReply({
                content: messages.join('\n') || "Aucune action effectuée.",
                flags: MessageFlags.Ephemeral
            });

        } catch (err) {
            console.error("Erreur principale :", err);

            if (interaction.deferred || interaction.replied) {
                return interaction.editReply({
                    content: "❌ Une erreur inconnue est survenue.",
                    flags: MessageFlags.Ephemeral
                });
            }

            return interaction.reply({
                content: "❌ Une erreur inconnue est survenue.",
                flags: MessageFlags.Ephemeral
            });
        }
    }
};