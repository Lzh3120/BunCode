import {readdir, rename} from 'node:fs/promises'
import path from 'node:path'
//循环读取文件并改名
async function readDirectory(dirPath: string) {
    try {
        const contents = await readdir(dirPath, {withFileTypes: true});
        for(const dirent of contents){
            const fullPath = path.join(dirPath, dirent.name);
            if(dirent.isDirectory()){
                readDirectory(fullPath);
            }else if(dirent.isFile()){
                console.log(`- ${dirent.name}, ${fullPath}`);
                //isFile
                const oldName =fullPath;
                const newName = path.join(dirPath, "案例"+dirent.name);
                rename(oldName, newName);
            }else {
                console.log(`other`)
            }
        }
    }catch(error){
        console.error("read error");
    }
}

const dir = "D:\\prompts\\images\\";
readDirectory(dir);