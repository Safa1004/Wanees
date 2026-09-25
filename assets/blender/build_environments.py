"""Detailed hospital props and illustrative Omani coastal environments."""
import pathlib
exec((pathlib.Path(__file__).parent/'build_cinematic.py').read_text().split("if __name__=='__main__'")[0])
base_equipment=equipment

def label(name,text,p,size,mat):
 c=bpy.data.curves.new(name,'FONT');c.body=text;c.size=size;c.extrude=.0005;c.align_x='CENTER';o=bpy.data.objects.new(name,c);bpy.context.collection.objects.link(o);o.location=p;o.rotation_euler=(math.pi/2,0,0);o.data.materials.append(mat)
 bpy.context.view_layer.objects.active=o;bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.ops.object.convert(target='MESH');return o

def equipment(kind,offset=(0,0,0)):
 start=set(bpy.data.objects);base_equipment(kind)
 steel=surface(material('PolishedSteel','#bec9c7',.82),.23);ink=material('EquipmentInk','#334c50');white=surface(material('MedicalIvory','#e8ece6'),.34);rubber=surface(material('Rubber','#294c4e'),.66);teal=surface(material('MedicalTeal','#477e7b'),.43)
 if kind=='thermometer':
  screen=material('LCD','#a5b9a1');box('DisplayGlass',(0,-.096,.25),(.147,.01,.147),screen,r=.006)
  label('DisplayDigits','36.7',(0,-.105,.24),.052,ink);label('Celsius','°C',(.046,-.105,.208),.021,ink)
  line('PowerSymbol',[(-.015,-.108,.01),(-.027,-.108,-.002),(0,-.111,-.025),(.027,-.108,-.002),(.015,-.108,.01)],.003,white)
  rod('ProbeTip',(0,0,-.655),(0,0,-.60),.046,steel)
  for x in [-.08,.08]:line('BodySeam',[(x,-.049,-.29),(x,-.069,.12),(x,-.049,.43)],.002,ink)
 elif kind=='stethoscope':
  rod('ChestPieceRim',(.31,-.055,-.65),(.31,-.025,-.65),.158,steel)
  rod('Diaphragm',(.31,-.061,-.65),(.31,-.055,-.65),.135,white)
  rod('ChestPieceStem',(.31,0,-.60),(.31,0,-.43),.035,steel)
  for k in [-1,1]:rod('BinauralCollar',(k*.303,0,.57),(k*.29,0,.62),.035,steel)
  line('Spring', [(-.25,0,.71),(0,0,.61),(.25,0,.71)],.012,steel)
 else:
  for x,y in [(.27,.22),(.83,.22),(.27,.67),(.83,.67)]:
   rod('BaseWheel',(x-.03,y,.11),(x+.03,y,.11),.07,rubber)
  for x in [-.58,-.22]:
   rod('TubeHousingFastener',(x,.197,2.16),(x,.21,2.16),.016,steel)
  line('TubeHandle',[(-.65,.18,2.05),(-.72,.18,2.10),(-.72,.18,2.23),(-.65,.18,2.27)],.02,teal)
  line('CableConduit',[(.65,.57,2.30),(.3,.62,2.45),(-.35,.6,2.43),(-.41,.6,2.32)],.019,rubber)
  for z in [1.13,1.27,1.41,1.55,1.69,1.83,1.97]:box('SupportScale',(.55,.322,z),(.045,.005,.008),ink,r=.001)
  box('DetectorSurface',(-1,-.109,1.44),(.54,.02,.70),white,r=.04)
  line('DetectorCrossH',[(-1.07,-.124,1.44),(-.93,-.124,1.44)],.003,teal);line('DetectorCrossV',[(-1,-.124,1.37),(-1,-.124,1.51)],.003,teal)
  box('TablePad',(-.12,-.12,.884),(1.71,.69,.035),material('TablePad','#c5d2cc'),r=.028)
  for k in [-1,1]:rod('TableRail',(-.94,k*.39-.12,.75),(.7,k*.39-.12,.75),.014,steel)
  for z in [1.58,1.64,1.70]:ball('ControlButton',(.55,.252,z),(.024,.008,.016),teal)
 for o in set(bpy.data.objects)-start:o.location+=Vector(offset)

def wheel(x,y,z=.105):
 steel=surface(material('PolishedSteel','#bec9c7',.82),.23);rubber=material('CasterRubber','#414849')
 rod('CasterFork',(x,y,z),(x,y,z+.12),.016,steel)
 rod('CasterWheel',(x-.025,y,z),(x+.025,y,z),.066,rubber)
 rod('CasterHub',(x-.027,y,z),(x+.027,y,z),.023,steel)

