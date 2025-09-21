export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {
    //prelaod bgm
    this.load.audio('bgm', 'audio/bgm/cityruins.mp3');

    // Load background + buttons
    this.load.image("MenuBG", "src/ui/MenuBgmain-Sheet.png"); 

    // Start button 
    this.load.image("PlayBtn", "src/ui/play-btn.png");
    this.load.image("PlayBtnHover", "src/ui/play-btn-hover.png");

    // Settings button 
    this.load.image("SettingsBtn", "src/ui/settings-btn.png");
    this.load.image("SettingsBtnHover", "src/ui/settings-btn-hover.png");

    // Exit button 
    this.load.image("ExitBtn", "src/ui/exit-btn.png");
    this.load.image("ExitBtnHover", "src/ui/exit-btn-hover..png");
  }

  create() {
    // Music 
    this.bgm = this.sound.add('bgm', {
        volume: 0.3,   // 0.0 to 1.0
        loop: true      // keep it looping
    });

    // Play 
    this.bgm.play();

    // Add background (
    this.add.image(400, 300, "MenuBG").setOrigin(0.5).setDisplaySize(800, 600);

   // Helper to create a hoverable button
    const makeButton = (x, y, key, hoverKey, callback) => {
      const btn = this.add.image(x, y, key).setInteractive({ useHandCursor: true });

      btn.on("pointerover", () => btn.setTexture(hoverKey));
      btn.on("pointerout", () => btn.setTexture(key));
      btn.on("pointerdown", callback);

      return btn;
    };

    // Create buttons (on the left side)
    makeButton(185, 250, "PlayBtn", "PlayBtnHover", () => {
      // fade out the camera
      this.cameras.main.fadeOut(200, 0, 0, 0); // 500ms fade, black
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('LangScene');
      });
    });
    makeButton(185, 300, "SettingsBtn", "SettingsBtnHover", () => console.log("Settings clicked"));
    makeButton(185, 350, "ExitBtn", "ExitBtnHover", () => console.log("Exit clicked"));
  }
}
  