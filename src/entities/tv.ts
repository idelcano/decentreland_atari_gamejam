//https://sketchfab.com/3d-models/retro-television-7e0e83ef46ab43ddb9d8715627451bd4 tv m4ty1k4 attribution
export class TV extends Entity {
    constructor(model: string, pos_x: number, pos_z: number, size: Vector3) {
      super()
      this.name = "tv"
      engine.addEntity(this)
      this.addComponent(new GLTFShape(model))
      this.addComponent(new Transform())
      this.getComponent(Transform).scale.set(0.3, 0.3, 0.3)
      this.getComponent(Transform).position.set(pos_x, 2, pos_z)
      this.getComponent(Transform).rotate(new Vector3(0, 1, 0), 220)
      this.getComponent(Transform).rotate(new Vector3(1, 0, 0), 30)
    }
  }