import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve(import.meta.dirname,'../apps/web/public');
const clips = ['idle','greeting','listening','pointing','demonstrating','breathing','encouragement','goodbye'];
const names=['wanees','maryam','amer','clinician-female','clinician-male','stethoscope','thermometer','xray',...['entrance','reception','assessment','xray','exit','coast'].map(n=>'rooms/'+n)];
const report=[];
for(const name of names){
 const file=path.join(root,'models',name+'.glb');const b=fs.readFileSync(file);
 assert.equal(b.toString('utf8',0,4),'glTF');assert.equal(b.readUInt32LE(4),2);assert.equal(b.readUInt32LE(8),b.length);
 const json=JSON.parse(b.toString('utf8',20,20+b.readUInt32LE(12)));
 assert.ok(json.meshes?.length>0);assert.ok(!json.buffers.some(b=>b.uri),'All buffers must be embedded');
 const animations=(json.animations||[]).map(a=>a.name);
 if(['wanees','maryam','amer','clinician-female','clinician-male'].includes(name))for(const c of clips)assert.ok(animations.includes(c),`${name} missing ${c}`);
 if(['wanees','maryam','amer','clinician-female','clinician-male'].includes(name))assert.ok(json.skins?.length>0,`${name} needs an actual skeleton`);
 if(['maryam','amer'].includes(name))for(const prefix of ['welcome_','glasses_','mobility_'])assert.ok(json.nodes.some(n=>n.name?.startsWith(prefix)));
 assert.ok(b.length<8_000_000,`${name} exceeds 8 MB asset budget`);
 report.push({name,bytes:b.length,meshes:json.meshes.length,skins:json.skins?.length||0,animations});
}
fs.writeFileSync(path.resolve(import.meta.dirname,'../docs/3D-ASSET-VERIFICATION.json'),JSON.stringify(report,null,2)+'\n');
console.log(`PASS ${names.length} valid self-contained GLBs; named clips, character skeletons and appearance nodes verified.`);
