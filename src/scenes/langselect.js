export default class LangScene extends Phaser.Scene {
  constructor() {
    super("LangScene");
  }

  preload() {
    
    this.load.spritesheet('ui1', 'src/ui/langselect.png', { 
      frameWidth: 800,   
      frameHeight: 550   
    });
    this.load.spritesheet('ui2', 'src/ui/langselect2.png', { 
      frameWidth: 800,   
      frameHeight: 550   
    });
    
    this.load.image("C++", "src/ui/c++.png");
    this.load.image("C++hover", "src/ui/c++-hover.png");
/*
    
    this.load.image("", "src/ui/");
    this.load.image("", "src/ui/");

    
    this.load.image("", "src/ui/");
    this.load.image("", "src/ui/"); */
  }

  create() {

     const frames = [
    ...this.anims.generateFrameNumbers('ui1', { start: 0, end: 10 }),
    ...this.anims.generateFrameNumbers('ui2', { start: 0, end: 10 })
  ];
   
        this.anims.create({
        key: 'LangselectAnim',
        frames: frames,
        frameRate: 10,
        repeat: -1
        });
    this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'ui').play('LangselectAnim');    

   
    const makeButton = (x, y, key, hoverKey, callback) => {
      const btn = this.add.image(x, y, key).setInteractive({ useHandCursor: true });

      btn.on("pointerover", () => btn.setTexture(hoverKey));
      btn.on("pointerout", () => btn.setTexture(key));
      btn.on("pointerdown", callback);

      return btn;
    };

    
    makeButton(185, 237, "C++", "C++hover", () => {
      
      this.cameras.main.fadeOut(200, 0, 0, 0); 
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('TerminalCutscene1', { selectedLang: 'C++' });
      });
    });
  
  }
}
  