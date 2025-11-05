export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {
    
    this.load.audio('bgm', 'audio/bgm/cityruins.mp3');
    this.load.image("MenuBG", "src/ui/MenuBgmain-Sheet.png"); 

    this.load.image("PlayBtn", "src/ui/play-btn.png");
    this.load.image("PlayBtnHover", "src/ui/play-btn-hover.png");

    
    this.load.image("SettingsBtn", "src/ui/settings-btn.png");
    this.load.image("SettingsBtnHover", "src/ui/settings-btn-hover.png");

    
    this.load.image("ExitBtn", "src/ui/exit-btn.png");
    this.load.image("ExitBtnHover", "src/ui/exit-btn-hover..png");
  }

  create() {
    
    this.bgm = this.sound.add('bgm', {
        volume: 0.28,   
        rate:1.09,
        loop: true     
    });

    
    this.bgm.play();

    
    this.add.image(400, 300, "MenuBG").setOrigin(0.5).setDisplaySize(800, 600);

   
    const makeButton = (x, y, key, hoverKey, callback) => {
      const btn = this.add.image(x, y, key).setInteractive({ useHandCursor: true });

      btn.on("pointerover", () => btn.setTexture(hoverKey));
      btn.on("pointerout", () => btn.setTexture(key));
      btn.on("pointerdown", callback);

      return btn;
    };

    
    makeButton(185, 250, "PlayBtn", "PlayBtnHover", () => {
      
      this.cameras.main.fadeOut(200, 0, 0, 0); 
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('LangScene');
      });
    });
    makeButton(185, 300, "SettingsBtn", "SettingsBtnHover", () => console.log("Settings clicked"));
    makeButton(185, 350, "ExitBtn", "ExitBtnHover", () => console.log("Exit clicked"));
  }
}
  