import utils from "../../node_modules/decentraland-ecs-utils/index"
import { getScores } from "../network/api";
import { Text } from "./text"
import { TextScore } from "./textscore";

export class Panel extends Entity {
    myEntity : Entity
    constructor(position: Vector3, material: Material, scale: Vector3, vector: Vector3, 
        grade: number, text_grade: number, zdiff_text:number, xdiff_text:number) {
        super();
        this.addComponent( new Transform({
            position: new Vector3(position.x, position.y, position.z),
            scale: scale
        }))
        this.getComponent(Transform).rotate(vector, grade)
        const shape_t = new PlaneShape()
        this.addComponent(shape_t)
        this.addComponent(material)
        this.myEntity = this
        engine.addEntity(this)
    }
}