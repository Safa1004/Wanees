"""Original Wanees assets. Run with Blender 4.5 LTS --background --python this_file.
Editable named meshes, articulated character rigs, reusable GLBs and rendered 2D alternatives.
No external meshes/textures are used. See docs/3D-ASSET-HANDOFF.md for review limits.
"""
import bpy, math, pathlib, json
from mathutils import Vector
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/'apps/web/public/models'; POSTERS=ROOT/'apps/web/public/posters'
OUT.mkdir(parents=True,exist_ok=True); POSTERS.mkdir(exist_ok=True)
M={}; BIND=[]; RIG=None

def material(name,hex,metal=0):
 if name in M:return M[name]
 h=hex.lstrip('#');srgb=[int(h[i:i+2],16)/255 for i in (0,2,4)];rgb=[c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4 for c in srgb]
 m=bpy.data.materials.new(name);m.diffuse_color=(*rgb,1);m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(*rgb,1);bs.inputs['Roughness'].default_value=.72;bs.inputs['Metallic'].default_value=metal;M[name]=m;return m

def reset():
 global M,BIND,RIG
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 for a in list(bpy.data.actions):bpy.data.actions.remove(a)
 M={};BIND=[];RIG=None

def finish(o,name,mat,bone=None):
 o.name=name;o.data.materials.append(mat)
 for p in o.data.polygons:p.use_smooth=True
 if bone:BIND.append((o,bone))
 return o

def ball(name,p,s,mat,bone=None):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=20,ring_count=12,location=p);o=bpy.context.object;o.scale=s
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 return finish(o,name,mat,bone)

def box(name,p,s,mat,bone=None,r=.04):
 bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.scale=s;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 if r:
  mod=o.modifiers.new('Soft manufactured edges','BEVEL');mod.width=r;mod.segments=3;bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=mod.name)
 mod=o.modifiers.new('Weighted corner normals','WEIGHTED_NORMAL');bpy.ops.object.modifier_apply(modifier=mod.name)
 return finish(o,name,mat,bone)

def rod(name,a,b,r,mat,bone=None,r2=None):
 d=Vector(b)-Vector(a);bpy.ops.mesh.primitive_cone_add(vertices=20,radius1=r,radius2=r if r2 is None else r2,depth=d.length,location=(Vector(a)+Vector(b))/2)
 o=bpy.context.object;o.rotation_euler=d.to_track_quat('Z','Y').to_euler();return finish(o,name,mat,bone)

def line(name,points,r,mat,bone=None):
 curve=bpy.data.curves.new(name,'CURVE');curve.dimensions='3D';curve.bevel_depth=r;curve.bevel_resolution=3;curve.use_fill_caps=True
 sp=curve.splines.new('BEZIER');sp.bezier_points.add(len(points)-1)
 for bp,p in zip(sp.bezier_points,points):bp.co=p;bp.handle_left_type='AUTO';bp.handle_right_type='AUTO'
 o=bpy.data.objects.new(name,curve);bpy.context.collection.objects.link(o);bpy.context.view_layer.objects.active=o;o.select_set(True)
 for ob in bpy.context.selected_objects:
  if ob!=o:ob.select_set(False)
 bpy.ops.object.convert(target='MESH');return finish(bpy.context.object,name,mat,bone)

def skeleton():
 global RIG
 bpy.ops.object.armature_add(location=(0,0,0));RIG=bpy.context.object;RIG.name='CompanionRig';bpy.ops.object.mode_set(mode='EDIT');eb=RIG.data.edit_bones;eb.remove(eb[0])
 specs=[('root',(0,0,0),(0,0,.5),None),('spine',(0,0,.8),(0,0,1.48),'root'),('head',(0,0,1.45),(0,0,2.08),'spine'),('arm_L',(-.35,0,1.35),(-.5,0,.83),'spine'),('arm_R',(.35,0,1.35),(.5,0,.83),'spine'),('leg_L',(-.17,0,.8),(-.17,0,.14),'root'),('leg_R',(.17,0,.8),(.17,0,.14),'root')]
 for n,h,t,parent in specs:
  b=eb.new(n);b.head=h;b.tail=t
  if parent:b.parent=eb[parent]
 bpy.ops.object.mode_set(mode='OBJECT');RIG.show_in_front=True

