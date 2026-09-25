import fs from 'node:fs';
import assert from 'node:assert/strict';
import {GLTFLoader} from '../apps/web/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {MeshoptDecoder} from '../apps/web/node_modules/three/examples/jsm/libs/meshopt_decoder.module.js';
import {AnimationMixer, Box3} from '../apps/web/node_modules/three/build/three.module.js';
const root=new URL('../apps/web/public/models/',import.meta.url);
for(const name of ['wanees','amer','maryam','clinician-male','clinician-female','stethoscope','thermometer','xray',...['entrance','reception','assessment','xray','exit','coast'].map(x=>'rooms/'+x)]){
 if(process.argv[2]&&name!==process.argv[2])continue;
 const b=fs.readFileSync(new URL(name+'.glb',root));
 const gltf=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');
 gltf.scene.updateMatrixWorld(true);const box=new Box3().setFromObject(gltf.scene);
 assert.ok(!box.isEmpty() && Number.isFinite(box.max.y),`${name} invalid bounds`);
 if(gltf.animations.length){
  const rig=gltf.scene.getObjectByName('arm_R');assert.ok(rig,`${name} missing arm`);
  const mixer=new AnimationMixer(gltf.scene);const wave=gltf.animations.find(a=>a.name==='greeting');mixer.clipAction(wave).play();mixer.setTime(0);const before=rig.quaternion.clone();mixer.setTime(.9);
  assert.ok(before.angleTo(rig.quaternion)>.05,`${name} greeting does not move arm`);
  const morphs=[];gltf.scene.traverse(o=>{if(o.morphTargetInfluences?.length)morphs.push(o);});assert.ok(morphs.length>=2,`${name} missing eye shape keys`);
  mixer.setTime(43/24);assert.ok(morphs.some(o=>o.morphTargetInfluences.some(x=>x>.8)),`${name} blink not exported in greeting`);
  mixer.setTime(50/24);assert.ok(morphs.every(o=>o.morphTargetInfluences.every(x=>x<.05)),`${name} eyes fail to reopen`);
  mixer.stopAllAction();
 }
 console.log(`PASS ${name}: Three.js decoded, finite bounds${gltf.animations.length?', wave and blink evaluated':''}`);
}
