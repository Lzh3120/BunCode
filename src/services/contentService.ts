import type { Context } from "hono";
import path from 'node:path'
import fs from 'node:fs'
import {write} from '../utils/file.ts'

const baseFolder = "/root/soft/file";

export async function save(c: Context){
    // 使用 c.req.formData() 解析 multipart/form-data 请求体
  const body = await c.req.formData(); 
  
  const content = body.get('content'); // 获取文本内容
  const image = body.get('image');     // 获取文件对象（File 或 Blob）

  if (!content) {
    return c.json({ message: '内容不能为空' }, 400);
  }

  // 1. 处理文本内容
  console.log('收到的内容:', content);
  const file = path.join(baseFolder, "content.txt");
  write(file, "内容：\n");
  write(file, content.toString()+"\n");
  

  // 2. 处理图片文件
  let imageInfo = '未提交图片';
  if (image instanceof File && image.size > 0) {
    // 假设您想保存文件到本地（Bun.write() 是 Bun 的 API）
    // const imagePath = `./uploads/${image.name}`;
    // await Bun.write(imagePath, image); 
    const fileName = image.name;
    const fileExtension = path.extname(fileName);
    const baseName = path.basename(fileName, fileExtension);
    const uniqueFileName = `${baseName}-${Date.now()}-${fileExtension}`;
    const targetPath = path.join(baseFolder, uniqueFileName);
    await Bun.write(targetPath, image);
    imageInfo = `图片已接收：文件名=${image.name}, 大小=${image.size} bytes, 类型=${image.type}`;
    console.log(imageInfo);
    write(file, "文件路径："+uniqueFileName+"\n");
  }
  write(file, "-----------------------\n")

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
    const contentPath = path.join(baseFolder, "content.txt");
    const content = fs.readFileSync(contentPath, {encoding:'utf-8'});
    return c.text(content);
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