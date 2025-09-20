export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    // Background
    this.cameras.main.setBackgroundColor('#000000');
    
    this.add.text(100, 40, "type-2B", {
        font: "48px 'Press Start 2P'",
        fill: "#E0FFFF",  // white-cyan
        align: "left"
    }).setOrigin(0.5, 0); 

    this.add.text(100, 100, "BOOTING SYSTEM...", {
        font: "16px 'Press Start 2P'",
        fill: "#E0FFFF",  // white-cyan
        align: "left"
    }).setOrigin(0.5, 0); 

    // Style config for text
    const style = {
      fontFamily: "24px 'Press Start 2P'",
      fontSize: '24x',
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

        // typewriter effect
        const typeChar = () => {
          if (charIndex < fullLine.length) {
            lineText.setText(lineText.text + fullLine[charIndex]);
            charIndex++;
            this.time.delayedCall(30, typeChar); // speed of letters
          } else {
            y += 20; // move to next line
            i++;
            this.time.delayedCall(30, showNextLine); // delay before next line starts
          }
        };

        typeChar();
      } else {
        // After last line, fade out whole screen
        const fadeRect = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000)
          .setOrigin(0, 0)
          .setDepth(999)
          .setAlpha(0);

        this.tweens.add({
          targets: fadeRect,
          alpha: 1,
          duration: 500, // fade duration
          onComplete: () => {
            this.scene.start('GameScene'); // switch scene after fade
          }
        });
      }
    };

    showNextLine();
  }
}
