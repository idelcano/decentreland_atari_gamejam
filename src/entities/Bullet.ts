import utils from "../../node_modules/decentraland-ecs-utils/index"
import { Globals } from "../ui/variables"
import { Sound } from "./Sound"
const audioClip = new AudioClip("sounds/fire.wav")
export class Bullet  {
  fire: boolean
  myentity: Entity
  constructor(entity: Entity, material: Material) {
    this.myentity = new Entity()
    this.myentity.name = "bullet"
    this.fire = false;
    let transform = new Transform()
    this.myentity.addComponent(transform) 
    let shape = new SphereShape()
    shape.withCollisions = false
    this.myentity.addComponent(shape)
    this.myentity.addComponent(material)
    this.myentity.getComponent(Transform).scale.setAll(0)
    engine.addEntity(this.myentity)
  }

  shoot(isBomb: boolean, global: Globals) {
    this.myentity.getComponent(Transform).scale.setAll(0.009)
    this.myentity.getComponent(Transform).scale.x =0.08
    if (global.showBullets() <= 0) {
      return;
    }
    if (global.showBullets() > 0) {
      global.decrementBullets()
    }
    new Sound(audioClip, false).playAudio()
    let casasize = new Vector3(0.09, 0.01, 0.01)
    let vector = new Vector3(0.14, 0, 0)
    let triggerBox = new utils.TriggerBoxShape(casasize, vector)
    let triggerComponent = new utils.TriggerComponent(
      triggerBox,
      {
        onTriggerEnter: (e) => {
          if (e.name == "ground" || e.name == "building" || e.name == "wall" || e.name == "enemy" || e.name == "parapeto" || e.name == "bomb" || e.name == "fruit") {
            global.incrementBullets()
            engine.removeEntity(this.myentity)
          }
        },
        enableDebug: false
      }
    )
    this.myentity.addComponent(triggerComponent)
    let transform = new Transform()
    transform.position.x = Camera.instance.position.x
    transform.position.y = Camera.instance.position.y - 0.8
    transform.position.z = Camera.instance.position.z + 0
    this.myentity.getComponent(Transform).position = transform.position

    let startPos = new Transform().position
    startPos.x = this.myentity.getComponent(Transform).position.x
    startPos.z = this.myentity.getComponent(Transform).position.z
    startPos.y = this.myentity.getComponent(Transform).position.y
    
      const TRAVEL_TIME = 3
      let endPos = new Vector3(16, this.myentity.getComponent(Transform).position.y, this.myentity.getComponent(Transform).position.z)
      let movement = new utils.MoveTransformComponent(startPos, endPos, TRAVEL_TIME, () => {
        global.incrementBullets()
        engine.removeEntity(this.myentity)
      })
      
    this.myentity.addComponent(movement)
  }
}

