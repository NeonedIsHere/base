const fs = require('fs');
const path = require('path');
const { Database } = require('sqlite3');

const databaseDir = path.join(__dirname, '../database');
const dbPath = path.join(databaseDir, 'db.sqlite');

if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true });
    console.log('Dossier de la base de données créé.');
}

module.exports = (client) => {
    return new Promise((resolve, reject) => {
        const db = new Database(dbPath, (err) => {
            if (err) {
                client.error('Erreur lors de la connexion à la base de données :', err.message);
                reject(err);
            } else {
                client.data('Connecté à la base de données SQLite');

                db.on('close', () => {
                    client.info('Connexion à la base de données fermée.');
                });

                if (client) {
                    client.database = db;
                }
                
                resolve(db);
            }
        });
    });
};