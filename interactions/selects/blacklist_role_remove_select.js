const { MessageFlags } = require("discord.js");

module.exports = {
    customId: 'blacklist_role_remove_select',
    async execute(interaction) {
        console.log("Interaction blacklist_role_remove_select déclenchée !");

        const { client, guild, values: selectedRoleIds } = interaction;

        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            const removed = [];
            const notFound = [];

            const deleteRole = (roleId) => {
                return new Promise((resolve) => {
                    const role = guild.roles.cache.get(roleId);
                    const roleName = typeof role?.name === "string"
                        ? role.name.slice(0, 100)
                        : `Rôle supprimé (${roleId})`;

                    client.db.run(
                        'DELETE FROM roles WHERE id = ?',
                        [roleId],
                        function (err) {
                            if (err) {
                                console.error(`(${process.pid}) [❌] » [DB] Erreur suppression rôle :`, err.message);
                                notFound.push(roleName);
                            } else if (this.changes === 0) {
                                notFound.push(roleName);
                            } else {
                                removed.push(`<@&${roleId}>`);
                            }
                            resolve();
                        }
                    );
                });
            };

            await Promise.all(selectedRoleIds.map(deleteRole));

            const lines = [];
            if (removed.length > 0) lines.push(`✅ **Supprimés de la blacklist :**\n• ${removed.join('\n• ')}`);
            if (notFound.length > 0) lines.push(`⚠️ **Non trouvés en DB :**\n• ${notFound.join('\n• ')}`);

            await interaction.editReply({
                content: lines.join('\n\n') || "⚠️ Aucun rôle n'a été supprimé.",
                flags: MessageFlags.Ephemeral
            });

        } catch (error) {
            console.error(`(${process.pid}) [❌] » [Interaction] Erreur blacklist_role_remove_select :`, error);
            await interaction.editReply({
                content: "❌ Une erreur est survenue lors de la suppression des rôles.",
                flags: MessageFlags.Ephemeral
            });
        }
    }
};