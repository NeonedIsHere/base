module.exports = {
    customId: 'remove_member_blr_select',
    async execute(interaction, client) {

        const member = interaction.values[0];

        client.db.get(`SELECT * FROM members WHERE id =?`,
            [member],
            (err, row) => {
                if (err) {
                    console.log(err);
                    return interaction.reply({ content: 'Une erreur est survenue', flags: MessageFlags.Ephemeral });
                }

                if (!row) {
                    return interaction.reply(`L'utilisateur n'est pas dans la liste des blr et ne peux donc pas être retiré.`);
                }

                client.db.run(`DELETE FROM members WHERE id = ?`, [member], (err) => {
                    if (err) {
                        console.log(err);
                        return interaction.reply({ content: 'Une erreur est survenue', flags: MessageFlags.Ephemeral });
                    }

                    interaction.reply(`<@${member}> a bien été retiré de la blr`);
                });
            }
        );  
    }
}