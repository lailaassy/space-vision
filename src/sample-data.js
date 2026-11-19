import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../data/armbench/', import.meta.url));
const source = 'https://huggingface.co/datasets/amazon/armbench-segmentation/resolve/main/archive/armbench-segmentation-tiny.tar.gz';
const expected = '30f2539a2c8ae32ae25000ee9025657e2c49529cf9e513196597f9a94e7ca0d7';
await mkdir(root, {recursive:true});
let archive;
try { archive = await readFile(root + 'sample.tar.gz'); }
catch (error) {
  if(error.code !== 'ENOENT') throw error;
  const response = await fetch(source, {signal:AbortSignal.timeout(60000)});
  if(!response.ok) throw Error(`Download failed: ${response.status}`);
  const chunks = []; let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if(size > 3_000_000) throw Error('Sample exceeds expected download size');
    chunks.push(chunk);
  }
  archive = Buffer.concat(chunks);
}
if(createHash('sha256').update(archive).digest('hex') !== expected) throw Error('Sample checksum mismatch');
await writeFile(root + 'sample.tar.gz', archive);
const tar = gunzipSync(archive, {maxOutputLength:20_000_000});
const images = [];
for(let offset = 0; offset + 512 <= tar.length;) {
  const header = tar.subarray(offset, offset + 512);
  if(header.every(value => value === 0)) break;
  const name = header.subarray(0,100).toString().split('\0')[0];
  const size = parseInt(header.subarray(124,136).toString().replace(/\0/g,'').trim(),8);
  if(!Number.isSafeInteger(size) || size < 0 || offset + 512 + size > tar.length) throw Error('Invalid archive');
  if(/^\.\/armbench-segmentation-tiny\/[A-Z0-9]+\.jpg$/.test(name) && [0,48].includes(header[156])) {
    const filename = name.split('/').at(-1);
    const bytes = tar.subarray(offset + 512, offset + 512 + size);
    if(bytes[0] !== 255 || bytes[1] !== 216) throw Error('Invalid JPEG');
    await writeFile(root + filename, bytes);
    images.push({id:filename.slice(0,-4),file:filename,sha256:createHash('sha256').update(bytes).digest('hex'),split:'smoke-test',annotations:null});
  }
  offset += 512 + Math.ceil(size/512)*512;
}
if(images.length !== 5) throw Error('Expected five sample images');
await writeFile(root + 'manifest.json', JSON.stringify({schemaVersion:1,dataset:'ARMBench segmentation tiny',source,license:'CC-BY-4.0',credit:'Amazon.com, Inc.; Mitash et al. (2023)',archiveSha256:expected,usage:'Image-loading check only; no labels or accuracy results',images},null,2)+'\n');
console.log(`Prepared ${images.length} sample images in ${root}`);
