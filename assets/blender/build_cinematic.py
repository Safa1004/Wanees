"""Reference-led, editable Wanees character and environment revision.
Run using the supplied Blender CPU Docker image. All geometry authored here.
"""
import pathlib, sys, random
exec((pathlib.Path(__file__).parent/'build_assets.py').read_text().split("if '--clinicians-only'")[0])
random.seed(21)
oldball=ball
# Smooth, higher-resolution silhouettes, still suitable for interactive rendering.
def ball(name,p,s,mat,bone=None):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=20,location=p);o=bpy.context.object;o.scale=s
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 return finish(o,name,mat,bone)

def ring(name,z,rx,ry,mat,bone='spine',y=0,r=.006):
 return line(name,[(rx*math.cos(a),y+ry*math.sin(a),z) for a in [j*math.tau/48 for j in range(49)]],r,mat,bone)

def cloth(name,levels,mat,bone='spine',fold=.008):
 verts=[];faces=[];n=64
 for z,rx,ry in levels:
  for j in range(n):
   a=j*math.tau/n;w=fold*(math.cos(a*12)+.35*math.sin(a*19))
   verts.append(((rx+w)*math.cos(a),(ry+w*.6)*math.sin(a),z))
 for i in range(len(levels)-1):
  for j in range(n):a=i*n+j;b=i*n+(j+1)%n;faces.append((a,b,b+n,a+n))
 faces.append(tuple(range(n-1,-1,-1)));faces.append(tuple((len(levels)-1)*n+j for j in range(n)))
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update();o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o)
 finish(o,name,mat,bone);mod=o.modifiers.new('Tailored smooth silhouette','SUBSURF');mod.levels=2
 bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=mod.name);return o

def join_parts():
 # Collapse rigidly weighted details into a few draw calls, keeping feature toggles.
 global BIND
 groups={}
 for o,b in BIND:
  prefix=next((p for p in ['welcome_','everyday_','glasses_','mobility_','cap_','mask_'] if o.name.startswith(p)),'')
  key=(b,prefix,o.data.materials[0].name)
  groups.setdefault(key,[]).append(o)
 BIND=[]
 for (bone,prefix,mat),objects in groups.items():
  bpy.ops.object.select_all(action='DESELECT')
  for o in objects:o.select_set(True)
  bpy.context.view_layer.objects.active=objects[0];bpy.ops.object.join();o=bpy.context.object;o.name=f'{prefix}{mat}_{bone}';BIND.append((o,bone))

def surface(mat,rough=.5,noise=0,scale=90):
 bs=mat.node_tree.nodes.get('Principled BSDF');bs.inputs['Roughness'].default_value=rough
 if noise:
  nt=mat.node_tree;n=nt.nodes.new('ShaderNodeTexNoise');n.inputs['Scale'].default_value=scale;n.inputs['Detail'].default_value=2
  bump=nt.nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=noise;bump.inputs['Distance'].default_value=.025
  nt.links.new(n.outputs['Fac'],bump.inputs['Height']);nt.links.new(bump.outputs['Normal'],bs.inputs['Normal'])
 return mat

