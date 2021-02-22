export class Sound extends Entity {
    constructor(clip: AudioClip, isLoop: boolean) {
      super()
      engine.addEntity(this)
      this.setParent(Attachable.AVATAR)
      this.addComponent(new AudioSource(clip))
      this.addComponent(new Transform())
      if (isLoop){
        this.getComponent(AudioSource).playing = true
      }
      this.getComponent(AudioSource).volume = 0.1
    }
    playAudio() {
      this.getComponent(AudioSource).playOnce()
    }
  }