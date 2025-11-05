export default class GameoverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameoverScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85);
  

    this.createScanlines();

   
    const gameOverText = this.add.text(width / 2, height / 2 - 80, 'SYSTEM FAILURE', {
      fontFamily: 'Arial Black',
      fontSize: '56px',
      color: '#1f0c11ff',
      stroke: '#00ffff',
      strokeThickness: 3,
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: '#90edbbff',
        blur: 20,
        fill: true
      }
    }).setOrigin(0.5).setAlpha(0);

    
    this.tweens.add({
      targets: gameOverText,
      alpha: 1,
      duration: 1000,
      ease: 'Power2'
    });

    
    this.time.addEvent({
      delay: 150,
      callback: () => {
        if (Math.random() > 0.7) {
          gameOverText.x = width / 2 + Phaser.Math.Between(-5, 5);
          gameOverText.y = height / 2 - 80 + Phaser.Math.Between(-3, 3);
          this.time.delayedCall(50, () => {
            gameOverText.x = width / 2;
            gameOverText.y = height / 2 - 80;
          });
        }
      },
      loop: true
    });

    
    const subtitleText = this.add.text(width / 2, height / 2, 'NEURAL LINK TERMINATED', {
      fontFamily: 'Courier New',
      fontSize: '24px',
      color: '#00ffff',
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: '#00ffff',
        blur: 10,
        fill: true
      }
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: subtitleText,
      alpha: { from: 0, to: 0.8 },
      duration: 1500,
      delay: 500,
      ease: 'Power2'
    });


    
    this.createButtons(width, height);

    
    this.createRGBSplit();

    
    this.createCornerUI(width, height);
  }

 

  createScanlines() {
    const { width, height } = this.cameras.main;
    
    for (let i = 0; i < height; i += 4) {
      const line = this.add.rectangle(width / 2, i, width, 1, 0x00ffff, 0.03);
      
      this.tweens.add({
        targets: line,
        alpha: { from: 0.03, to: 0.08 },
        duration: 1000,
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 1000
      });
    }
  }

  createRGBSplit() {
    const { width, height } = this.cameras.main;
    
    
    const borderThickness = 3;
    
    const redBorder = this.add.rectangle(width / 2 + 2, height / 2, width - 40, height - 40, 0xff0000, 0).setStrokeStyle(borderThickness, 0xff0040, 0.3);
    const cyanBorder = this.add.rectangle(width / 2 - 2, height / 2, width - 40, height - 40, 0x00ffff, 0).setStrokeStyle(borderThickness, 0x00ffff, 0.3);
    
    this.tweens.add({
      targets: [redBorder, cyanBorder],
      alpha: { from: 0, to: 1 },
      duration: 1000,
      ease: 'Power2'
    });
  }

  createCornerUI(width, height) {
    const cornerStyle = {
      fontFamily: 'Courier New',
      fontSize: '12px',
      color: '#ff0040',
      alpha: 0.6
    };

    
    this.add.text(20, 20, '[ERROR_CODE: 0x8F4A2B]', cornerStyle);
    
    
    this.add.text(width - 20, 20, '[TIMESTAMP: ' + new Date().toISOString().substr(11, 8) + ']', cornerStyle).setOrigin(1, 0);
    
    
    this.add.text(20, height - 20, '[SYSTEM_STATUS: OFFLINE]', cornerStyle).setOrigin(0, 1);
    
    
    this.add.text(width - 20, height - 20, '[REBOOT_AVAILABLE]', cornerStyle).setOrigin(1, 1);
  }

  createButtons(width, height) {
    const buttonY = height - 120;

    
    const restartButton = this.createButton(width / 2 - 120, buttonY, 'Restart', '#f9e8bfff');
    restartButton.on('pointerdown', () => {
      this.sound.play('lightslash', { volume: 0.1 });
      this.cameras.main.fade(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start('GameScene'); 
      });
    });

    
    const menuButton = this.createButton(width / 2 + 120, buttonY, 'Menu', '#efccb1ff');
    menuButton.on('pointerdown', () => {
      this.sound.play('lightslash', { volume: 0.1 });
      this.cameras.main.fade(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start('MenuScene'); 
      });
    });
  }

  createButton(x, y, text, color) {
    const button = this.add.container(x, y);

    
    const bg = this.add.rectangle(0, 0, 180, 50, 0x000000, 0.8).setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(color).color, 0.8);
    
    
    const buttonText = this.add.text(0, 0, text, {
      fontFamily: 'Arial Black',
      fontSize: '20px',
      color: color,
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: color,
        blur: 10,
        fill: true
      }
    }).setOrigin(0.5);

    button.add([bg, buttonText]);
    button.setSize(180, 50);
    button.setInteractive();
    button.setAlpha(0);

    
    this.tweens.add({
      targets: button,
      alpha: 1,
      duration: 800,
      delay: 1500,
      ease: 'Power2'
    });

    
    button.on('pointerover', () => {
      this.tweens.add({
        targets: bg,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200,
        ease: 'Power2'
      });
      buttonText.setScale(1.1);
    });

    button.on('pointerout', () => {
      this.tweens.add({
        targets: bg,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2'
      });
      buttonText.setScale(1);
    });

    return button;
  }
}