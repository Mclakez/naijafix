import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const run = async () => {
    const db = await open({
        filename: "database.db",
        driver: sqlite3.Database
    })

    await db.exec(`ALTER TABLE issues ADD COLUMN proofImage TEXT`)
    console.log("Columns added successfully");
    
}

run().catch(err => console.error(err))