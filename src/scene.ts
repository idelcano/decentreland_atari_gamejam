
import utils from "../node_modules/decentraland-ecs-utils/index"
import { CustomPlayer } from "./entities/Customplayer"
import { Bullet } from "./entities/Bullet";
import { Wall } from "./entities/Wall";
import { invisibleBoundary } from "./entities/invisibleBoundary";
import { movePlayerTo } from "@decentraland/RestrictedActions";
import { CustomModel } from "./entities/CustomModel";
import { Sound } from "./entities/Sound";
import { Globals } from "./ui/variables";
import * as ui from '../node_modules/@dcl/ui-utils/index';
import { Spawner } from "./entities/Spawners";
import { Atari } from "./entities/atari";
import { Cartucho } from "./entities/cartucho";
import { TV } from "./entities/tv";
import { Panel } from "./ui/panel";
import { TextScore } from "./ui/textscore";
import { getScores } from "./network/api";
import { addTestCube } from "../node_modules/decentraland-ecs-utils/helpers/testCube";
const Z_OFFSET = 1.5
const GROUND_HEIGHT = 0.55
const start_sound = new Sound(new AudioClip("sounds/gamestart.wav"), false)
const pickUpSound = new Sound(new AudioClip("sounds/destroyblock.wav"), false)

export async function createPanel() {
  const font_size = 1
  let json = await getScores()
  let name = "NAME:"
  let score = "SCORE:"
  let comment = ""
  let i = 0
  await json.forEach(element => {
    i = i + 1
    name = name + "\n" + i + ". " + element.name + "\n\"" + element.comment.substring(0,45)+"\""
    score = score + "\n" + element.score + "\n"
    comment = comment + "\n" + element.comment
  });
  
  let panel_m = new Material()
  let panel_t = new Texture("images/topscores.png")
  let panel_i = new Material()
  let panel_it = new Texture("images/instructions.png")
  panel_i.albedoTexture = panel_it
  new Panel(new Vector3(3, 3.8, 3.9), panel_i, new Vector3(4, 7, 0.05), new Vector3(0, 1, 0), 180, 0, -0.01, 0)
  let text:string = "1. Get a cartridge \n2. Put the cartridge in the atari machine to play the game\n\n\n\n\n\n\n\n\n\nRecommended for a better experience:\n1. Press \"V\" to view your ship.\n2. Switch to day mode.\n\t- Click on the 3 dots menu in the bottom left corner\n\t- If you see \"Night mode\", click to switch to \"Day mode\"\n\n\n\n\n\nHow to play:\nMove your ship with left/right arrow buttons. \nClick the left mouse button to open fire.\n\nGamePlay:\nIf you don't want to die ...\nAvoid touching the bombs.\nAvoid touching the centipede.\n\nIf you want to get into the top 15...\nGet all the fruits as you can.\nKill as many centipedes as you can.\nEach new centipede will be faster.\n\nAll the cartridge are free for now!!"
  let myText_i = new TextShape(text)
  myText_i.color = Color3.White()
  myText_i.font = new Font(Fonts.SanFrancisco)
  myText_i.fontSize = font_size
  myText_i.outlineWidth = 0.1
  myText_i.outlineColor = Color3.Gray()
  myText_i.shadowColor = Color3.Gray()
  myText_i.shadowOffsetX = 1
  myText_i.shadowOffsetY = -1
  myText_i.shadowBlur = 2
  myText_i.hTextAlign = "left"
  myText_i.vTextAlign = "top"

  let entity_i = new Entity()
  entity_i.addComponent(
    new Transform({
      position: new Vector3(1.45, 5.5, 3.89)
    })
  )

  entity_i.addComponent(myText_i)
  engine.addEntity(entity_i)


  panel_m.albedoTexture = panel_t
  new Panel(new Vector3(8, 3.8, 3.9), panel_m, new Vector3(4, 7, 0.05), new Vector3(0, 1, 0), 180, 0, -0.01, 0)
  //let json_text =  panel.showText(await name, await score, await comment)
  let entity = new Entity()
  entity.addComponent(
    new Transform({
      position: new Vector3(6.45, 3.5, 3.89)
    })
  )
  let myText = new TextShape(name)
  myText.color = Color3.White()
  myText.font = new Font(Fonts.SanFrancisco)
  myText.fontSize = font_size


  entity.addComponent(myText)
  let shape = myText
  shape.outlineWidth = 0.1
  shape.outlineColor = Color3.Gray()
  shape.shadowColor = Color3.Gray()
  shape.shadowOffsetX = 1
  shape.shadowOffsetY = -1
  shape.shadowBlur = 2
  shape.hTextAlign = "left"
  engine.addEntity(entity)

  entity = new Entity()
  entity.addComponent(
    new Transform({
      position: new Vector3(9.5, 3.5, 3.89)
    })
  )
  myText = new TextShape(score)
  myText.fontSize = font_size
  myText.color = Color3.White()
  myText.font = new Font(Fonts.SanFrancisco)


  entity.addComponent(myText)
  shape = myText
  shape.outlineWidth = 0.1
  shape.outlineColor = Color3.Gray()
  shape.shadowColor = Color3.Gray()
  shape.shadowOffsetX = 1
  shape.shadowOffsetY = -1
  shape.hTextAlign = "right"
  shape.shadowBlur = 2
  engine.addEntity(entity)
}
drawTitle(new Vector3(0, 4.5, 8.5),new Vector3(0, 1, 0), 90);
drawTitle(new Vector3(16, 4.5, 8.5),new Vector3(0, 1, 0), 270);
drawTitle(new Vector3(8, 4.5, 16),new Vector3(0, 1, 0), 180.0006);
const tEntity = new Entity()
tEntity.addComponent(new PlaneShape())
let transform = new Transform({position: new Vector3(15.99,2.9,1.7)})
transform.rotate(new Vector3(0,1,0), 90)
transform.rotate(new Vector3(0,0,1), 179.9)
tEntity.addComponent(transform)
let material = new Material()
let thanks_texture = new Texture("images/thanks_button.png")
material.albedoTexture = thanks_texture
tEntity.addComponent(material)
tEntity.addComponent(
  new OnPointerDown(() => {
    openExternalURL("https://dcl.spanishmuseum.es/dcl/atari_gamejam_dclentipede/attributtions.md")
  }))
