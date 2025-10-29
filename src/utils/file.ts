import fs from 'node:fs'


export function write(file:string, content:string){
    fs.writeFileSync(file, content, {
        encoding: 'utf-8',
        flag: 'a'
    });
}