def face(female=False):
 # Soft storybook proportions: inset eyes, no raised eye rings, a small button nose.
 skin=surface(material('Skin','#d39c7e'),.7);skin.node_tree.nodes['Principled BSDF'].inputs['Subsurface Weight'].default_value=.055
 ear=material('EarWarmth','#c68e79');hair=surface(material('Hair','#443026'),.69)
 white=surface(material('EyeIvory','#fff7e9'),.35);iris=surface(material('Iris','#795238'),.36);pupil=surface(material('Pupil','#34241f'),.28)
 lip=material('Lip','#a36f5c');gold=surface(material('Gold','#d4a249',.6),.38)
 h=ball('Face',(0,0,1.855),(.344,.25,.345),skin,'head')
 for v in h.data.vertices:
  if v.co.z<0:v.co.x*=1+.08*v.co.z/.345
 ball('Neck',(0,.025,1.49),(.115,.11,.19),skin,'spine')
 for k in [-1,1]:
  ball('Ear',(.33*k,.014,1.845),(.063,.049,.085),skin,'head')
  ball('EarConcha',(.35*k,-.028,1.847),(.027,.011,.047),ear,'head')
  ball('EyeWhite',(.128*k,-.232,1.899),(.085,.032,.087),white,'head')
  ball('Iris',(.128*k,-.261,1.899),(.061,.012,.071),iris,'head')
  ball('Pupil',(.128*k,-.271,1.902),(.035,.006,.045),pupil,'head')
  ball('Catchlight',(.114*k,-.279,1.923),(.012,.004,.014),white,'head')
  ball('SmallCatchlight',(.143*k,-.277,1.882),(.004,.002,.005),white,'head')
  line('Brow',[(k*.064,-.215,2.015),(k*.13,-.218,2.029),(k*.191,-.185,2.014)],.009,hair,'head')
  if female:
   line('Lash',[(k*.19,-.237,1.935),(k*.207,-.232,1.942)],.004,hair,'head')
 ball('NoseTip',(0,-.237,1.806),(.039,.035,.031),skin,'head')
 line('Smile',[(-.073,-.222,1.724),(0,-.235,1.707),(.073,-.222,1.724)],.005,lip,'head')
 ball('HairCrown',(0,.068,2.047),(.341,.259,.204),hair,'head')
 global BIND
 facial=[o for o,b in BIND if b=='head' and o.data.materials[0]==skin and o.name.startswith(('Face','Nose','Ear'))]
 bpy.ops.object.select_all(action='DESELECT')
 for o in facial:o.select_set(True)
 bpy.context.view_layer.objects.active=facial[0];BIND=[(o,b) for o,b in BIND if o not in facial]
 bpy.ops.object.join();o=bpy.context.object;o.name='SculptedFace'
 rem=o.modifiers.new('Unified facial sculpt','REMESH');rem.mode='VOXEL';rem.voxel_size=.006;rem.use_smooth_shade=True;bpy.ops.object.modifier_apply(modifier=rem.name)
 sm=o.modifiers.new('Soft facial transitions','SMOOTH');sm.factor=1;sm.iterations=4;bpy.ops.object.modifier_apply(modifier=sm.name)
 BIND.append((o,'head'))
 return skin,hair,white,gold

def flower(name,x,y,z,r,mat,bone='spine'):
 for k in range(5):
  a=math.tau*k/5
  line(name,[(x,y,z),(x+r*.65*math.cos(a-.35),y-.002,z+r*.65*math.sin(a-.35)),(x+r*math.cos(a),y-.004,z+r*math.sin(a)),(x+r*.65*math.cos(a+.35),y-.002,z+r*.65*math.sin(a+.35)),(x,y,z)],.003,mat,bone)
 ball(name,(x,y-.005,z),(.007,.004,.007),mat,bone)

