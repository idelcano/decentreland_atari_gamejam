import utils from "../../node_modules/decentraland-ecs-utils/index"
import { Globals } from "../ui/variables"
export class CustomPlayer extends Entity {
  fire: boolean
  plane: Entity
  global: Globals
  constructor() {
    super()
    let plane = this
    plane.addComponent(new GLTFShape("models/player.glb"))
    plane.addComponent(new Transform({ position: new Vector3(0, 0.05, -0.10), scale: new Vector3(0.1, 0.1, 0.1) }))
    plane.getComponent(Transform).scale.setAll(0)
    plane.name= "player"
    
    engine.addEntity(plane)
    plane.setParent(Attachable.AVATAR)
    this.plane = plane
    const hideAvatarsEntity = new Entity()
    hideAvatarsEntity.addComponent(new AvatarModifierArea({
      area: { box: new Vector3(14, 4, 12) },
      modifiers: [AvatarModifiers.HIDE_AVATARS, AvatarModifiers.DISABLE_PASSPORTS]
    }))
    hideAvatarsEntity.addComponent(new Transform({ position: new Vector3(8, 2, 10.5) }))
    engine.addEntity(hideAvatarsEntity)
    hideAvatarsEntity.addComponent(
      new utils.TriggerComponent(
        new utils.TriggerBoxShape(new Vector3(14, 4, 11), Vector3.Zero())
      )
    )
  }
  hide(){
    log("player: hide")
    this.plane.getComponent(Transform).scale.setAll(0.8)
  }
  show(){
    log("player: show")
    this.plane.getComponent(Transform).scale.setAll(0)
  }
}