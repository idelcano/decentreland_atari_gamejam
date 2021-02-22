import utils from "../../node_modules/decentraland-ecs-utils/index"
export class Building extends Entity {
  constructor(model: string, pos_x: number, pos_z: number, size: Vector3) {
    super()
    const TRAVEL_TIME = 3
    this.name = "building"
    engine.addEntity(this)
    this.addComponent(new GLTFShape(model))
    this.addComponent(new Transform())
    this.getComponent(Transform).scale.set(0.2, 0.2, 0.2)
    this.getComponent(Transform).position.set(pos_x, 0, pos_z)
    this.getComponent(Transform).rotate(new Vector3(0, 1, 0), 90)
    let myentity = this
/*     let triggerBox = new utils.TriggerBoxShape(size, Vector3.Zero())
    let triggerComponent = new utils.TriggerComponent(
      triggerBox,
      {
        onTriggerEnter: (e) => {
          log(e.name)
          if (e.name == "bullet") {
            log('TRIGGERED building!')

            let endPos = new Vector3(myentity.getComponent(Transform).position.x, -4, myentity.getComponent(Transform).position.z)
            myentity.addComponent(
              new utils.MoveTransformComponent(myentity.getComponent(Transform).position, endPos, TRAVEL_TIME, () => {
                engine.removeEntity(myentity)
                //callback()
              })
            )
          }
        },
        enableDebug: false
      }
    )
    this.addComponent(triggerComponent) */
  }
}