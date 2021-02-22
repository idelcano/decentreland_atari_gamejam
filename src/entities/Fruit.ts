import utils from "../../node_modules/decentraland-ecs-utils/index"
import * as ui from '../../node_modules/@dcl/ui-utils/index';
import { Globals } from "../ui/variables"
import { Sound } from "./Sound"
import { TimerSystem } from "../../node_modules/decentraland-ecs-utils/timer/system/timerSystem";

const fruit_sound = new Sound(new AudioClip("sounds/click.wav"), false)
//https://poly.google.com/view/fojR5i3h_nh ovni 1
const VELOCITY = 4

export class Fruit extends Entity implements ISystem {
  myEntity: Fruit
  global: Globals
  goAhead: boolean
  isLive: boolean
  type: string
  points: number
  constructor(model: GLTFShape, transform: Transform, global: Globals, type: string, points: number) {
    super()
    this.myEntity = this
    this.points = points
    this.type = type
    this.isLive = false
    this.global = global
    this.name = "fruit"
    this.addComponent(model)
    transform.scale = new Vector3(1, 1, 1)
    this.addComponent(transform)
    let triggerBox = new utils.TriggerBoxShape(new Vector3(0.9, 4, 0.9), Vector3.Zero())
    let enemy_trigger = new utils.TriggerComponent(triggerBox,
      {
        onCameraEnter: () => {
          global.killFruit(this.getComponent(Transform).position.x, this.getComponent(Transform).position.y, this.getComponent(Transform).position.z, type, points)
          engine.removeSystem(this.myEntity)
          engine.removeEntity(this.myEntity)
        },
        onTriggerEnter: (e) => {
          if (e.name == "bullet") {  
            fruit_sound.getComponent(AudioSource).playOnce()
          }
        }, enableDebug: false,
      }
    )
    this.addComponent(enemy_trigger)
    //engine.addEntity(this)
    engine.addEntity(this)
  }

  move(transform: Transform){
    this.myEntity.getComponent(Transform).position = transform.position
    this.isLive = true
    this.goAhead = true
    engine.addSystem(this.myEntity)
  }

  update(dt: number) {
    if ( this.global.gameStarted && this.goAhead){
      //log("go ahead! x "+ this.myEntity.getComponent(Transform).position.x +" y "+ this.myEntity.getComponent(Transform).position.y + " z "+this.myEntity.getComponent(Transform).position.z)
      let distance = Vector3.Left().scale(dt * VELOCITY)
      let transform = this.myEntity.getComponent(Transform)
      transform.translate(distance)
      if (this.myEntity.getComponent(Transform).position.x < 2){
        engine.removeEntity(this.myEntity)
        engine.removeSystem(this)
      }
    }
    if (!this.global.gameStarted && this.global.kill_all_enemies){
      engine.removeEntity(this.myEntity)
      engine.removeSystem(this)
    }
  }
}
