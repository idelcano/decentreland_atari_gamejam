
import * as ui from '../../node_modules/@dcl/ui-utils/index';
import { Bomb } from '../entities/Bomb';
import { Sound } from '../entities/Sound';
import { Text } from './text';
import utils from "../../node_modules/decentraland-ecs-utils/index"
import { Fruit } from '../entities/Fruit';
import { Spawner } from '../entities/Spawners';
import { signScore } from '../network/api';
import { movePlayerTo } from '@decentraland/RestrictedActions';
import { Cartucho } from '../entities/cartucho';
import { Atari } from '../entities/atari';
import { CustomPlayer } from '../entities/Customplayer';
import { Scene } from '../scene';

const gameover_sound = new Sound(new AudioClip("sounds/gameover.wav"), false)
const explosion_sound = new Sound(new AudioClip("sounds/destroyed.wav"), false)
const bomb_explosion_sound = new Sound(new AudioClip("sounds/destroyed2.wav"), false)
const fruit_sound = new Sound(new AudioClip("sounds/getpiece.wav"), false)

const bomb_model = new GLTFShape("models/objects/bomba.glb")
const cereza_model = new GLTFShape("models/objects/cereza.glb")
const banana_model = new GLTFShape("models/objects/banana.glb")
const fresa_model = new GLTFShape("models/objects/fresa.glb")
const pastel_model = new GLTFShape("models/objects/pastel.glb")

const models = [cereza_model, banana_model, fresa_model, pastel_model,]
const names = ["cereza", "banana", "fresa", "pastel"]

const ENEMY_POINTS = 10
const BOMB_POINTS = 0
const CEREZA_POINTS = 30
const BANANA_POINTS = 20
const CAKE_POINTS = 50
const FRESA_POINTS = 40
const MAX_BULLETS = 1
const MAX_ENEMIES = 10

const canvas = new UICanvas()

// Create a textShape component, setting the canvas as parent
let imageAtlas = new Texture("images/ui_count.png")
const text = new UIImage(canvas, imageAtlas)
text.sourceLeft = 0
text.sourceTop = 0
text.sourceWidth = 252
text.sourceHeight = 108
text.width = "252"
text.height = "20%"
//text.vAlign = "buttom"
//text.hAlign = "right"
text.positionY = "-35%"
text.positionX = "40%"
export class Globals {
    setCrates(crate: Cartucho, crate_premium: Cartucho, player: CustomPlayer, scene: Scene) {
      this.crate = crate
      this.crate_premium = crate_premium
      this.player = player
      this.scene = scene
    }
    scene : Scene
    counter: number
    numberBullets: number
    ammo: ui.UICounter
    points: ui.UICounter
    gameStarted: boolean
    game: number
    bullet_limit: number
    game_multipliquer: number
    global: Globals
    lastRandomObject: any
    level: number
    enemyCounter: number;
    kill_all_enemies: boolean;
    isRestarted: boolean;
    crate: Cartucho
    crate_premium: Cartucho
    player: CustomPlayer
    constructor(counter: number, numberBullets: number) {
        this.counter = counter
        this.numberBullets = numberBullets
        this.ammo = new ui.UICounter(0, -90, 40, Color4.White(), 30, true)
        this.points = new ui.UICounter(0, -90, 90, Color4.White(), 30, true)
        this.global = this
        this.level = 1
    }

    getRandomObject(global: Globals, models: GLTFShape[], names: string[]) {
        let number = Math.floor(Math.random() * 8);
        if (number >= 4) {
            return new Bomb(bomb_model, new Transform({ position: new Vector3(14, -2, 8) }), global);
            //return new Fruit(models[3], new Transform({ position: new Vector3(14, -2, 8) }), global, names[3], this.getPoints(names[3]));
        }
        else {
            //return new Bomb(bomb_model, new Transform({ position: new Vector3(14, -2, 8) }), global);
            return new Fruit(models[number], new Transform({ position: new Vector3(14, -2, 8) }), global, names[number], this.getPoints(names[number]));
        }
    }
    setPlayer(player: CustomPlayer){
        this.player = player
    }

    killFruit(x: number, y: number, z: number, type: string, points: number) {
        fruit_sound.getComponent(AudioSource).playOnce()
        let value = this.getPoints(type);
        points = value * this.game_multipliquer
        this.showHit(points, x, y, z)
        return this.points.increase(points);
    }

