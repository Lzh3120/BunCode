
import { Database, Statement } from "bun:sqlite";

import { DB } from "./DB";
import type { Content } from "../models/Content";


export class ContentDao{
    readonly db:Database = new DB().getDB();
    public insertStmt:Statement;
    public findByIdStmt:Statement;
    public findAllStmt:Statement;
    public deleteByIdStmt:Statement;
    constructor(){
        this.insertStmt = this.db.query("INSERT INTO contents (content, imgInfo) VALUES ($content, $imgInfo) RETURNING id");
        this.findByIdStmt = this.db.query("SELECT id, content, imgInfo FROM contents WHERE id = $id");
        this.findAllStmt = this.db.query("SELECT id, content, imgInfo FROM contents order by id desc"); 
        this.deleteByIdStmt = this.db.prepare("DELETE FROM contents WHERE id = $id");
    }
    //创建
    public create(content: string, imgInfo: string){
        try{
            const result = this.insertStmt.run(content, imgInfo);
            return Number(result.lastInsertRowid);
        }catch(error){
            throw new Error(`Failed to create user: ${error}`);
        }
    }
    //查询所有
    public findAll(): Content[]{
        const all = this.findAllStmt.all() as Content[];
        return all;
    }
    //删除
    public deleteById(id:number){
        this.deleteByIdStmt.run(id);
    }

    

    

}

export type Realm = {
    id?: number;
    ip: string;
    port: number;
    remark?: string;
    created_at?: string;
}

export class RealmDao{
    readonly db: Database = new DB().getDB();
    // SQL statements
    public createTableSql: string;
    public insertStmt: Statement;
    public findAllStmt: Statement;
    public deleteByIdStmt: Statement;
    public findByIdStmt: Statement;
    public updateByIdStmt: Statement;

    constructor(){
        // 1) 创建表 SQL
        this.createTableSql = `CREATE TABLE IF NOT EXISTS realms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip TEXT NOT NULL,
            port INTEGER NOT NULL,
            remark TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`;

        // 确保表存在
        this.db.exec(this.createTableSql);

        // 2) 插入语句（用于 /realm/add）
        this.insertStmt = this.db.query("INSERT INTO realms (ip, port, remark) VALUES ($ip, $port, $remark) RETURNING id");

        // 3) 查询列表（用于 /realm/list）
        this.findAllStmt = this.db.query("SELECT id, ip, port, remark, created_at FROM realms ORDER BY id DESC");

        // 4) 删除（用于 /realm/delete）
        this.deleteByIdStmt = this.db.prepare("DELETE FROM realms WHERE id = $id");
        // 5) 根据 id 查询
        this.findByIdStmt = this.db.query("SELECT id, ip, port, remark, created_at FROM realms WHERE id = $id");
        // 6) 更新（用于 /realm/update）
        this.updateByIdStmt = this.db.prepare("UPDATE realms SET ip = $ip, port = $port, remark = $remark WHERE id = $id");
    }

    // 新增 realm，返回新记录 id
    public create(ip: string, port: number, remark?: string){
        const res = this.insertStmt.run(ip, port, remark || null);
        return Number(res.lastInsertRowid);
    }

    // 查询所有 realm
    public findAll(): Realm[]{
        const all = this.findAllStmt.all() as Realm[];
        return all;
    }

    // 根据 id 查询 realm
    public findById(id: number): Realm | null {
        const row = this.findByIdStmt.get(id) as Realm | undefined;
        return row || null;
    }

    // 根据 id 删除 realm
    public deleteById(id: number){
        this.deleteByIdStmt.run(id);
    }

    // 根据 id 更新 realm
    public updateById(id: number, ip: string, port: number, remark?: string){
        this.updateByIdStmt.run({$ip: ip, $port: port, $remark: remark || null, $id: id});
    }
}