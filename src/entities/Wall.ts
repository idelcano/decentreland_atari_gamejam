export class Wall extends Entity {
    constructor(position: Vector3, rotate: Vector3, angle: number, material: Material, scale: Vector3) {
        super()
        let shape = new PlaneShape()
        shape.withCollisions = true
        this.addComponent(shape)
        this.addComponent(material)
        let transform = new Transform({ position: position, scale: scale })
        transform.rotate(rotate, angle)
        this.addComponent(transform)
        this.name = "wall"
        engine.addEntity(this)
    }
}