def animate():
 for o,bone in BIND:
  vg=o.vertex_groups.new(name=bone);vg.add(list(range(len(o.data.vertices))),1,'REPLACE');mod=o.modifiers.new('Articulated rig','ARMATURE');mod.object=RIG;o.parent=RIG
 RIG.animation_data_create()
 for name in ['idle','greeting','listening','pointing','demonstrating','breathing','encouragement','goodbye']:
  RIG.animation_data.action=None
  keys = [(1,0),(49,.5),(97,1),(145,.5),(193,0)] if name=='breathing' else [(1,0),(25,1),(49,.5),(73,1),(97,0)]
  for f,w in keys:
   for p in RIG.pose.bones:p.rotation_mode='XYZ';p.rotation_euler=(0,0,0);p.scale=(1,1,1)
   if name in ['greeting','goodbye']:
    RIG.pose.bones['arm_R'].rotation_euler[2]=-.95*w;RIG.pose.bones['arm_R'].rotation_euler[0]=-.18*w
   elif name=='pointing':RIG.pose.bones['arm_L'].rotation_euler[2]=.85*w
   elif name=='listening':RIG.pose.bones['head'].rotation_euler[1]=.12*w
   elif name=='demonstrating':
    RIG.pose.bones['arm_L'].rotation_euler[0]=-.45*w;RIG.pose.bones['arm_R'].rotation_euler[0]=-.45*w;RIG.pose.bones['head'].rotation_euler[0]=.08*w
   elif name=='encouragement':RIG.pose.bones['head'].rotation_euler[0]=.12*w
   else:RIG.pose.bones['spine'].scale=(1+.015*w,1+.02*w,1+.008*w)
   for p in RIG.pose.bones:p.keyframe_insert('rotation_euler',frame=f);p.keyframe_insert('scale',frame=f)
  act=RIG.animation_data.action;act.name=name;track=RIG.animation_data.nla_tracks.new();track.name=name;track.strips.new(name,1,act);track.mute=True
 RIG.animation_data.action=None
 for p in RIG.pose.bones:p.rotation_euler=(0,0,0);p.scale=(1,1,1)
 bpy.context.scene.frame_set(1)