def human(name,clinical=False):
 reset();skeleton();female=name in ['maryam','clinician-female'];skin,hair,white,gold=face(female)
 sage=surface(material('WelcomeSage','#949f89'),.78);red=surface(material('WelcomeCrimson','#b95664'),.75);green=material('WelcomeLeaf','#668c51');stitch=material('WelcomeIvory','#e6e3c9');olive=material('KummaEmbroidery','#515e43');clothmat=surface(material('Scrubs' if clinical else 'EverydayCloth','#45817f' if clinical else '#b96051' if female else '#688d98'),.75)
 navy=material('Trousers','#354953');shoe=surface(material('Leather','#705c4c'),.7)
 cloth('Body' if clinical else 'everyday_Body',[(.77,.28,.17),(.82,.30,.18),(1.15,.29,.19),(1.35,.30,.17),(1.45,.19,.13),(1.47,.12,.105)],clothmat)
 for k in [-1,1]:
  b='arm_L' if k<0 else 'arm_R';leg='leg_L' if k<0 else 'leg_R'
  rod('TrouserLeg',(.16*k,0,.18),(.16*k,0,.83),.105,navy,leg)
  ball('Shoe',(.16*k,-.075,.09),(.12,.225,.09),shoe,leg)
  line('ShoeSeam',[(k*.16-.09,-.22,.12),(k*.16,-.26,.12),(k*.16+.09,-.22,.12)],.004,stitch,leg)
  a=(.29*k,0,1.37);end=(.49*k,-.005,.91)
  rod('Sleeve' if clinical else 'everyday_Sleeve',end,a,.09,clothmat,b,r2=.135)
  ball('Hand',(.505*k,-.005,.823),(.067,.055,.105),skin,b)
  for j in range(4):ball('Finger',((.465+j*.024)*k,-.033,.779),(.016,.035,.049-(abs(j-1.5)*.006)),skin,b)
  thumb=ball('Thumb',(.45*k,-.042,.833),(.025,.036,.052),skin,b);thumb.rotation_euler[1]=k*.4
 if not clinical:
  dress=red if female else sage;bottom=.36 if female else .2
  cloth('welcome_Tunic' if female else 'welcome_Dishdasha',[(bottom,.36,.235),(bottom+.03,.37,.24),(.72,.335,.212),(1.1,.295,.19),(1.33,.3,.17),(1.43,.20,.125),(1.45,.115,.106)],dress,fold=.009)
  for k in [-1,1]:
   b='arm_L' if k<0 else 'arm_R';rod('welcome_Sleeve',(.49*k,0,.895),(.3*k,0,1.38),.095,dress,b,r2=.14)
   rod('welcome_Cuff',(.489*k,0,.897),(.466*k,0,.961),.099,green if female else olive,b,r2=.107)
   for z in [.907,.947]:line('welcome_CuffStitch',[(k*.40,-.075,z),(k*.48,-.10,z),(k*.56,-.075,z)],.004,stitch,b)
  if female:
   # Green embroidered placket on the curved front, cream loopwork and red floral stitchwork.
   box('welcome_Placket',(0,-.197,1.184),(.142,.025,.40),green,'spine',.016)
   for k in [-1,1]:
    line('welcome_Collar',[(k*.09,-.10,1.435),(k*.23,-.135,1.37),(k*.12,-.199,1.3),(k*.08,-.214,1.04)],.021,green,'spine')
    line('welcome_CollarStitch',[(k*.09,-.119,1.432),(k*.22,-.155,1.369),(k*.1,-.218,1.3),(k*.063,-.218,1.02)],.004,stitch,'spine')
    for z in [1.05,1.1,1.15,1.2,1.25]:
     line('welcome_Loopwork',[(k*.081,-.216,z),(k*.115,-.211,z+.012),(k*.122,-.21,z-.005),(k*.081,-.216,z-.019)],.0035,stitch,'spine')
   for z in [.48,.66,.84,1.02,1.2]:
    rx=.365-(z-.4)*.07;ry=.237-(z-.4)*.053
    for x in [-.245,-.13,0,.13,.245]:
     if z>1 and abs(x)<.14:continue
     y=-ry*math.sqrt(max(.1,1-(x/rx)**2))-.009
     flower('welcome_FloralEmbroidery',x,y,z,.045,material('RoseStitch','#d87983'))
   for z in [.4,.425]:ring('welcome_HemStitch',z,.362,.24,stitch)
   # Sculpted flowing hair behind the shoulders with separate swept front locks.
   ball('HairMass',(0,.17,1.81),(.35,.20,.45),hair,'head')
   for k in [-1,1]:
    for j in range(5):
     x=k*(.18+j*.038);y=.13+j*.014
     line('HairWave',[(x*.85,y,2.08),(x*1.18,y+.025,1.94),(x*1.04,y+.065,1.7),(x*1.32,y+.07,1.5),(x*1.14,y+.07,1.34)],.037,hair,'head')
    line('HairFringe',[(k*.01,-.04,2.19),(k*.17,-.205,2.15),(k*.26,-.19,2.03),(k*.29,-.125,1.97)],.05,hair,'head')
    for j in range(3):line('HairHighlight',[(k*(.1+j*.045),-.207,2.15),(k*(.2+j*.026),-.228,2.10),(k*(.26+j*.014),-.16,1.99)],.004,material('HairGlint','#684322'),'head')
    ball('welcome_Earring',(.36*k,-.055,1.69),(.039,.025,.049),gold,'head')
    rod('welcome_EarringHook',(.36*k,-.054,1.69),(.36*k,-.054,1.77),.006,gold,'head')
    for j in [-1,0,1]:ball('welcome_EarringDrop',(.36*k+j*.017,-.055,1.632),(.008,.008,.014),gold,'head')
   for z,r in [(2.17,.015),(2.115,.022),(2.04,.047)]:
    ball('welcome_ForeheadPendant',(0,-.276,z),(r,.014,r),gold,'head')
    if r>.025:
     for j in range(12):
      a=j*math.tau/12;ball('welcome_PendantPearl',(.036*math.cos(a),-.29,z+.036*math.sin(a)),(.005,.004,.005),stitch,'head')
  else:
   line('welcome_Placket',[(0,-.113,1.44),(0,-.193,1.24),(0,-.213,.95)],.005,olive,'spine')
   line('welcome_Furakha',[(.025,-.153,1.4),(.055,-.205,1.31),(.035,-.215,1.19)],.016,olive,'spine')
   for j in range(5):line('welcome_Tassel',[(.035,-.216,1.22),(.021+j*.007,-.218,1.17)],.004,olive,'spine')
   cloth('welcome_Kumma',[(2.065,.325,.26),(2.09,.331,.266),(2.255,.326,.265),(2.29,.30,.245),(2.325,.23,.19),(2.34,.02,.02)],white,'head',0)
   for z in [2.086,2.103,2.255,2.271]:ring('welcome_KummaBorder',z,.332,.267,olive,'head',r=.004)
   for j in range(20):
    a=j*math.tau/20
    for side in [-1,1]:
     points=[]
     for q in range(17):
      t=q/16;ang=a+side*.085*math.sin(t*math.pi);points.append((.333*math.cos(ang),.268*math.sin(ang),2.12+.12*t))
     line('welcome_KummaPetal',points,.0035,olive,'head')
 else:
  if female:
   # Distinct female Omani clinician: a soft open-front headscarf, never a swapped male label.
   scarf=surface(material('ClinicianScarf','#baa0ba'),.83)
   verts=[];faces=[];n=48
   levels=[(1.42,.24,.15),(1.55,.31,.18),(1.8,.365,.28),(2.03,.368,.30),(2.20,.28,.24),(2.27,.03,.025)]
   for z,rx,ry in levels:
    for j in range(n+1):
     a=-.24+(math.pi+.48)*j/n
     verts.append((rx*math.cos(a),.035+ry*math.sin(a),z))
   for k in range(len(levels)-1):
    for j in range(n):
     q=k*(n+1)+j;faces.append((q,q+1,q+n+2,q+n+1))
   mesh=bpy.data.meshes.new('ClinicianScarf');mesh.from_pydata(verts,[],faces);mesh.update()
   ob=bpy.data.objects.new('hijab_Drape',mesh);bpy.context.collection.objects.link(ob);finish(ob,'hijab_Drape',scarf,'head')
   mod=ob.modifiers.new('Soft scarf fabric','SOLIDIFY');mod.thickness=.012
   bpy.context.view_layer.objects.active=ob;bpy.ops.object.modifier_apply(modifier=mod.name)
   line('hijab_FaceBorder',[(-.33,-.025,1.73),(-.34,-.055,2.02),(-.24,-.17,2.16),(0,-.22,2.23),(.24,-.17,2.16),(.34,-.055,2.02),(.33,-.025,1.73)],.033,scarf,'head')
   line('hijab_ShoulderFold',[(-.24,-.06,1.5),(0,-.14,1.43),(.25,-.055,1.54)],.038,scarf,'head')
  box('Pocket',(.16,-.195,1.12),(.14,.025,.15),clothmat,'spine',.014)
  box('Badge',(-.16,-.195,1.29),(.095,.024,.13),white,'spine',.012)
  for z in [1.27,1.30]:box('BadgeText',(-.16,-.21,z),(.06,.004,.005),navy,'spine',.001)
  ball('cap_SurgicalCap',(0,.065,2.08),(.35,.29,.225),clothmat,'head')
  box('mask_ProcedureMask',(0,-.337,1.75),(.39,.05,.205),material('Mask','#b2d2ca'),'head',.025)
  for z in [1.70,1.75,1.80]:line('mask_Pleat',[(-.17,-.366,z),(0,-.369,z-.008),(.17,-.366,z)],.0035,white,'head')
  for k in [-1,1]:line('mask_EarLoop',[(k*.18,-.34,1.82),(k*.34,-.015,1.85),(k*.18,-.34,1.68)],.005,white,'head')
 for k in [-1,1]:
  line('glasses_Frame',[(k*.033,-.31,1.96),(k*.23,-.30,1.96),(k*.23,-.30,1.79),(k*.033,-.31,1.79),(k*.033,-.31,1.96)],.009,navy,'head')
 line('glasses_Bridge',[(-.033,-.31,1.9),(.033,-.31,1.9)],.009,navy,'head')
 rod('mobility_Crutch',(.63,0,.05),(.58,0,1.1),.022,material('Aluminium','#a9b6b5',.7),'root')
 rod('mobility_Grip',(.51,0,.8),(.68,0,.8),.028,navy,'root')
 for o,b in BIND:
  if 'Sleeve' in o.name:
   bpy.context.view_layer.objects.active=o;bev=o.modifiers.new('Soft sleeve hems','BEVEL');bev.width=.04;bev.segments=4;bpy.ops.object.modifier_apply(modifier=bev.name)
 join_parts();animate();save_asset(name,True)

