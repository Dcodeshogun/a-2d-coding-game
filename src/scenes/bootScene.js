export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    const menuScene = this.scene.get('MenuScene');
    if (menuScene && menuScene.bgm) {
      this.tweens.add({
        targets: menuScene.bgm,
        volume: 0,
        duration: 500,
        onComplete: () => menuScene.bgm.stop()
      });
    }

    const { width, height } = this.cameras.main;

    
    this.add.rectangle(0, 0, width, height, 0x0b0d0f, 1).setOrigin(0, 0);

    
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.3).setBlendMode('MULTIPLY');

    
    for (let i = 0; i < height; i += 3) {
      this.add.rectangle(width / 2, i, width, 1, 0x7ae2b3, 0.02);
    }

    
    this.add.text(130, 40, "TYPE-2B", {
      fontFamily: 'Fira Code',
      fontSize: '48px',
      color: '#7ae2b3',
      shadow: { offsetX: 0, offsetY: 0, color: '#7ae2b3', blur: 8, fill: true }
    }).setOrigin(0.5, 0);

    
    this.add.text(170, 100, "BOOTING SYSTEM...", {
      fontFamily: 'Fira Code',
      fontSize: '28px',
      color: '#cfe5ebff',
      alpha: 0.8
    }).setOrigin(0.5, 0);

    
    const style = {
      fontFamily: 'Fira Code',
      fontSize: '18px',
      color: '#79ffdeff', 
      align: 'left'
    };

    const lines = [
      "Commencing System Check",
      "Memory Unit: Green",
      "Initializing Tactics Log",
      "Loading Geographic Data",
      "Vitals: Green",
      "Remaining MP: 100%",
      "Black Box Temperature: Normal",
      "Black Box Internal Pressure: Normal",
      "Activating IFF",
      "Activating FCS",
      "Initializing Pod Connection",
      "Launching DBU Setup",
      "Activating Inertia Control System",
      "Activating Environmental Sensors",
      "Equipment Authentication: Complete",
      "Equipment Status: Green",
      "All Systems Green",
      "Combat Preparations Complete"
    ];

    let y = 150;
    let i = 0;

    const showNextLine = () => {
      if (i < lines.length) {
        let lineText = this.add.text(40, y, "", style).setOrigin(0, 0);
        let fullLine = lines[i];
        let charIndex = 0;

        const typeChar = () => {
          if (charIndex < fullLine.length) {
            lineText.setText(lineText.text + fullLine[charIndex]);
            charIndex++;
            this.time.delayedCall(24, typeChar);
          } else {
            y += 22; 
            i++;
            this.time.delayedCall(50, showNextLine);
          }
        };

        typeChar();
      } else {
        
        this.cameras.main.flash(300, 0, 255, 136);

        const fadeRect = this.add.rectangle(0, 0, width, height, 0x000000)
          .setOrigin(0, 0)
          .setDepth(999)
          .setAlpha(0);

        this.time.delayedCall(300, () => {
          this.tweens.add({
            targets: fadeRect,
            alpha: 1,
            duration: 800,
            onComplete: () => {
              this.scene.start('GameScene'); 
            }
          });
        });
      }
    };

    showNextLine();
  }
}