def person(name,clinician=False):
 reset();skeleton()
 skin=material('Skin','#b88059' if name in ['amer','clinician-male'] else '#c48b67');hair=material('Hair','#292b2a');white=material('Ivory','#f4efdf');teal=material('Scrubs','#45817f');ink=material('Ink','#283d3b');gold=material('Embroidery','#d4af6c');clay=material('EverydayCloth','#b65e4d' if name=='maryam' else '#608791');navy=material('Trousers','#344e5a')
 ball('Face',(0,-.015,1.82),(.32,.265,.38),skin,'head');ball('HairCrown',(0,.025,2.03),(.33,.27,.19),hair,'head')
 for k in [-1,1]:
  ball('Ear',(.32*k,0,1.83),(.062,.08,.1),skin,'head')
  ball('EyeWhite',(.12*k,-.257,1.87),(.064,.02,.078),white,'head');ball('Eye',(.12*k,-.277,1.87),(.036,.016,.049),ink,'head');ball('EyeLight',(.11*k,-.292,1.886),(.011,.008,.015),white,'head')
  line('Brow',[(k*.17,-.254,1.99),(k*.12,-.274,2.005),(k*.065,-.254,1.99)],.011,hair,'head')
  rod('Leg',(.17*k,0,.14),(.17*k,0,.8),.115,navy,'leg_L' if k<0 else 'leg_R')
  box('Shoe',(.17*k,-.075,.075),(.24,.4,.15),white,'leg_L' if k<0 else 'leg_R',.055)
  b='arm_L' if k<0 else 'arm_R'
  rod('Sleeve' if clinician else 'everyday_Sleeve',(.35*k,0,1.35),(.46*k,0,1.00),.105,teal if clinician else clay,b)
  rod('Forearm',(.46*k,0,1.0),(.50*k,-.025,.83),.078,skin,b)
  ball('Hand',(.50*k,-.025,.8),(.082,.07,.1),skin,b)
 ball('Nose',(0,-.282,1.79),(.045,.046,.059),skin,'head')
 line('Smile',[(-.075,-.256,1.69),(0,-.278,1.675),(.075,-.256,1.69)],.009,ink,'head')
 box('Body' if clinician else 'everyday_Body',(0,0,1.13),(.64,.35,.66),teal if clinician else clay,'spine',.105)
 rod('Neck',(0,0,1.35),(0,0,1.58),.12,skin,'spine')
 if name=='clinician-female':ball('TiedHair',(0,.25,1.95),(.16,.13,.16),hair,'head')
 if name=='maryam':
  for k in [-1,1]:
   ball('HairTail',(.29*k,.12,1.78),(.115,.13,.29),hair,'head');ball('HairTie',(.30*k,.075,1.94),(.08,.08,.05),gold,'head')
 if not clinician:
  if name=='amer':
   rod('welcome_Dishdasha',(0,0,.23),(0,0,1.43),.38,white,'spine',.335)
   line('welcome_NeckOpening',[(-.07,-.302,1.4),(0,-.326,1.35),(.07,-.302,1.4)],.015,gold,'spine')
   line('welcome_Furakha',[(.035,-.323,1.36),(.06,-.349,1.24),(.085,-.356,1.17)],.022,white,'spine')
   rod('welcome_Kumma',(0,.005,2.045),(0,.005,2.235),.322,white,'head')
   for j in range(24):
    a=j*math.tau/24;x=.324*math.cos(a);y=.005+.324*math.sin(a)
    line('welcome_KummaStitch',[(x,y,2.08),(x*.985,y*.985,2.14),(x,y,2.20)],.007,gold,'head')
   for k in [-1,1]:rod('welcome_LongSleeve',(.34*k,0,1.36),(.49*k,0,.87),.12,white,'arm_L' if k<0 else 'arm_R')
  else:
   rod('welcome_EmbroideredTunic',(0,0,.43),(0,0,1.43),.39,clay,'spine',.335)
   for k in [-1,1]:rod('welcome_TunicSleeve',(.34*k,0,1.36),(.48*k,0,.96),.12,clay,'arm_L' if k<0 else 'arm_R')
   for x in [-.1,-.05,0,.05,.1]:line('welcome_Embroidery',[(x,-.30,1.34),(x,-.34,1.1),(x,-.37,.96)],.009,gold,'spine')
   for z in [.49,.53]:line('welcome_Hem',[(-.28,-.25,z),(0,-.39,z),(.28,-.25,z)],.012,gold,'spine')
 else:
  box('Pocket',(.17,-.19,1.09),(.14,.028,.15),teal,'spine',.015)
  box('Badge',(-.15,-.195,1.3),(.105,.02,.13),white,'spine',.01)
  ball('cap_SurgicalCap',(0,.06,2.08),(.35,.34,.24),teal,'head')
  box('mask_ProcedureMask',(0,-.345,1.75),(.40,.07,.22),material('Mask','#acd4d0'),'head',.035)
  for k in [-1,1]:line('mask_EarLoop',[(k*.2,-.35,1.83),(k*.33,-.03,1.84),(k*.2,-.35,1.67)],.007,white,'head')
 if clinician:
  lens=material('ProtectiveLens','#b9d8d4');lens.node_tree.nodes['Principled BSDF'].inputs['Alpha'].default_value=.23; lens.surface_render_method='DITHERED'
  box('glasses_Shield',(0,-.31,1.86),(.53,.025,.17),lens,'head',.025)
 for k in [-1,1]:
  line('glasses_Frame',[(k*.03,-.293,1.91),(k*.21,-.283,1.91),(k*.21,-.283,1.8),(k*.03,-.293,1.8),(k*.03,-.293,1.91)],.012,ink,'head')
 line('glasses_Bridge',[(-.03,-.294,1.87),(.03,-.294,1.87)],.012,ink,'head')
 rod('mobility_Crutch',(.62,-.04,.08),(.56,-.04,1.08),.022,material('Aluminium','#9cacaa',.45),'root')
 rod('mobility_Grip',(.48,-.04,.81),(.65,-.04,.81),.025,ink,'root')
 animate();save_asset(name,character=True)

