import bpy,pathlib,json
root=pathlib.Path(__file__).resolve().parents[1]
clip=bpy.data.movieclips.load(str(root/'Cast-motion.mp4'))
assert clip.size[0]==640 and clip.size[1]==426,tuple(clip.size)
assert clip.frame_duration>=48,clip.frame_duration
result={'file':'Cast-motion.mp4','width':clip.size[0],'height':clip.size[1],'frames':clip.frame_duration}
(root/'docs/MOTION-PREVIEW-VERIFICATION.json').write_text(json.dumps(result,indent=2)+'\n')
print('PASS',result)
