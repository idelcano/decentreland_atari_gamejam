import { getScores } from "../network/api";

export class TextScore extends Entity {
    eventName: string;
    color: Color3
    font_size: number
    font: Font
    entity: Entity
    text: any
    constructor(
        color: Color3,
        font_size: number,
        font: Font,
        x: number,
        y: number,
        z: number,
        text: string

    ) {
        super();
        this.color = color
        this.font = font
        this.font_size = font_size
        this.addComponent(
            new Transform({
            position: new Vector3(x, y, z)
            })
        )
        const myText = new TextShape(text)
        myText.fontSize = this.font_size
        myText.color = this.color
        myText.font = this.font
        myText.fontSize = 6
        let transform = this.entity.getComponent(Transform)
        let entity = new Entity()
        entity.addComponent(transform)
        entity.addComponent(myText)
        let shape = myText
        shape.outlineWidth = 0.1
        shape.outlineColor = Color3.Black()
        shape.shadowColor = Color3.Black()
        shape.shadowOffsetX = 1
        shape.shadowOffsetY = -1
        shape.shadowBlur = 2
        engine.addEntity(this.entity)
    }

    showNames(names:any){
    }
    
    showScores(scores:any){
        const myText = new TextShape(scores)
        myText.fontSize = this.font_size
        myText.color = this.color
        myText.font = this.font
        myText.fontSize = 6
        let transform = this.entity.getComponent(Transform)
        let entity = new Entity()
        entity.addComponent(transform)
        entity.addComponent(myText)
        let shape = myText
        shape.outlineWidth = 0.1
        shape.outlineColor = Color3.Black()
        shape.shadowColor = Color3.Black()
        shape.shadowOffsetX = 1
        shape.shadowOffsetY = -1
        shape.shadowBlur = 2
    }

    showComments(comments:any){
        const myText = new TextShape(comments)
        myText.fontSize = this.font_size
        myText.color = this.color
        myText.font = this.font
        myText.fontSize = 6
        this.entity.addComponent(myText)
        let shape = this.getComponent(TextShape)
        shape.outlineWidth = 0.1
        shape.outlineColor = Color3.Black()
        shape.shadowColor = Color3.Black()
        shape.shadowOffsetX = 1
        shape.shadowOffsetY = -1
        shape.shadowBlur = 2
    }

    async getFromServer(){
        let text = await getScores()
        this.text = text
        return text
    }
}