def equipment(kind,offset=(0,0,0)):
 start=set(bpy.data.objects);white=material('MedicalIvory','#e8ece6');teal=material('MedicalTeal','#477e7b');metal=material('Aluminium','#a9b6b5',.55);dark=material('Display','#273f43');rubber=material('Rubber','#294c4e')
 if kind=='stethoscope':
  line('FlexibleTubing',[(-.3,0,.6),(-.4,0,.25),(-.3,0,-.22),(0,0,-.36),(.31,0,-.17),(.31,0,-.65)],.047,rubber)
  for k in [-1,1]:
   line('BinauralTube',[(k*.3,0,.57),(k*.22,0,.86),(k*.12,0,.98)],.026,metal);ball('EarTip',(k*.12,0,.98),(.048,.05,.07),rubber)
  rod('ChestPiece',(.31,-.04,-.65),(.31,.04,-.65),.17,metal);rod('Diaphragm',(.31,-.049,-.65),(.31,-.041,-.65),.14,white)
 elif kind=='thermometer':
  box('ThermometerBody',(0,0,.08),(.25,.16,.92),white,r=.08);rod('Probe',(0,0,-.65),(0,0,-.37),.045,metal)
  box('Display',(0,-.085,.25),(.18,.016,.2),dark,r=.014);ball('PowerButton',(0,-.092,0),(.047,.014,.047),teal)
 else:
  box('GeneratorBase',(.55,.45,.12),(.8,.7,.22),white)
  box('VerticalSupport',(.55,.45,1.36),(.22,.24,2.5),white)
  box('ArticulatedArm',(.05,.45,2.28),(1.05,.2,.18),metal)
  box('TubeHousing',(-.4,.45,2.13),(.48,.48,.45),white,r=.08)
  box('Collimator',(-.4,.45,1.85),(.25,.27,.13),dark)
  box('DetectorStand',(-1,.1,1.1),(.2,.2,2.15),metal)
  box('UprightDetector',(-1,-.02,1.44),(.64,.16,.83),teal)
  box('TableTop',(-.12,-.12,.8),(1.8,.75,.13),white)
  box('TablePedestal',(-.12,-.05,.43),(.66,.46,.69),teal)
  box('ControlPanel',(.55,.28,1.64),(.17,.035,.25),dark,r=.014)
 for o in set(bpy.data.objects)-start:o.location+=Vector(offset)

def plant(x,y):
 pot=material('Clay','#bd805e');green=material('Leaves','#5c7e67')
 rod('Planter',(x,y,0),(x,y,.4),.20,pot,r2=.24)
 for k in range(7):
  a=k*math.tau/7;line('Leaf',[(x,y,.3),(x+.2*math.cos(a),y+.2*math.sin(a),.8),(x+.34*math.cos(a),y+.34*math.sin(a),.72)],.045,green)

