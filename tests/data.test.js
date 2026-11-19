import test from 'node:test';
import assert from 'node:assert/strict';
import {importCoco} from '../src/import-coco.js';
function fixture(){return {images:[{id:1,file_name:'images/a.jpg',width:100,height:80}],categories:[{id:7,name:'object'}],annotations:[{id:2,image_id:1,category_id:7,bbox:[10,20,30,40],segmentation:[[10,20,40,20,40,60]],iscrowd:1}]};}
test('retains masks, crowd flags and split while converting COCO boxes',()=>{
  const source=fixture(), result=importCoco(source,'test');
  assert.deepEqual(result.images[0].annotations[0].box,[10,20,40,60]);
  assert.deepEqual(result.images[0].annotations[0].segmentation,source.annotations[0].segmentation);
  assert.equal(result.images[0].annotations[0].iscrowd,1);
  assert.equal(result.images[0].split,'test');
});
test('rejects broken annotation references and boxes',()=>{
  let source=fixture();source.annotations[0].image_id=9;assert.throws(()=>importCoco(source,'train'),/Unknown/);
  source=fixture();source.annotations[0].bbox=[90,20,30,40];assert.throws(()=>importCoco(source,'train'),/box/);
});
test('rejects traversal, duplicate IDs and unrecorded splits',()=>{
  let source=fixture();source.images[0].file_name='../private.jpg';assert.throws(()=>importCoco(source,'train'),/path/);
  source=fixture();source.images.push({...source.images[0]});assert.throws(()=>importCoco(source,'test'),/Duplicate/);
  assert.throws(()=>importCoco(fixture(),'random'),/split/);
});