    private getPoints(type: string) {
        let value = 0;
        if (type == "banana") {
            value = BANANA_POINTS;
        } else if (type == "cereza") {
            value = CEREZA_POINTS;
        } else if (type == "fresa") {
            value = FRESA_POINTS;
        } else if (type == "pastel") {
            value = CAKE_POINTS;
        }
        return value;
    }

    resetGame(){
        this.kill_all_enemies = false

        new Atari("models/atari.glb", 14, 1.5);
        this.preStartGame()
    }

    preStartGame() {
        Spawner.spawnEnemy(this.global)
    }

    startGame(game: number) {
        this.game_multipliquer = 1
        let bullet_multiplier = 0
        if (game == 1) {
            bullet_multiplier = 2
        }

        this.bullet_limit = MAX_BULLETS + bullet_multiplier
        this.game = game
        this.startCounter();
        this.restartGame()
        //this.setObjects(this.createObjects(this, OBJECTS_LEN))
    }
    restartGame() {
        this.gameStarted = true
        this.isRestarted = true
        this.startBullet();
        this.lastRandomObject = this.getRandomObject(this.global, models, names)
        this.enemyCounter = 0
    }

    gameOver(counter: number) {
        gameover_sound.getComponent(AudioSource).playOnce()
        this.gameStarted = false
        this.kill_all_enemies = true
        this.startBullet();
        this.showScore(counter+"")
    }

    showScore(counter: string){
        let prompt = new ui.FillInPrompt(
            'Save your score ('+counter+") \n(limit 45 characters)",
            (e: string) => {
            let comment = e
            if (comment == "Add your epic comment"){
                    comment = ""
                }

              signScore(counter+1, comment)
              this.global.level = 1
              this.player.show()
              this.resetGame()
              movePlayerTo({ x: 8, y: 1, z: 1 }, { x: 8, y: 1, z: 8 })
            },
            'Submit',
            "Add your epic comment"
          ).closeIcon.visible = false
    }

    startBullet() {
        this.ammo.set(this.bullet_limit);
    }

    startCounter() {
        this.points.set(0);
    }

    killBomb(x, y, z) {
        bomb_explosion_sound.getComponent(AudioSource).playOnce()
        let value = BOMB_POINTS * this.game_multipliquer
        //this.showHit(value, x, y, z)
        //return this.points.increase(value);
    }

    showHit(value: number, x: any, y: any, z: any) {
        if (this.gameStarted) {
            let entity = new Entity()
            let size = 2 + (x * 0.4)

            entity.addComponent(new Transform({ position: new Vector3(x, y, z), scale: new Vector3(1, 0.5, 1.2) }))
            let text_e = new Text(Color3.Red(), size, new Font(Fonts.SanFrancisco),
                0, 1, 0, new Vector3(0, 1, 0), 90, value + " POINTS!")
            text_e.setParent(entity)
            engine.addEntity(entity)
            let startPos = new Transform().position
            startPos.x = entity.getComponent(Transform).position.x
            startPos.z = entity.getComponent(Transform).position.z
            startPos.y = entity.getComponent(Transform).position.y

            const TRAVEL_TIME = 0.5
            let endPos = new Vector3(entity.getComponent(Transform).position.x, entity.getComponent(Transform).position.y + 0.2, entity.getComponent(Transform).position.z)
            let movement = new utils.MoveTransformComponent(startPos, endPos, TRAVEL_TIME, () => {
                engine.removeEntity(entity)
                text_e.setParent(null)
            })
            entity.addComponent(movement)
        }
    }

    killEnemy(transform: Transform) {
        /* let bomb = this.objects.pop()
        bomb.move(transform) */
        let value = ENEMY_POINTS + this.game_multipliquer
        this.showHit(value, transform.position.x, transform.position.y, transform.position.z)
        explosion_sound.getComponent(AudioSource).playOnce()
        this.lastRandomObject.move(transform, this.global)
        this.lastRandomObject = this.getRandomObject(this.global, models, names)
        this.enemyCounter = this.enemyCounter + 1
        if (MAX_ENEMIES - 1 == this.enemyCounter) {
            this.preStartGame()
        }
        if (MAX_ENEMIES == this.enemyCounter) {
            this.level = this.level + 1
            this.restartGame()
        }
        return this.points.increase(value);
    }

    showCounter() {
        return this.points.read();
    }

    incrementBullets() {
        this.ammo.increase();
        if (this.showBullets() > this.bullet_limit) {
            this.ammo.set(this.bullet_limit)
        }
        return this.ammo;
    }

    decrementBullets() {
        return this.ammo.decrease();
    }
    showBullets() {
        return this.ammo.read();
    }
}