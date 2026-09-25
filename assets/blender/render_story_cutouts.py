"""Render transparent UI cutouts from the editable Blender scenes."""
from pathlib import Path
import bpy, sys
root=Path(__file__).resolve().parents[2]
out=root/'apps/web/public/story-art';out.mkdir(exist_ok=True)
for name in (sys.argv[1:] or ['wanees','amer','maryam','clinician-female','rooms-reception']):
 bpy.ops.wm.open_mainfile(filepath=str(root/'assets/blender'/f'{name}.blend'))
 scene=bpy.context.scene
 for ob in scene.objects:
  if ob.name.startswith('StudioGround'):ob.hide_render=True
 scene.render.film_transparent=True
 scene.render.image_settings.color_mode='RGBA'
 scene.render.resolution_x=600;scene.render.resolution_y=600;scene.render.resolution_percentage=100
 scene.cycles.samples=24;scene.cycles.use_denoising=True;scene.render.threads_mode='FIXED';scene.render.threads=4
 scene.frame_set(1);scene.render.filepath=str(out/f'{name}.png')
 bpy.ops.render.render(write_still=True)
 print('CUTOUT_READY',name,flush=True)
