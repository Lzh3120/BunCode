
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
        this.findAllStmt = this.db.query("SELECT id, content, imgInfo FROM contents");
        this.deleteByIdStmt = this.db.query("DELETE FROM contents WHERE id = $id");
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