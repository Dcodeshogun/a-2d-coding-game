import {Player} from '../objects/player.js';
import {Pod} from '../objects/pod.js';
import {Enemy} from '../objects/enemy.js';
import {PunchEnemy} from '../objects/enemy2.js';



export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {

    this.load.audio('pod-fire', 'audio/sfx/pod-engage.mp3');

    this.load.spritesheet('background', 'assets/mainbg-Sheet.png', {
      frameWidth: 1600, frameHeight: 558
    });
    this.load.image('bg-layer2', 'assets/parallparallaxtrusses-Sheet.png');
    this.load.spritesheet('wires', 'assets/parallaxwires-Sheet.png', {
     frameWidth: 1800, frameHeight: 558
      });


    // Idle sheet 
    this.load.spritesheet('player', 'assets/2B_idle-Sheet.png', {
      frameWidth: 128, frameHeight: 128
    });

    // Walk sheet
    this.load.spritesheet('walk', 'assets/2B(run).png', {
      frameWidth: 128, frameHeight: 128
    });

    // slash attack
    this.load.spritesheet('slash', 'assets/2B_slash.png', {
      frameWidth: 256, frameHeight: 159
    });


    // Pod
    this.load.spritesheet('pod', 'assets/POD-Sheet.png', {
      frameWidth: 64, frameHeight: 64
    });
    
    this.load.spritesheet('pod-walk', 'assets/POD-move-Sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('pod-engage', 'assets/POD-engage-Sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('pod-fire', 'assets/POD-fire-Sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.image('bullet', 'assets/POD-shoot-Sheet.png');
    this.load.spritesheet('suicide-enemy-walk', "assets/suicide machine walk-Sheet.png", { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('suicide-enemy-explode', "assets/suicidemachine(explosion)-Sheet.png", { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('suicide-enemy-death', "assets/suicidemachineDEATH-Sheet.png", { frameWidth: 84, frameHeight: 64 });
    this.load.spritesheet('punch-enemy', 'assets/machine(S)-Sheet.png', {
    frameWidth: 190,
    frameHeight: 128
});


    this.load.image('vignette', 'assets/vignette-rect.png');

  }

  create() {
    this.cameras.main.fadeIn(600, 0, 0, 0); // 500ms fade from black
   /// Fade out MenuScene BGM when starting levelscene
    const menuScene = this.scene.get('MenuScene');
    if (menuScene && menuScene.bgm) {
        this.tweens.add({
            targets: menuScene.bgm,
            volume: 0,          // fade to 0
            duration: 1000,     // 1 second fade
            onComplete: () => menuScene.bgm.stop()
        });
    }


  // GROUND
      // Ground collider 
      this.ground = this.add.rectangle(800, 454, 1600, 40, 0x00ff00); 
      this.physics.add.existing(this.ground, true); // true = static body

  // BACKGROUND    
    // Background anim (temporary)
    this.anims.create({
      key: 'bg-anim',
      frames: this.anims.generateFrameNumbers('background', { start: 0, end: 0 }),
      frameRate: 12,
      repeat: -1
    });
    this.bg = this.add.sprite(0, 0, 'background').setOrigin(0, 0);
    this.bg.play('bg-anim');
    // Darkening the background 
    let bgDark = this.add.rectangle(600, 300, 2000, 600, 0x000000, 0.3);
    
   

    // Parallax backgrounds
    this.bgLayer2 = this.add.image(0, 0, 'bg-layer2').setOrigin(0, 0);
    this.anims.create({
     key: 'wires-move',
     frames: this.anims.generateFrameNumbers('wires', { start: 0, end: 5 }),
     frameRate: 8,
     repeat: -1
      });

      this.wires = this.add.sprite(0, 0, 'wires').setOrigin(0, 0);
      this.wires.play('wires-move');
      

    // Depth ordering: front first
    this.bg.setDepth(0); 
    this.wires.setDepth(1);
    this.bgLayer2.setDepth(2);
    bgDark.setDepth(3); 
  
  // BOUNDS
  this.physics.world.setBounds(0, 0, 1600, 558); 
  this.cameras.main.setBounds(0, 0, 1600, 558);
 
  // player using Player.js
  this.player = new Player(this, 100, 433);
  this.cameras.main.startFollow(this.player);
  
  // pod using Pod.js
  this.pod = new Pod(this, 100, 339,this.player);
  this.physics.add.collider(this.player, this.ground);
  this.physics.add.collider(this.pod, this.ground);
   
   
    
    // --- HEALTH BAR (graphics-based) ---
const barX = 20, barY = 20, barWidth = 260, barHeight = 9;

// Background
this.healthBarBg = this.add.graphics();
this.healthBarBg.fillStyle(0x575349, 1); // dark muted background
this.healthBarBg.fillRect(barX, barY, barWidth, barHeight);
this.healthBarBg.setScrollFactor(0);
this.healthBarBg.setDepth(999);

// Foreground
this.healthBarFg = this.add.graphics();
this.healthBarFg.setScrollFactor(0);
this.healthBarFg.setDepth(1000);

// Current width (for smooth animation)
this.currentBarWidth = barWidth;

// Update function
this.updateHealthBar = () => {
    let healthPercent = Phaser.Math.Clamp(this.player.health / this.player.maxHealth, 0, 1);
    let targetWidth = healthPercent * barWidth;

    // Smoothly interpolate width
    this.currentBarWidth = Phaser.Math.Linear(this.currentBarWidth, targetWidth, 0.1); // 0.1 = speed factor

    // Determine color based on health
    let color = 0xc8c3ad; // full health
    if (healthPercent < 0.6) color = 0xaca793; // medium health
    if (healthPercent < 0.3) color = 0x52514c; // low health (red)

    // Draw foreground
    this.healthBarFg.clear();
    this.healthBarFg.fillStyle(color, 1);
    this.healthBarFg.fillRect(barX, barY, this.currentBarWidth, barHeight);
};

// Initial draw
this.updateHealthBar();


   //--------------------------------------------------------------------------------------------------------------------------

    // --- ENEMIES ---
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true
    });
    this.punchEnemies = this.physics.add.group({
      classType: PunchEnemy,
      runChildUpdate: true
    });
    

      // Spawn a single PunchEnemy at start
      const startX = 1200; 
      const startY = 433;  
      this.firstPunchEnemy = new PunchEnemy(this, startX, startY, this.player);
      this.punchEnemies.add(this.firstPunchEnemy);
      this.physics.add.collider(this.firstPunchEnemy, this.ground);


    // Player–enemy overlap (explode when they touch)
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      enemy.explode();
    }, null, this);
    
    // Damage player if hit by enemy explosion
    this.player.on('hitByEnemy', () => {
      this.player.health -= 30; // damage value
      if (this.player.health < 0) this.player.health = 0;

      this.updateHealthBar();

      if (this.player.health === 0) {
        console.log("Player died!"); // game over
      }
    });
    //punch enemy
    this.player.on('hitByEnemy', (damage = 15) => { // default 15
    this.player.health -= damage;
    if (this.player.health < 0) this.player.health = 0;
    this.updateHealthBar();
    if (this.player.health === 0) {
        console.log("Player died!");
     }
   }); 
    // Player attack vs PunchEnemy
    this.physics.add.overlap(this.player, this.punchEnemies, (player, punchEnemy) => {
        if (player.isAttacking) {
            punchEnemy.takeDamage(25); // heavy attack
        }
    }, null, this);


    // Spawn enemies every 4 seconds from right edges
    this.time.addEvent({
      delay: 4000,
      loop: true,
      callback: () => {
        const cam = this.cameras.main;
        const x = cam.worldView.x + cam.width + 50; // right edge
        const y = 433; // ground level

        let enemy = new Enemy(this, x, y, this.player);
        this.enemies.add(enemy);

        // Ensure enemy collides with ground
        this.physics.add.collider(enemy, this.ground);
      }
    });
  //Spawn enemy2 every 7 sec
   this.time.addEvent({
    delay: 7000, // spawn every 7 seconds
    loop: true,
    callback: () => {
        const cam = this.cameras.main;
        const x = cam.worldView.x + cam.width + Phaser.Math.Between(25, 400); // right side, random offset
        const y = 433; // ground

        let punchEnemy = new PunchEnemy(this, x, y, this.player);
        this.punchEnemies.add(punchEnemy);

        this.physics.add.collider(punchEnemy, this.ground);
      }
  });
   


    
    this.setupPlayerMovement();

    //  Play idle
    this.player.play('player-idle');
    
    let vignette = this.add.image(800, 279, 'vignette');
    vignette.setScrollFactor(0); // stays fixed on screen
    vignette.setDepth(100);      // always on top
    vignette.setAlpha(2.5);      // tweak intensity   




  }

  

  setupPlayerMovement() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');
    this.slashKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
     // Additional keys for Pod actions
    this.podFireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
  }

  update() {
        this.player.setVelocityX(0);

    let moving = false;
  if (!this.player.isAttacking) {
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
        this.player.setVelocityX(-250);
        this.player.play('player-walk', true);
        this.player.flipX = true;
        moving = true;
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
        this.player.setVelocityX(250);
        this.player.play('player-walk', true);
        this.player.flipX = false;
        moving = true;
    } else {
        this.player.play('player-idle', true);
    }
  }

    // Attack check
  if (Phaser.Input.Keyboard.JustDown(this.slashKey)) {
    this.player.attack();
  }

 if (Phaser.Input.Keyboard.JustDown(this.podFireKey)) {
    this.pod.engageFire(this);
  }

  // Only update pod to walk/idle if not engaging or firing
  if (this.pod.state === 'idle' || this.pod.state === 'walk') {
      if (moving) this.pod.walk();
      else this.pod.idle();
  }

     if (this.player.anims.currentAnim) {
    if (this.player.anims.currentAnim.key === 'player-idle') {
      this.player.setScale(1.1); 
    } else if (this.player.anims.currentAnim.key === 'player-walk') {
      this.player.setScale(1.2); 
    }
    this.updateHealthBar();
  }
  // Parallax effect (slower scroll than main camera)
  this.bgLayer2.setScrollFactor(1.6); 
  this.wires.setScrollFactor(1.3);     

  this.pod.update(); 
  
 
  }
}