def fleece(name,center,radii,count,bone):
 wool=surface(material('CreamWool','#eee1bf'),.9,.55,145)
 ball(name,center,radii,wool,bone)
 # Golden-angle surface distribution: overlapping little irregular curls, actual GLB geometry.
 for i in range(count):
  z=1-2*(i+.5)/count;a=i*2.39996323;r=math.sqrt(1-z*z);v=(r*math.cos(a),r*math.sin(a),z)
  p=tuple(center[j]+radii[j]*v[j] for j in range(3));size=random.uniform(.035,.058)
  oldball(name+'Curl',p,(size*1.05,size*.9,size),wool,bone)

def sheep():
 reset();skeleton();dark=surface(material('Charcoal','#53524f'),.78,.01,75);ear=surface(material('InnerEar','#a08278'),.66);white=surface(material('EyeIvory','#fffcf1'),.24);black=surface(material('Pupil','#302b28'),.4);boot=surface(material('BootOchre','#dba52b'),.36);sole=surface(material('BootSole','#9e7325'),.57)
 fleece('WoolBody',(0,.06,1.03),(.37,.27,.49),600,'spine');fleece('Tail',(0,.31,.83),(.105,.12,.20),100,'spine')
 muzzle=ball('LongMuzzle',(0,-.06,1.73),(.278,.24,.32),dark,'head')
 for v in muzzle.data.vertices:
  if v.co.z<0:
   amount=-v.co.z/.32;v.co.x*=1+.23*amount
   if v.co.y<0:v.co.y=v.co.y*(1+.25*amount)-.027*amount
 fleece('WoolCap',(0,.0,2.045),(.26,.215,.165),260,'head')
 for k in [-1,1]:
  e=ball('FloppyEar',(.365*k,.00,1.91),(.24,.072,.11),dark,'head');e.rotation_euler[1]=k*.4
  e=ball('EarInterior',(.383*k,-.062,1.908),(.182,.018,.066),ear,'head');e.rotation_euler[1]=k*.4
  ball('EyeWhite',(.106*k,-.272,1.92),(.082,.044,.092),white,'head');ball('Pupil',(.104*k,-.317,1.923),(.048,.016,.058),black,'head');ball('Catchlight',(.095*k,-.331,1.942),(.011,.004,.013),white,'head')
  line('Brow',[(k*.045,-.255,2.012),(k*.10,-.268,2.03),(k*.17,-.235,2.017)],.008,dark,'head')
  ball('Nostril',(.10*k,-.298,1.58),(.017,.007,.012),black,'head')
  arm='arm_L' if k<0 else 'arm_R';leg='leg_L' if k<0 else 'leg_R'
  line('Arm',[(k*.24,0,1.32),(k*.43,-.015,1.12),(k*.45,-.06,.78)],.05,dark,arm)
  ball('Hand',(k*.45,-.065,.75),(.069,.06,.09),dark,arm)
  for j in [-1,1]:ball('Finger',(k*.45+j*.03,-.09,.715),(.026,.04,.045),dark,arm)
  rod('Leg',(k*.15,.03,.2),(k*.15,.03,.67),.048,dark,leg,r2=.055)
  ball('Boot',(k*.15,-.065,.13),(.105,.17,.13),boot,leg);rod('BootShaft',(k*.15,.018,.12),(k*.15,.018,.27),.078,boot,leg,r2=.07)
  ball('BootSole',(k*.15,-.068,.037),(.108,.173,.033),sole,leg)
  for j in [-1,0,1]:line('BootTread',[(k*.15+j*.052,-.218,.035),(k*.15+j*.052,-.222,.062)],.004,sole,leg)
  line('BootRim',[(k*.15+.074*math.cos(a),.018+.074*math.sin(a),.27) for a in [j*math.tau/32 for j in range(33)]],.008,sole,leg)
 join_parts();animate();save_asset('wanees',True)

