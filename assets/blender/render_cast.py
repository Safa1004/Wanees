"""Editable cast presentation and real Blender-rendered motion preview."""
import bpy, pathlib, math
from mathutils import Vector
ROOT=pathlib.Path(__file__).resolve().parents[2]
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
for name,x in [('maryam',-1.05),('wanees',0),('amer',1.05)]:
 with bpy.data.libraries.load(str(ROOT/'assets/blender'/f'{name}.blend'),link=False) as (src,dst):
  dst.objects=[n for n in src.objects if n not in ['StudioGround','Camera','Key','Fill','Soft rim']]
 objects=[o for o in dst.objects if o]
 for o in objects:bpy.context.collection.objects.link(o)
 for o in objects:
  if o.parent is None:o.location.x+=x
  if o.animation_data:
   for t in o.animation_data.nla_tracks:t.mute=t.name!='greeting'
  if o.type=='MESH' and o.data.shape_keys and o.data.shape_keys.animation_data:
   for t in o.data.shape_keys.animation_data.nla_tracks:t.mute=t.name!='greeting'
  if o.name.startswith(('glasses_','mobility_','cap_','mask_','everyday_')):o.hide_render=True
# Curved-light studio is deliberately kept separate from exported interactive geometry.
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=24;s.cycles.use_denoising=True;s.render.threads_mode='FIXED';s.render.threads=4
s.world.use_nodes=True;s.world.node_tree.nodes['Background'].inputs[0].default_value=(.55,.62,.60,1);s.world.node_tree.nodes['Background'].inputs[1].default_value=.45
m=bpy.data.materials.new('Warm studio');m.diffuse_color=(.68,.64,.54,1)
bpy.ops.mesh.primitive_plane_add(size=200);bpy.context.object.data.materials.append(m)
for p,power,size in [((1,-4,6),700,5),((-4,-2,3),380,4),((1,3,5),600,3)]:
 bpy.ops.object.light_add(type='AREA',location=p);o=bpy.context.object;o.data.energy=power;o.data.size=size;o.rotation_euler=(Vector((0,0,1))-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(2,-11,3.5));o=bpy.context.object;o.rotation_euler=(Vector((0,0,1.12))-o.location).to_track_quat('-Z','Y').to_euler();o.data.type='ORTHO';o.data.ortho_scale=4.35;s.camera=o
s.view_settings.view_transform='AgX';s.render.resolution_x=1280;s.render.resolution_y=854;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.frame_end=97;s.render.fps=24;s.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/Cast.blend'))
s.render.filepath=str(ROOT/'Cast-preview.png');bpy.ops.render.render(write_still=True)
if '--movie' in __import__('sys').argv:
 s.cycles.samples=8;s.render.resolution_x=640;s.render.resolution_y=426;s.render.fps=12;s.frame_step=2
 s.render.image_settings.file_format='FFMPEG';s.render.ffmpeg.format='MPEG4';s.render.ffmpeg.codec='H264';s.render.ffmpeg.constant_rate_factor='HIGH';s.render.filepath=str(ROOT/'Cast-motion.mp4')
 bpy.ops.render.render(animation=True)
print('CAST_PRESENTATION_COMPLETE')
