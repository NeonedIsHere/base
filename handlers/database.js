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
                console.error(`(${process.pid}) [❌] » [Database] Erreur lors de la connexion à la base de données :`, err.message);
                reject(err);
            } else {
                console.log(`(${process.pid}) [✅] » [Database] Connecté à la base de données SQLite`);

                db.run(`CREATE TABLE IF NOT EXISTS owners (
                    id TEXT NOT NULL PRIMARY KEY,
                    username TEXT NOT NULL,
                    added_by TEXT NOT NULL,
                    added_at datetime DEFAULT CURRENT_TIMESTAMP
                )`, (err) => {
                    if (err) {
                        console.error(`(${process.pid}) [❌] » [Database] Erreur lors de la création de la table owners :`, err.message);
                    } else {
                        console.log(`(${process.pid}) [✅] » [Database] Table owners créée ou déjà existante.`);
                    }
                });

                db.on('close', () => {
                    console.log(`(${process.pid}) [✅] » [Database]Connexion à la base de données fermée.`);
                });

                if (client) {
                    client.db = db;
                }
                
                resolve(db);
            }
        });
    });
};