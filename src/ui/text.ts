export class Text extends Entity {
    eventName: string;
    constructor(
        color: Color3,
        font_size: number,
        font: Font,
        x: number,
        y: number,
        z: number,
        vector: Vector3,
        rotation: number,
        info: string

    ) {
        super();
    
        this.addComponent(
            new Transform({
            position: new Vector3(x, y, z)
            }).rotate(vector, rotation)
        )
        const myText = new TextShape(info)
        myText.fontSize = font_size
        myText.color = color
        myText.font = font
        this.addComponent(myText)
        let shape = this.getComponent(TextShape)
        shape.outlineWidth = 0.1
        shape.outlineColor = Color3.Black()
        shape.shadowColor = Color3.Black()
        shape.shadowOffsetX = 1
        shape.shadowOffsetY = -1
        shape.shadowBlur = 2
        engine.addEntity(this)
    }
}