
import utils from "../../node_modules/decentraland-ecs-utils/index"
export class invisibleBoundary extends Entity {
  constructor(pos_x: number, pos_y: number, pos_z: number, triggerComponent: any, rotate: Vector3, rotation: number, isTop: boolean) {
    super()
    this.name = "boundary"
    let plane
    if (isTop) {
      plane = new BoxShape()
      //this.addComponent(triggerComponent)
    } else {
      plane = new PlaneShape()
    }
    plane.visible = false
    this.addComponent(plane)
    let transform = new Transform()
    transform.position.set(pos_x, pos_y, pos_z)
    transform.scale.set(12, 1, 1)
    transform.rotate(rotate, rotation)
    this.addComponent(transform)
/*     let mat = new Material()
    mat.albedoColor = Color3.Red() 
    this.addComponent(mat)*/
    engine.addEntity(this)
  }
}