import {type Context } from "hono";
import path from 'node:path'
import fs from 'node:fs'
import {write} from '../utils/file.ts'
import { ContentDao } from "../db/SQL.ts";

const baseFolder = "/root/soft/file";
//const baseFolder = "D:\\file";

export async function save(c: Context){
    // 使用 c.req.formData() 解析 multipart/form-data 请求体
  const body = await c.req.formData(); 
  
  const content = body.get('content'); // 获取文本内容
  const image = body.get('image');     // 获取文件对象（File 或 Blob）

  if (!content) {
    return c.json({ message: '内容不能为空' }, 400);
  }
  
  let imageInfo = '';
  if (image instanceof File && image.size > 0) {
    const fileName = image.name;
    const fileExtension = path.extname(fileName);
    const baseName = path.basename(fileName, fileExtension);
    const uniqueFileName = `${baseName}-${Date.now()}-${fileExtension}`;
    const targetPath = path.join(baseFolder, uniqueFileName);
    await Bun.write(targetPath, image);
    imageInfo = uniqueFileName;
  }
  //存入数据库
  const contentDao = new ContentDao();
  contentDao.create(content.toString(), imageInfo);
  // 返回成功响应
  return c.json({
    message: '内容和图片已成功接收',
    content_received: content,
    image_status: imageInfo,
    timestamp: new Date().toISOString()
  }, 201);
}

//展示文件内容
export function show(c: Context){
    const contentDao = new ContentDao();
    const list = contentDao.findAll();
    return c.text(JSON.stringify(list));
} 

//下载文件
export async function download(c: Context){
    const filename = c.req.param("filename");
    const targetPath = path.join(baseFolder, filename);
    const file = Bun.file(targetPath);
    if(!(await file.exists())){
        return c.text("404", 404);
    }
    const contentType = file.type || 'application/octet-stream';
    c.header("Content-Type", contentType);
    c.header("Content-Length", String(file.size));
    return c.body(file.stream());
}

export async function remove(c: Context){
  const body = await c.req.json();
  const id = body.id;
  const contentDao = new ContentDao();
  contentDao.deleteById(Number(id));
  return c.text("remove success");
}