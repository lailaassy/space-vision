import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

export function importCoco(coco, split) {
  if(!['train','validation','test'].includes(split)) throw Error('Specify the original train, validation, or test split');
  if(!Array.isArray(coco.images)||!Array.isArray(coco.annotations)||!Array.isArray(coco.categories)) throw Error('Invalid COCO structure');
  const categories = new Map(coco.categories.map(c => [c.id,c.name]));
  if(categories.size !== coco.categories.length) throw Error('Duplicate category ID');
  const images = new Map();
  for(const image of coco.images) {
    if(images.has(image.id)) throw Error('Duplicate image ID');
    if(typeof image.file_name !== 'string' || !image.file_name || image.file_name.startsWith('/') || image.file_name.includes('\\') || image.file_name.split('/').includes('..') || image.file_name.includes(':')) throw Error('Unsafe image path');
    if(!Number.isInteger(image.width)||image.width<=0||!Number.isInteger(image.height)||image.height<=0) throw Error('Invalid image dimensions');
    images.set(image.id,{id:image.id,file:image.file_name,width:image.width,height:image.height,split,annotations:[]});
  }
  const seen = new Set();
  for(const annotation of coco.annotations) {
    const image = images.get(annotation.image_id);
    if(!image || !categories.has(annotation.category_id)) throw Error('Unknown image or category');
    if(seen.has(annotation.id)) throw Error('Duplicate annotation ID');
    seen.add(annotation.id);
    const b = annotation.bbox;
    if(!Array.isArray(b)||b.length!==4||!b.every(Number.isFinite)||b[0]<0||b[1]<0||b[2]<=0||b[3]<=0||b[0]+b[2]>image.width+.01||b[1]+b[3]>image.height+.01) throw Error('Invalid or out-of-bounds box');
    image.annotations.push({id:annotation.id,categoryId:annotation.category_id,label:categories.get(annotation.category_id),box:[b[0],b[1],b[0]+b[2],b[1]+b[3]],segmentation:annotation.segmentation??null,iscrowd:annotation.iscrowd??0,source:'dataset-annotation'});
  }
  return {schemaVersion:1,split,categories:coco.categories,images:[...images.values()]};
}

if(process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [input, output, split] = process.argv.slice(2);
  if(!input||!output) throw Error('Usage: node src/import-coco.js input.json output.json train|validation|test');
  if(resolve(input)===resolve(output)) throw Error('Keep the original annotations unchanged');
  const result = importCoco(JSON.parse(await readFile(input,'utf8')),split);
  await mkdir(dirname(output),{recursive:true});
  await writeFile(output,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
  console.log(`Imported ${result.images.length} images; retained original ${split} split`);
}