base_animate=animate
def animate():
 base_animate()
 # Coordinated eyelid-like eye compression; shape keys remain editable in Blender.
 for o,bone in BIND:
  mat=o.data.materials[0].name
  if not any(mat.startswith(n) for n in ['EyeIvory','Iris','Pupil']):continue
  o.shape_key_add(name='Basis');blink=o.shape_key_add(name='Blink')
  center=1.92 if 'Charcoal' in M else 1.899
  for v in blink.data:
   world=o.matrix_world @ v.co
   if world.z>1.76:
    world.z=center+(world.z-center)*.045;v.co=o.matrix_world.inverted() @ world
  keys=o.data.shape_keys;keys.animation_data_create()
  for clip in ['idle','greeting','listening','pointing','demonstrating','breathing','encouragement','goodbye']:
   keys.animation_data.action=None
   frames=[(1,0),(40,0),(43,1),(46,0),(97,0)]
   if clip=='breathing':frames += [(136,0),(139,1),(142,0),(193,0)]
   for f,value in frames:blink.value=value;blink.keyframe_insert('value',frame=f)
   act=keys.animation_data.action;act.name=clip+'_eyes';track=keys.animation_data.nla_tracks.new();track.name=clip;track.strips.new(clip,1,act);track.mute=True
  keys.animation_data.action=None;blink.value=0
 bpy.context.scene.frame_set(1)

base_studio=studio
def studio():
 cam=base_studio();s=bpy.context.scene;s.cycles.samples=28;s.cycles.use_denoising=True;s.render.threads_mode='FIXED';s.render.threads=4;s.render.resolution_x=800;s.render.resolution_y=800
 cam.location=(2.5,-8,3.0);cam.rotation_euler=(Vector((0,0,1.15))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.ortho_scale=2.85
 bpy.ops.object.light_add(type='AREA',location=(-2,3,4));o=bpy.context.object;o.name='Soft rim';o.data.energy=450;o.data.size=3;o.rotation_euler=(Vector((0,0,1.2))-o.location).to_track_quat('-Z','Y').to_euler()
 return cam

if __name__=='__main__':
 names=sys.argv[1:] or ['wanees','amer','maryam','clinician-male','clinician-female']
 for n in names:
  if n=='wanees':sheep()
  elif n in ['amer','maryam','clinician-male','clinician-female']:human(n,n.startswith('clinician'))
 print('CINEMATIC_ASSETS_COMPLETE')
