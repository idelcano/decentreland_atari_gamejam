import { movePlayerTo } from "@decentraland/RestrictedActions"
import { Cartucho } from "./cartucho"
import * as ui from '../../node_modules/@dcl/ui-utils/index';
import { CustomPlayer } from "./Customplayer";
import { Globals } from "../ui/variables";
import { Scene } from "../scene";
import { Spawner } from "./Spawners";
import { Sound } from "./Sound";
const start_sound = new Sound(new AudioClip("sounds/gamestart.wav"), false)

export class Atari extends Entity {
  atari: Atari
  constructor(model: string, pos_x: number, pos_z: number) {
    super()
    this.atari = this
    this.name = "atari"
    this.addComponent(new GLTFShape(model))
    this.addComponent(new Transform())
    this.getComponent(Transform).scale.set(0.2, 0.2, 0.2)
    this.getComponent(Transform).position.set(pos_x, 0, pos_z)
    this.getComponent(Transform).rotate(new Vector3(0, 1, 0), 220)
    engine.addEntity(this)
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