engine.addEntity(tEntity)

export class Scene {
  fire: boolean
  plane_position: Entity
  global: Globals
  crate: Cartucho
  crate_premium: Cartucho
  tv: Entity
  atari: Entity
  constructor(global: Globals) {
    this.fire = false;
    this.global = global
    this.createWorld(this.global)
  }

  createWorld(global: Globals) {
    global.preStartGame()
    createPanel()
    const base = new Entity()
    
    base.name = "ground"
    engine.addEntity(base)
    let wall_m = new Material()
    let wall_t = new Texture("images/ground.png")
    wall_m.albedoTexture = wall_t
    wall_m.bumpTexture = new Texture("images/ground_normal_map.png")
    new Wall(new Vector3(8, 4, 4), new Vector3(0, 0, 1), 360, wall_m, new Vector3(16, 8, 1))
    new Wall(new Vector3(0.001, 4, 8), new Vector3(0, 1, 0), 90, wall_m, new Vector3(16, 8, 1))
    new Wall(new Vector3(8, 4, 15.999), new Vector3(0, 0, 1), 360, wall_m, new Vector3(16, 8, 1))

    //front
    new Wall(new Vector3(15.999, 4, 8), new Vector3(0, 1, 0), 90, wall_m, new Vector3(16, 8, 1))
    //ground
    new Wall(new Vector3(8, 0, 8), new Vector3(1, 0, 0), 90, wall_m, new Vector3(16, 16, 1))  
    let invisible = new Material()
    invisible.alphaTest = 0.5
    invisible.albedoColor = new Color4(0, 0, 0, 0.6)
    new Wall(new Vector3(8, 8, 8), new Vector3(1, 0, 0), 90, wall_m, new Vector3(16, 16, 1))
    new invisibleBoundary(4, 1, 10, null, new Vector3(0, 1, 0), 90, false)
    new invisibleBoundary(3, 1, 10, null, new Vector3(0, 1, 0), 90, false)
    let jump_trigger_size = new Vector3(1, 1, 12)
    let triggerBox = new utils.TriggerBoxShape(jump_trigger_size, new Vector3(0, -0.48, 2.1))
    let jump_trigger = new utils.TriggerComponent(triggerBox,
      {
        onTriggerEnter: () => {
          log('JUMP TRIGGERED!')
          //engine.removeEntity(this)
          //new Bullet(this.plane_position, trigger, myMaterial_bullet).shoot(false)
        }, enableDebug: false
      }
    )
    new invisibleBoundary(3.5, 2.3, 10, jump_trigger, new Vector3(0, 1, 0), 90, true)

    let player = this.createUser()
    global.setPlayer(player)
    this.createBullets(global)

    this.createAssets(player, global);
  }
  public createAssets(player: CustomPlayer, global: Globals) {
    let casasize = new Vector3(0.5, 1, 0.5)
    this.crate = new Cartucho("models/cartucho.glb", 12.2, 3.9, casasize, "cartucho");
    this.crate_premium = new Cartucho("models/cartucho_p.glb", 12.8, 3.9, casasize, "premium");
    //this.tv = new TV("models/tv2.glb", 15, 3.4, casasize);
    // Controls
    this.createCrateLogic(this.crate, this.crate_premium, player, global, this);

    let atari = new Atari("models/atari.glb", 14, 1.5);

    let atari_collider = new Entity()
    atari_collider.addComponent(new BoxShape())
    let wall_m = new Material()
    
    let champs_t = new Texture("images/transparent.png")
    let champs_m = new Material()
    champs_m.albedoTexture = champs_t
    
    champs_m.transparencyMode=TransparencyMode.ALPHA_TEST
    //wall_m.alphaTest = 0
    atari_collider.addComponent(champs_m)
    wall_m.alphaTest = 1
    //atari_collider.addComponent(wall_m)
    atari_collider.addComponent(new Transform({position: new Vector3(13.8,0,1.2), scale: new Vector3(1.2,1,1.4)}))
    
    //atari_collider.getComponent(Transform).rotate(new Vector3(0, 1, 0), 220)
    this.atari = atari
    atari_collider.addComponent(
      new OnPointerDown(
        (e) => {
          if (this.crate.isGrabbed){
            //play
            engine.removeEntity(this.atari)
            this.crate.isGrabbed = false
            this.crate.setParent(null) // Remove parent
            this.crate.getComponent(Transform).position.x = 12.2
            this.crate.getComponent(Transform).position.z = 3.9
            this.crate.getComponent(Transform).position.y = 1.5
            start_sound.getComponent(AudioSource).playOnce() 
            ui.displayAnnouncement('V to change the view \n Click on left mouse button to open fire.', 
            5, Color4.Yellow(), 
            50,true)
            player.hide()
            movePlayerTo({ x: 3.5, y: 1, z: 8 }, { x: 8, y: 1, z: 8 })
            global.startGame(0)
            new Spawner()
  /*           engine.removeEntity(scene.atari)
            engine.removeEntity(scene.tv)
             engine.removeEntity(scene.crate_premium)
            engine.removeEntity(scene.crate) */
          }
          else if ( this.crate_premium.isGrabbed){
            engine.removeEntity(this.atari)
            this.crate_premium.isGrabbed = false
            this.crate_premium.setParent(null) // Remove parent
            this.crate_premium.getComponent(Transform).position.x = 12.8
            this.crate_premium.getComponent(Transform).position.z = 3.9
            this.crate_premium.getComponent(Transform).position.y = 1.5
            start_sound.getComponent(AudioSource).playOnce() 
            ui.displayAnnouncement('V to change the view \n Click on left mouse button to open fire.', 
            5, Color4.Yellow(), 
            50,true)
            player.hide()
            movePlayerTo({ x: 3.5, y: 1, z: 8 }, { x: 8, y: 1, z: 8 })
            global.startGame(1)
            new Spawner()
  /*           engine.removeEntity(scene.tv)
            engine.removeEntity(scene.crate_premium)
            engine.removeEntity(scene.crate) */
          }
        },
        { button: ActionButton.PRIMARY,
          showFeedback:true,
          hoverText:"Put cartridge to play game",
          distance: 8, }
      )
    )
    engine.addEntity(atari_collider)
  }

