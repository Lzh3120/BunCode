import {readdir, rename} from 'node:fs/promises'
import path from 'node:path'

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
                const newName = fullPath;
                const oldName = "";
                rename(newName, oldName);
            }else {
                console.log(`other`)
            }
        }
    }catch(error){
        console.error("read error");
    }
}

const dir = "D://";
readDirectory(dir);