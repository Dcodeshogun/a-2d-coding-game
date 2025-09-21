export default class LangScene extends Phaser.Scene {
  constructor() {
    super("LangScene");
  }

  preload() {
    // load langselect sheet
    this.load.spritesheet('ui1', 'src/ui/langselect.png', { 
      frameWidth: 800,   
      frameHeight: 550   
    });
    this.load.spritesheet('ui2', 'src/ui/langselect2.png', { 
      frameWidth: 800,   
      frameHeight: 550   
    });
    // C++ button 
    this.load.image("C++", "src/ui/c++.png");
    this.load.image("C++hover", "src/ui/c++-hover.png");
/*
    // Java button 
    this.load.image("", "src/ui/");
    this.load.image("", "src/ui/");

    // Python button 
    this.load.image("", "src/ui/");
    this.load.image("", "src/ui/"); */
  }

  create() {

     const frames = [
    ...this.anims.generateFrameNumbers('ui1', { start: 0, end: 10 }),
    ...this.anims.generateFrameNumbers('ui2', { start: 0, end: 10 })
  ];
   //BG anim
        this.anims.create({
        key: 'LangselectAnim',
        frames: frames,
        frameRate: 10,
        repeat: -1
        });
    this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'ui').play('LangselectAnim');    

   // Helper to create a hoverable button
    const makeButton = (x, y, key, hoverKey, callback) => {
      const btn = this.add.image(x, y, key).setInteractive({ useHandCursor: true });

      btn.on("pointerover", () => btn.setTexture(hoverKey));
      btn.on("pointerout", () => btn.setTexture(key));
      btn.on("pointerdown", callback);

      return btn;
    };

    // Create buttons left side
    makeButton(185, 237, "C++", "C++hover", () => {
      // fade out 
      this.cameras.main.fadeOut(200, 0, 0, 0); // 500ms fade, black
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('QuizScene');
      });
    });
    //makeButton(185, 300, "SettingsBtn", "SettingsBtnHover", () => console.log("Settings clicked"));
    //makeButton(185, 350, "ExitBtn", "ExitBtnHover", () => console.log("Exit clicked"));
  }
}
  