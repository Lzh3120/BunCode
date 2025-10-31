import Database from "bun:sqlite";


const DB_PATH = "app.sqlite";

export class DB{
    private db: Database;

    constructor(){
        this.db = new Database(DB_PATH, { create: true });
        this.init();
        //做一些初始化操作
    }

    public init():void{
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS contents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL,
                imgInfo TEXT NOT NULL
            );
            `);
    }

    public getDB():Database{
        return this.db;
    }


}