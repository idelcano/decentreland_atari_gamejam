import utils from "../../node_modules/decentraland-ecs-utils/index"
import * as ui from '../../node_modules/@dcl/ui-utils/index';
import { Globals } from "../ui/variables"
import { Sound } from "./Sound"

//https://poly.google.com/view/fojR5i3h_nh ovni 1

// Preload glowing spaceship for when a spaceship is destroyed
/* const glowingSpaceship = new Entity()
engine.addEntity(glowingSpaceship)
glowingSpaceship.addComponent(new GLTFShape("models/test.glb"))
glowingSpaceship.addComponent(new Transform())
glowingSpaceship.getComponent(Transform).scale.setAll(0.1) */


const VELOCITY = 1.2
const MULTIPLICADOR = 0.4
export class Enemy extends Entity implements ISystem {
  myEntity: Enemy
  left: boolean
  right: boolean
  forward: boolean
  global: Globals
  endzPos: number
  nextzpos: number
  nextxpos: number
  lastDirectionRight: boolean
  originalRotate: Vector3
  velocity: number
  constructor(model: GLTFShape, transform: Transform, global: Globals) {
    super()
    this.myEntity = this
    this.lastDirectionRight = true
    this.global = global
    this.name = "enemy"
    engine.addEntity(this)
    this.addComponent(model)
    transform.scale = new Vector3(0.5, 0.5, 0.5)
    this.addComponent(transform)
    this.left = false
    this.right = true
    this.forward = false
    let triggerBox = new utils.TriggerBoxShape(new Vector3(1, 4, 0.9), Vector3.Zero())
    let enemy_trigger = new utils.TriggerComponent(triggerBox,
      {
        onCameraEnter: () => {
          global.gameOver(global.showCounter())
          engine.removeEntity(this.myEntity)
          engine.removeSystem(this.myEntity)
          //todo remove all enemies
        },
        onTriggerEnter: (e) => {
          if (e.name == "bullet") {
            global.killEnemy(this.myEntity.getComponent(Transform))
            engine.removeEntity(this.myEntity)
            engine.removeSystem(this.myEntity)
          }
        }, enableDebug: false
      }
    )
    // Spaceship destroyed
    this.myEntity = this
    this.myEntity.getComponent(Transform).rotate(new Vector3(0,1,0), -90)
    this.addComponent(enemy_trigger)
    this.nextxpos = transform.position.x - 0.1
    this.nextzpos = 5
    engine.addSystem(this)
  }

  update(dt: number) {
    if (!this.global.gameStarted && this.global.kill_all_enemies){
      engine.removeEntity(this.myEntity)
      engine.removeSystem(this)
    }
    if ( this.global.gameStarted){
/*       log("update--------------")
      log("x" + this.nextxpos)
      log("z" + this.nextzpos) */
      //fordward is left
      //back is right
      //left is forward
      //right is backd
      let transform = this.myEntity.getComponent(Transform)
/*       log("left: " + this.left + " rigth: " + this.right + "forward: " + this.forward)
      log("log transform x:" + transform.position.x + " y" + transform.position.y + " z" + transform.position.z) */

      const RIGHT_LIMIT: number = 5
      const LEFT_LIMIT: number = 14.5
      const GAME_LIMIT: number = 4
      let fixed_velocity = (dt * (VELOCITY + (MULTIPLICADOR * this.global.level)))
      if (this.forward) {
        /* log("is..." + (Math.floor(this.myEntity.getComponent(Transform).position.x) >= this.nextxpos)) */
        if (this.myEntity.getComponent(Transform).position.x >= this.nextxpos) {
          let distance = Vector3.Left().scale(fixed_velocity)
          transform.translate(distance)
          return;
        } else {
          this.forward = false
          if (this.nextzpos > 8) {
            transform.rotate(Vector3.Up(), 90)
            this.left = true
          } else {
            transform.rotate(Vector3.Up(), -90)
            this.right = true
          }
        }
      }
      if (Math.round(transform.position.x) < GAME_LIMIT) {
        log("game over")
        this.global.gameOver(this.global.showCounter());

        engine.removeSystem(this)
        engine.removeEntity(this)
        return;
      }
      if (this.left == true) {
        this.lastDirectionRight = false;
      }
      if (this.right == true) {
        this.lastDirectionRight = true;
      }
      if (this.right == true && Math.floor(this.myEntity.getComponent(Transform).position.z) >= this.nextzpos) {
        this.nextxpos = Math.floor(this.myEntity.getComponent(Transform).position.x - 0.5)
        let distance = Vector3.Backward().scale(fixed_velocity)
        transform.translate(distance)
        return;
      }
      if (this.left == true && Math.floor(this.myEntity.getComponent(Transform).position.z) <= this.nextzpos) {
        this.nextxpos = Math.floor(this.myEntity.getComponent(Transform).position.x - 0.5)
        let distance = Vector3.Forward().scale(fixed_velocity)
        transform.translate(distance)
        return;
      }

      if (transform.position.z <= RIGHT_LIMIT) {
        this.right = false;
        this.nextzpos = LEFT_LIMIT


      }
      if (transform.position.z >= LEFT_LIMIT) {
        this.left = false;
        this.nextzpos = RIGHT_LIMIT
      }
      if (!this.left && !this.right) {
        
      let rot = new Quaternion(0,1,0, -90)
      transform.rotation = rot
        this.forward = true;
      }
    }
  }
}