  createCrateLogic(crate: Cartucho, crate_premium: Cartucho, player: CustomPlayer, global: Globals, scene: Scene) {

    let onPointerDown = new OnPointerDown(
      () => {
        if (!crate.isGrabbed) {
          pickUpSound.getComponent(AudioSource).playOnce()
          crate.isGrabbed = true
          //pickUpSound.getComponent(AudioSource).playOnce()

          // Calculates the crate's position relative to the camera
          crate.getComponent(Transform).position = Vector3.Zero()
          //transform.rotation = Quaternion.Zero()
          crate.getComponent(Transform).position.z += Z_OFFSET
          crate.setParent(Attachable.AVATAR)
        } else {
          pickUpSound.getComponent(AudioSource).playOnce()
          crate.isGrabbed = false
          //putDownSound.getComponent(AudioSource).playOnce()

          // Calculate crate's ground position
          crate.setParent(null) // Remove parent
          let forwardVector: Vector3 = Vector3.Forward()
            .scale(Z_OFFSET)
            .rotate(Camera.instance.rotation)
          crate.getComponent(Transform).position = Camera.instance.position.clone().add(forwardVector)
          crate.getComponent(Transform).lookAt(Camera.instance.position)
          crate.getComponent(Transform).rotation.x = 0
          crate.getComponent(Transform).rotation.z = 0
          crate.getComponent(Transform).position.y = GROUND_HEIGHT
        }
      },
      {
        button: ActionButton.PRIMARY,
        hoverText: "Get cartridge",
        distance: 5
      }
    )
    crate.addComponent(onPointerDown)

    let onPointerDown_premium = new OnPointerDown(
      () => {
        if (!crate_premium.isGrabbed) {
          crate_premium.isGrabbed = true
          pickUpSound.getComponent(AudioSource).playOnce()

          // Calculates the crate's position relative to the camera
          crate_premium.getComponent(Transform).position = Vector3.Zero()
          //transform.rotation = Quaternion.Zero()
          crate_premium.getComponent(Transform).position.z += Z_OFFSET
          crate_premium.setParent(Attachable.AVATAR)
        } else {
          crate.isGrabbed = false
          pickUpSound.getComponent(AudioSource).playOnce()

          // Calculate crate's ground position
          crate_premium.setParent(null) // Remove parent
          let forwardVector: Vector3 = Vector3.Forward()
            .scale(Z_OFFSET)
            .rotate(Camera.instance.rotation)
          crate_premium.getComponent(Transform).position = Camera.instance.position.clone().add(forwardVector)
          crate_premium.getComponent(Transform).lookAt(Camera.instance.position)
          crate_premium.getComponent(Transform).rotation.x = 0
          crate_premium.getComponent(Transform).rotation.z = 0
          crate_premium.getComponent(Transform).position.y = GROUND_HEIGHT
        }
      },
      {
        button: ActionButton.PRIMARY,
        hoverText: "Get the HACKED cartridge (3 bullets!)",
        distance: 5
      }
    )
    crate_premium.addComponent(onPointerDown_premium)


  }

