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

    this.cameras.main.setBackgroundColor('#000000');

    
    this.add.text(100, 40, "type-2B", {
      font: "48px sans-serif", 
      fill: "#E0FFFF",
      align: "left"
    }).setOrigin(0.5, 0);

    
    this.add.text(100, 100, "BOOTING SYSTEM...", {
      font: "16px sans-serif",
      fill: "#E0FFFF",
      align: "left"
    }).setOrigin(0.5, 0);

    
    const style = {
      fontFamily: "sans-serif", 
      fontSize: '18px',
      color: '#E0FFFF',
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
        let lineText = this.add.text(20, y, "", style);
        let fullLine = lines[i];
        let charIndex = 0;

        const typeChar = () => {
          if (charIndex < fullLine.length) {
            lineText.setText(lineText.text + fullLine[charIndex]);
            charIndex++;
            this.time.delayedCall(30, typeChar);
          } else {
            y += 20;
            i++;
            this.time.delayedCall(30, showNextLine);
          }
        };

        typeChar();
      } else {
        const fadeRect = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000)
          .setOrigin(0, 0)
          .setDepth(999)
          .setAlpha(0);

        this.tweens.add({
          targets: fadeRect,
          alpha: 1,
          duration: 1000,
          onComplete: () => {
            this.scene.start('GameScene');
          }
        });
      }
    };

    showNextLine();
  }
}
