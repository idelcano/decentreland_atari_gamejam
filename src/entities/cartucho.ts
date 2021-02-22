
export class Cartucho extends Entity {
    isGrabbed: boolean = false
    constructor(model: string, pos_x: number, pos_z: number, size: Vector3, name: string) {
      super()
      this.name = name
      engine.addEntity(this)
      this.addComponent(new GLTFShape(model))
      this.addComponent(new Transform())
      this.getComponent(Transform).scale.set(0.4, 0.4, 0.4)
      this.getComponent(Transform).position.set(pos_x, 1.5, pos_z)
      this.getComponent(Transform).rotate(new Vector3(0, 1, 0), 272)
    }
  }
  
  /* Model Information:
  * title:	Atari 2600
  * source:	https://sketchfab.com/3d-models/atari-2600-a72bfe5653f2458fb8be1c6165ed0d8a
  * author:	Juan Foo (https://sketchfab.com/juanotron)
  
  Model License:
  * license type:	CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
  * requirements:	Author must be credited. Commercial use is allowed.
  
  If you use this 3D model in your project be sure to copy paste this credit wherever you share it:
  This work is based on "Atari 2600" (https://sketchfab.com/3d-models/atari-2600-a72bfe5653f2458fb8be1c6165ed0d8a) by Juan Foo (https://sketchfab.com/juanotron) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/) */