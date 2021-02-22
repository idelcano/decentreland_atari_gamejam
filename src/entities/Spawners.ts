import utils from "../../node_modules/decentraland-ecs-utils/index"
import { Globals } from "../ui/variables"
import { Enemy } from "./Enemy"
import { Parapeto } from "./parapet"
const champs_t = new Texture("images/champs.png")
const champs_m = new Material()
champs_m.albedoTexture = champs_t

champs_m.transparencyMode=TransparencyMode.ALPHA_TEST
const enemy =  new GLTFShape("models/eye.glb")
// General config
const BASE_SPAWN_TIME = 500 // In milliseconds
const MAX_TIME_OFFSET = 700
const POSITION_X = 14
const POSITION_Y = 1

export class Spawner {

  static spawnEnemy(global: Globals) {
    new Parapeto(new Vector3(12.35, 1, (Math.floor(Math.random() * 5) + 1)+7  ), champs_m, new Vector3(0.001, 2, 4))
    new Parapeto(new Vector3(7.35, 1, (Math.floor(Math.random() * 5) + 1)+7), champs_m, new Vector3(0.001, 2, 4))
    new Enemy(enemy, new Transform({ position: new Vector3(14, 1, 6) }), global)
    new Enemy(enemy, new Transform({ position: new Vector3(14, 1, 7) }), global)
    new Enemy(enemy, new Transform({ position: new Vector3(14, 1, 8) }), global)
    new Enemy(enemy, new Transform({ position: new Vector3(14, 1, 9) }), global)
    new Enemy(enemy, new Transform({ position: new Vector3(14, 1, 10) }), global)
    new Enemy(enemy, new Transform({ position: new Vector3(14, 1, 11) }), global)
    new Enemy(enemy, new Transform({ position: new Vector3(14, 1, 12) }), global)
    new Enemy(enemy, new Transform({ position: new Vector3(14, 1, 13) }), global)
    new Enemy(enemy, new Transform({ position: new Vector3(14, 1, 14) }), global)
    new Enemy(enemy, new Transform({ position: new Vector3(14, 1, 15) }), global)
  }
  constructor() {
  }
}