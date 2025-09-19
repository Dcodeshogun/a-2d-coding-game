import {Player} from '../objects/player.js';
import {Pod} from '../objects/pod.js';
import {Enemy} from '../objects/enemy.js';



export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
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


    this.load.image('vignette', 'assets/vignette-rect.png');

  }

  create() {
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
 
  // Create player using Player.js
  this.player = new Player(this, 100, 433);
  this.cameras.main.startFollow(this.player);

  // Create pod using Pod.js
  this.pod = new Pod(this, 100, 339,this.player);

   /*   // --- POD Animations ---
    this.anims.create({
      key: 'pod-idle',
      frames: this.anims.generateFrameNumbers('pod', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'pod-walk',
      frames: this.anims.generateFrameNumbers('pod-walk', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'pod-engage',
      frames: this.anims.generateFrameNumbers('pod-engage', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'pod-fire-walk',
      frames: this.anims.generateFrameNumbers('pod-fire-walk', { start: 0, end: 3 }),
      frameRate: 12,
      repeat: -1
    }); */

    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.pod, this.ground);
    // --- ENEMIES ---
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true
    });

    // Player–enemy overlap (explode when they touch)
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      enemy.explode();
    }, null, this);

    // Spawn enemies every 3 seconds from right edges
    this.time.addEvent({
  delay: 8000,
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

    
    
    this.setupPlayerMovement();

    //  Play idle
    this.player.play('player-idle');
    
    let vignette = this.add.image(800, 279, 'vignette');
    vignette.setScrollFactor(0); // stays fixed on screen
    vignette.setDepth(999);      // always on top
    vignette.setAlpha(0.5);      // tweak intensity   




  }

  

  setupPlayerMovement() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');
     // Additional keys for Pod actions
    this.podFireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
  }

  update() {
        this.player.setVelocityX(0);

    let moving = false;

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
  }
  // Parallax effect (slower scroll than main camera)
  this.bgLayer2.setScrollFactor(1.6); 
  this.wires.setScrollFactor(1.3);     

  this.pod.update();  
  }
}
