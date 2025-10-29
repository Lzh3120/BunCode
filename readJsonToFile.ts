import * as fs from 'fs/promises'

interface Item {
    id:number;
    slug:string;
    title:string;
    source:{
        name:string;
        url:string;
    }
    images:string[];
    prompts:string[];
    coverImage:string;
}

interface Content {
    generatedAt:string;
    total:number;
    items: Item[]
}
//读取文件
async function readJson(path:string):Promise<Content>{
    const jsonString = await fs.readFile(path, {encoding: 'utf-8'});
    const content:Content = JSON.parse(jsonString);
    return content;
}

const content:Content = await readJson("C:\\Users\\Administrator\\Desktop\\gpt4o-image-prompts-master\\data\\prompts.json");
const items:Item[] = content.items;

for(const item of items){
    const filePath = "D:\\prompts\\案例"+item.id+" "+item.title+".txt";
    let promptStr:string = "";
    for(const str of item.prompts){
        promptStr = promptStr + str;
    }
    for(const img of item.images){
        if(img.startsWith("images")){
            
        }
    }
    fs.writeFile(filePath, promptStr, {encoding: 'utf-8'});
}
console.log(content.items.length);
