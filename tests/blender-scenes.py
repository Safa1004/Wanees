"""Open delivered Blender scenes and validate editable geometry, rigs and actions."""
import bpy,pathlib,json
root=pathlib.Path(__file__).resolve().parents[1];report=[]
for path in sorted((root/'assets/blender').glob('*.blend')):
 bpy.ops.wm.open_mainfile(filepath=str(path));objects=list(bpy.context.scene.objects)
 meshes=[o for o in objects if o.type=='MESH'];assert meshes,path.name
 assert bpy.context.scene.camera,path.name+' missing presentation camera'
 rigs=[o for o in objects if o.type=='ARMATURE']
 if path.stem in ['wanees','amer','maryam','clinician-male','clinician-female']:
  assert len(rigs)==1
  tracks={t.name for t in rigs[0].animation_data.nla_tracks}
  assert {'idle','greeting','listening','pointing','demonstrating','breathing','encouragement','goodbye'}<=tracks
  assert any(o.data.shape_keys for o in meshes),path.name+' missing blink shapes'
  assert any(t.name=='idle' and not t.mute for t in rigs[0].animation_data.nla_tracks)
 report.append({'file':path.name,'meshes':len(meshes),'rigs':len(rigs)})
print(json.dumps(report,indent=2))
(root/'docs/BLENDER-SCENE-VERIFICATION.json').write_text(json.dumps(report,indent=2)+'\n')
print('PASS: all delivered editable scenes opened')