  createUser() {
    return new CustomPlayer()
  }

  createSound() {
    /* const clip = new AudioClip("materials/plane.mp3")
    const source = new AudioSource(clip)
    source.playing = true
    let audioentity = new Entity
    engine.addEntity(audioentity)
    audioentity.getComponent(Transform).position = Camera.instance.position */
    //new Sound(new AudioClip("sounds/music.mp3"), true)
  }
/* 
  createButton(position: Vector3, action: any, rotate: number) {
    let transform_button = new Transform({ position: position })
    transform_button.rotate(new Vector3(0, 1, 0), rotate)
    let startButton = new CustomModel("models/botton.glb",
      transform_button)

    startButton.addComponent(action)

    engine.addEntity(startButton)
  } */

  createBullets(global: Globals) {
    let input = Input.instance
    let myMaterial_bullet = new Material();
    myMaterial_bullet.albedoColor = Color3.Yellow()
    this.fire = false
    /*     input.subscribe("BUTTON_UP", ActionButton.PRIMARY, false, (e) => {
          log('Button up!')
          log(e)
          if (global.gameStarted){
            new Bullet(this.plane_position, myMaterial_bullet).shoot(true, global)
          }
    
        }) */
    // button down event
    input.subscribe("BUTTON_DOWN", ActionButton.POINTER, false, (e) => {
      if (global.gameStarted) {
        new Bullet(this.plane_position, myMaterial_bullet).shoot(false, global)
      }

    })
  }
}

function drawTitle(vector : Vector3, vector2: Vector3, grade:number) {
  const centipedeText = new TextShape("DLCentipede\n\n\nThe metarverse Centipede");
  centipedeText.fontSize = 10;
  centipedeText.color = Color3.Green();
  centipedeText.font = new Font(Fonts.SanFrancisco);
  centipedeText.outlineWidth = 0.1;
  centipedeText.outlineColor = Color3.Gray();
  centipedeText.shadowColor = Color3.Gray();
  centipedeText.shadowOffsetX = 1;
  centipedeText.shadowOffsetY = -1;
  centipedeText.shadowBlur = 1;
  const t1Entity = new Entity();
  let ttransform = new Transform({ position:  vector});
  ttransform.rotate(vector2, grade);
  //ttransform.rotate(new Vector3(0,0,1), 179.9) 
  t1Entity.addComponent(ttransform);
  t1Entity.addComponent(centipedeText);
  engine.addEntity(t1Entity);
}
