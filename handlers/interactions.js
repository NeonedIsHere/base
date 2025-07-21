const fs = require('fs');
const path = require('path');

module.exports = (client) => {

    const inter = [
        { name: 'buttons', collection: client.buttons },
        { name: 'selects', collection: client.selects },
        { name: 'modals', collection: client.modals }
    ];

    for (const type of inter) {
        const interPath = path.join(__dirname, '../interactions', type.name);

        if (!fs.existsSync(interPath)) {
            console.warn(`[📁] » [INTER] Dossier ${type.name} introuvable, création...`);
            fs.mkdirSync(interPath, { recursive: true });
            console.log(`[✅] » [INTER] Dossier ${type.name} créé avec succès.`);
            continue;
        }

        const files = fs.readdirSync(interPath).filter(file => file.endsWith('.js'));

        for (const file of files) {
            const filepath = path.join(interPath, file);
            const interactionModule = require(filepath);

            if (!interactionModule || !interactionModule.customId || !interactionModule.execute) {
                console.error(`[❌] » [INTER] ${file} est invalide (customId ou execute manquant).`);
                continue;
            }

            type.collection.set(interactionModule.customId, interactionModule);
            console.log(`(${process.pid}) [✅] » [INTER] ${interactionModule.customId} chargé depuis ${path.relative(process.cwd(), filepath)}`);
        }
    }
};