def room(kind):
 reset();limestone=material('Limestone','#ddccb2');wall=material('Plaster','#eeeae0');wood=material('WarmOak','#b99a73');teal=material('SeatFabric','#648f88');glass=material('WindowBlue','#9cbdc2');white=material('MedicalIvory','#e8ece6');dark=material('DarkTeal','#355b58')
 box('Floor',(0,0,-.1),(6.2,4.8,.2),limestone)
 box('RearWall',(0,2.1,1.5),(6.2,.16,3.1),wall)
 box('SideWall',(-3,0,1.5),(.16,4.2,3.1),wall)
 for x in [-1.8,-.6,.6,1.8]:box('FloorJoint',(x,0,.004),(.009,4.5,.009),white,r=0)
 for y in [-1.6,-.4,.8]:box('FloorJoint',(0,y,.004),(6,.009,.009),white,r=0)
 box('WindowFrame',(-1.55,1.98,1.91),(1.85,.12,1.65),white)
 box('Window',(-1.55,1.9,1.91),(1.65,.035,1.46),glass,r=.01)
 for x in [-2.07,-1.03]:box('WindowMullion',(x,1.87,1.91),(.035,.055,1.46),white,r=.006)
 box('DoorFrame',(2.05,1.96,1.15),(1.18,.16,2.3),wood)
 box('Door',(2.05,1.85,1.1),(1.04,.08,2.16),dark)
 box('VisionPanel',(2.05,1.79,1.62),(.62,.03,.64),glass)
 rod('DoorHandle',(1.67,1.75,.9),(1.67,1.75,1.1),.019,white)
 # Original understated coastal wall panel, not a photograph or location claim.
 box('CoastalArtFrame',(.25,1.94,1.85),(1.0,.11,.72),wood)
 box('SeaPanel',(.25,1.87,1.85),(.9,.02,.61),glass,r=.008)
 line('Coastline',[(-.18,1.85,1.7),(.04,1.85,1.78),(.3,1.85,1.68),(.67,1.85,1.75)],.018,white)
 if kind in ['entrance','exit']:
  for x in [-2.65,-1.95,-1.25,-.55,.15,.85,1.55,2.25]:box('ShadeSlat',(x,.4,3.05),(.13,3.7,.14),wood)
  plant(-2.5,.9);plant(2.5,-1.0)
  box('CourtyardBench',(-1.4,.65,.47),(1.7,.55,.13),wood)
  for x in [-2.05,-.75]:box('BenchLeg',(x,.65,.23),(.1,.48,.46),white)
  # Flush route and open front avoid a decorative inaccessible step.
 elif kind=='reception':
  box('ReceptionDesk',(.5,.78,.52),(2.0,.67,1.04),wood)
  box('AccessibleCounter',(-.62,.78,.77),(.65,.75,.09),white)
  box('CounterTop',(.57,.78,1.07),(1.9,.76,.09),white)
  box('Screen',(.6,.84,1.36),(.48,.07,.31),dark)
  rod('MonitorStem',(.6,.86,1.08),(.6,.86,1.23),.035,dark)
  for x in [-2.15,-1.45]:
   box('WaitingSeat',(x,.12,.49),(.55,.57,.12),teal)
   box('SeatBack',(x,.38,.85),(.55,.12,.63),teal)
   for xx in [-.19,.19]:rod('ChairLeg',(x+xx,.13,.04),(x+xx,.13,.45),.03,dark)
  plant(2.6,.7)
 elif kind=='assessment':
  box('ExaminationBed',(-1,.18,.82),(1.9,.72,.2),teal)
  for x in [-1.7,-.3]:box('BedSupport',(x,.18,.38),(.09,.6,.76),white)
  box('Pillow',(-1.58,.18,.98),(.43,.58,.12),white,r=.06)
  box('Trolley',(1.05,.9,.65),(.66,.48,.09),white)
  box('TrolleyShelf',(1.05,.9,.25),(.66,.48,.09),white)
  for x in [.8,1.3]:rod('TrolleyUpright',(x,.9,.1),(x,.9,.67),.025,dark)
  box('Sink',(-2.82,1.13,1.05),(.44,.69,.15),white)
  line('Tap',[(-2.89,1.35,1.1),(-2.89,1.35,1.28),(-2.69,1.35,1.28)],.026,dark)
 elif kind=='xray':equipment('xray',(-.2,.6,0))
 save_asset('rooms/'+kind)

def coast():
 reset();sand=material('CoastalSand','#d8c49e');sea=material('CoastalSea','#6ba9ae');foam=material('SoftFoam','#dcece3');rock=material('MountainLimestone','#a69b83');wood=material('ShadeWood','#a88762')
 box('Shore',(0,0,-.12),(7,5,.2),sand)
 box('Sea',(0,4,-.15),(12,6,.2),sea)
 for y in [2.15,2.5,3.2,4.4]:line('GentleWaterline',[(-5,y,-.025),(-2,y+.12,-.025),(1,y,-.025),(5,y+.1,-.025)],.017,foam)
 for x,z in [(-4,1.4),(-2,2.0),(0,1.5),(2,1.8),(4,1.2)]:
  vertices=[(x-1.7,6,0),(x+1.7,6,0),(x,6,z),(x,7.1,.2)]
  mesh=bpy.data.meshes.new('MountainSilhouette');mesh.from_pydata(vertices,[],[(0,1,2),(0,2,3),(1,3,2)]);mesh.materials.append(rock);obj=bpy.data.objects.new('MountainSilhouette',mesh);bpy.context.collection.objects.link(obj)
 for x in [-2.7,-1.2]:rod('ShadePost',(x,.6,0),(x,.6,2.6),.065,wood)
 for x in [-2.8,-2.5,-2.2,-1.9,-1.6,-1.3,-1.0]:box('ShadedPergola',(x,.6,2.65),(.1,1.7,.1),wood)
 box('SeatedRest',(-1.9,.7,.45),(1.5,.5,.12),wood)
 for x in [-2.45,-1.35]:box('BenchLeg',(x,.7,.21),(.1,.45,.42),wood)
 save_asset('rooms/coast')

