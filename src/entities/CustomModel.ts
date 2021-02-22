
export class CustomModel extends Entity {
  constructor(path: string, transform: Transform) {
    super()
    this.addComponent(new GLTFShape(path))
    this.addComponent(transform)
    engine.addEntity(this)
  }
}