import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'
import bcrypt from 'bcrypt'

let db;

export async function inItDb() {
    const dbPath = path.join('database.db')
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    })

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT CHECK(role IN ('citizen', 'officer')) DEFAULT 'citizen'
        )
        `)

        await db.exec(`
          CREATE TABLE IF NOT EXISTS issues (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          description TEXT,
          image TEXT,
          location TEXT,
          status TEXT CHECK(status IN ('pending', 'acknowledged', 'in-progress', 'resolved')) DEFAULT 'pending',
          citizenId INTEGER,
          officerId INTEGER,
          FOREIGN KEY(citizenId) REFERENCES users(id),
          FOREIGN KEY(officerId) REFERENCES users(id)
          )  
            `)

            const officer = await db.get(`SELECT * FROM users WHERE role="officer"`)
            if(!officer) {
                const hashedPassword = await bcrypt.hash("password123", 10)
                await db.run(`
                   INSERT INTO users(username, password, role)
                   VALUES(?, ?, ?)  
                    `, ["officer1", hashedPassword, "officer"]);
                    console.log("Seeded default officer: officer1 / password123")
            }
}



export async function getDB() {
    if(!db) throw new Error('Database not initialized')
    return db
}