def studio():
 scene=bpy.context.scene;scene.render.fps=24;scene.render.engine='CYCLES';scene.cycles.samples=16
 scene.render.resolution_x=560;scene.render.resolution_y=560;scene.render.resolution_percentage=100
 scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(.8,.84,.81,1);scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.4;scene.render.image_settings.file_format='PNG';scene.render.film_transparent=False
 box('StudioGround',(0,0,-.05),(200,200,.1),material('StudioSand','#eee8d7'))
 for name,p,energy,size in [('Key',(3,-4,6),550,5),('Fill',(-4,-2,3),320,4)]:
  bpy.ops.object.light_add(type='AREA',location=p);o=bpy.context.object;o.name=name;o.data.energy=energy;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector((0,0,1))-o.location).to_track_quat('-Z','Y').to_euler()
 bpy.ops.object.camera_add(location=(3.1,-6,3.0));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,1.1))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=3.1;scene.camera=cam
 scene.view_settings.view_transform='AgX';return cam

def save_asset(name,character=False):
 # Export before adding lights/camera. All optional parts stay in GLB for runtime controls.
 path=OUT/(name+'.glb');path.parent.mkdir(exist_ok=True)
 bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',export_animations=character,export_animation_mode='NLA_TRACKS',export_nla_strips_merged_animation_name='idle',export_force_sampling=True,export_materials='EXPORT',export_yup=True)
 cam=studio()
 if name.startswith('rooms/'):
  cam.location=(7,-10,7);cam.rotation_euler=(Vector((0,.3,1))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.ortho_scale=8.2
  bpy.data.objects['StudioGround'].location.z=-.35
 if name in ['stethoscope','thermometer']:
  bpy.data.objects['StudioGround'].location.z=-1.1
  cam.location=(1.2,-6,1.5);cam.rotation_euler=(Vector((0,0,0))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.ortho_scale=2.4
 if character:
  for o in bpy.data.objects:
   if o.name.startswith(('glasses_','mobility_','cap_','mask_','everyday_')):o.hide_render=True
  # Welcome outfits appear in preview, but can be changed in the web experience.
 bpy.context.scene.render.filepath=str(POSTERS/(name.replace('/','-')+'.png'))
 if character:
  bpy.context.scene.frame_end=97
  for ob in bpy.data.objects:
   if ob.animation_data:
    for track in ob.animation_data.nla_tracks:track.mute=track.name!='idle'
   if ob.type=='MESH' and ob.data.shape_keys and ob.data.shape_keys.animation_data:
    for track in ob.data.shape_keys.animation_data.nla_tracks:track.mute=track.name!='idle'
  if RIG:
   bpy.ops.object.select_all(action='DESELECT');RIG.select_set(True);bpy.context.view_layer.objects.active=RIG
 bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender'/(name.replace('/','-')+'.blend')))
 bpy.ops.render.render(write_still=True)
 if name in ['maryam','amer']:
  for o in bpy.data.objects:
   if o.name.startswith('welcome_'):o.hide_render=True
   if o.name.startswith('everyday_'):o.hide_render=False
  bpy.context.scene.render.filepath=str(POSTERS/(name+'-everyday.png'));bpy.ops.render.render(write_still=True)

if '--clinicians-only' in __import__('sys').argv:
 __import__('sys').argv=[__file__,'clinician-female','clinician-male']
 __import__('runpy').run_path(str(pathlib.Path(__file__).with_name('build_cinematic.py')),run_name='__main__')
else:
 __import__('sys').argv=[__file__]
 __import__('runpy').run_path(str(pathlib.Path(__file__).with_name('build_cinematic.py')),run_name='__main__')
 __import__('runpy').run_path(str(pathlib.Path(__file__).with_name('build_environments.py')),run_name='__main__')