base_save=save_asset
def save_asset(name,character=False):
 if name.startswith('rooms/'):
  kind=name.split('/')[1];white=surface(material('MedicalIvory','#e8ece6'),.38);wood=surface(material('WarmOak','#b99a73'),.56,.1,30);metal=surface(material('PolishedSteel','#bec9c7',.82),.24);teal=surface(material('SeatFabric','#648f88'),.81);ink=material('Wayfinding','#355b58')
  surface(material('Limestone','#ddccb2'),.36,.12,90);surface(material('Plaster','#eeeae0'),.85,.08,130)
  if kind!='coast':
   # Clinical wall protection, glazing reveals, switches and framed wayfinding.
   box('RearSkirting',(0,1.976,.09),(5.92,.055,.18),white,r=.012)
   box('SideSkirting',(-2.89,0,.09),(.055,4.10,.18),white,r=.012)
   rod('WallHandrail',(-2.86,-1.7,.89),(-2.86,1.35,.89),.037,wood)
   for y in [-1.4,.0,1.1]:rod('HandrailBracket',(-2.92,y,.89),(-2.84,y,.89),.019,metal)
   for x in [-.48,.82]:
    box('SocketPlate',(x,1.988,.52),(.10,.022,.12),white,r=.009)
    for xx in [-.017,.017]:box('SocketSlot',(x+xx,1.973,.52),(.007,.005,.023),ink,r=.001)
   box('DoorRoomSign',(2.05,1.77,2.43),(1.01,.045,.22),white,r=.025)
   label('RoomName',{'entrance':'WELCOME','exit':'SEE YOU SOON','reception':'RECEPTION','assessment':'ASSESSMENT','xray':'IMAGING'}[kind],(2.05,1.739,2.405),.088,ink)
   for z in [1.38,2.45]:box('WindowReveal',(-1.55,1.835,z),(1.73,.14,.028),white,r=.006)
   for x in [-2.32,-.77]:
    box('CurtainRailBracket',(x,1.72,2.78),(.08,.20,.05),metal,r=.01)
   rod('CurtainRail',(-2.4,1.64,2.77),(-.7,1.64,2.77),.018,metal)
   curtain=surface(material('CurtainLinen','#d7ddd0'),.92)
   for x in [-2.3,-2.24,-2.18,-.92,-.86,-.8]:
    ball('GatheredCurtain',(x,1.69,1.96),(.046,.058,.72),curtain)
   # A quiet recessed linear luminaire along the back wall.
   box('LightHousing',(0,1.72,2.90),(3.8,.18,.055),white,r=.017)
   glow=material('WarmDiffuser','#fff2cf');bs=glow.node_tree.nodes['Principled BSDF'];bs.inputs['Emission Color'].default_value=(1,.87,.65,1);bs.inputs['Emission Strength'].default_value=.35
   box('LightDiffuser',(0,1.70,2.866),(3.6,.12,.009),glow,r=.004)
  if kind=='reception':
   for x in [-2.15,-1.45]:
    for k in [-1,1]:
     line('ChairArm',[(x+k*.30,-.11,.43),(x+k*.30,-.11,.72),(x+k*.30,.31,.72)],.021,metal)
     for y in [-.08,.30]:rod('ChairFoot',(x+k*.21,y,.04),(x+k*.21,y,.45),.017,metal)
    line('SeatPiping',[(x-.23,-.18,.55),(x,-.2,.553),(x+.23,-.18,.55)],.004,white)
   for x in [.0,.15,.3,.45,.6,.75,.9,1.05,1.2,1.35]:box('DeskFluting',(x,.428,.51),(.022,.027,.88),wood,r=.007)
   box('MonitorGlass',(.6,.799,1.36),(.425,.007,.258),material('MonitorScreen','#b6d3ce'),r=.008)
   for z in [1.29,1.34,1.39]:box('ScreenRow',(.61,.793,z),(.29,.004,.01),white,r=.002)
   box('Keyboard',(.59,.53,1.128),(.37,.13,.018),ink,r=.015)
   for x in [-.09,.01,.11]:box('Brochure',(.97+x,.78,1.18),(.07,.10,.16),teal,r=.005)
  elif kind=='assessment':
   for x in [-1.7,-.3]:
    for y in [-.05,.42]:wheel(x,y)
   for y in [-.23,.58]:
    line('BedSafetyRail',[(-1.2,y,.86),(-1.2,y,1.13),(-.65,y,1.13),(-.65,y,.86)],.022,metal)
   line('MattressPiping',[(-1.85,-.182,.86),(-1,-.19,.855),(-.15,-.182,.86)],.006,white)
   for x in [.79,1.31]:
    for y in [.72,1.08]:wheel(x,y,.09)
   for y in [.68,1.12]:rod('TrolleyRim',(.75,y,.74),(1.35,y,.74),.012,metal)
   box('TissueBox',(1.06,.9,.77),(.25,.16,.14),teal,r=.02)
   box('Tissue',(1.06,.9,.859),(.15,.07,.04),white,r=.015)
   box('SoapDispenser',(-2.88,1.15,1.55),(.13,.16,.26),white,r=.03)
   rod('SoapNozzle',(-2.8,1.15,1.46),(-2.73,1.15,1.46),.014,metal)
  elif kind in ['entrance','exit']:
   # Mashrabiya-inspired geometric screen: a designed setting, not a named hospital.
   for x in [-2.6+i*.18 for i in range(12)]:
    line('CourtyardScreen',[(x,1.76,.22),(x+.15,1.76,.47),(x,1.76,.72),(x+.15,1.76,.97)],.011,wood)
   for x in [-2.15,-1.93,-1.71,-1.49,-1.27,-1.05,-.83]:box('BenchSlat',(x,.65,.55),(.16,.52,.035),wood,r=.012)
  elif kind=='coast':
   for i in range(25):
    x=random.uniform(-3,3);y=random.uniform(-1.8,1.5);ball('BeachPebble',(x,y,.01),(random.uniform(.025,.075),random.uniform(.025,.06),.02),material('Pebble','#c1b59e'))
 base_save(name,character)

if __name__=='__main__':
 for n in ['stethoscope','thermometer','xray']:
  reset();equipment(n);save_asset(n)
 for n in ['entrance','reception','assessment','xray','exit']:room(n)
 coast()
 print('ENVIRONMENTS_COMPLETE')
