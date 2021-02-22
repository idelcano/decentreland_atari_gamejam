import utils from "../../node_modules/decentraland-ecs-utils/index"
import { Sound } from "./Sound"

const champ_sound = new Sound(new AudioClip("sounds/destroyblock.wav"), false)
export class Parapeto extends Entity {
    constructor(position: Vector3, material: Material, scale: Vector3) {
        super()
        let shape = new BoxShape()
        shape.withCollisions = true
        this.addComponent(shape)
        this.addComponent(material)
        let transform = new Transform({ position: position, scale: scale }) 
        this.addComponent(transform)
        this.name = "parapeto"    
        let triggerBox = new utils.TriggerBoxShape(new Vector3(scale.x+2,scale.y,scale.z), Vector3.Zero())
        let trigger = new utils.TriggerComponent(triggerBox,
          {
            onTriggerEnter: (e) => {
              if (e.name == "bullet") {
                champ_sound.getComponent(AudioSource).playOnce()
                engine.removeEntity(this)
              }
            }, enableDebug: false
          }
        )
        this.addComponent(trigger)
        engine.addEntity(this)
    }
}