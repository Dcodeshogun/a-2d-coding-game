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
    this.load.image('vignette', 'assets/vignette.jpg');

  }

  create() {
  // GROUND
      // Ground collider (invisible or use a ground sprite)
      this.ground = this.add.rectangle(800, 454, 1600, 40, 0x00ff00); 
      this.physics.add.existing(this.ground, true); // true = static body

  // BACKGROUND    
    // Background anim (temporary)
    this.anims.create({
      key: 'bg-anim',
      frames: this.anims.generateFrameNumbers('background', { start: 0, end: 5 }),
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
 
    // Create player once
    this.player = this.physics.add.sprite(100, 433, 'player');
    this.player.setScale(1.2).setCollideWorldBounds(true);
    this.player.setOrigin(0.5, 1);
    this.player.health = 140;
    this.player.maxHealth = 100;
    this.cameras.main.startFollow(this.player);
     
    // Pod 
    this.pod = this.physics.add.sprite(100, 339, 'pod').setScale(3).setCollideWorldBounds(true);
    
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.pod, this.ground);

    
    this.setupPlayerAnimations();
    this.setupPlayerMovement();

    //  Play idle
    this.player.play('player-idle');
    
    let vignette = this.add.image(800, 279, 'vignette');
    vignette.setScrollFactor(0); // stays fixed on screen
    vignette.setDepth(999);      // always on top
    vignette.setAlpha(0.5);      // tweak intensity   




  }

  setupPlayerAnimations() {
   
    this.anims.create({
      key: 'player-idle',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1
    });
  
    this.anims.create({
      key: 'player-walk',
      frames: this.anims.generateFrameNumbers('walk', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'pod-idle',
      frames: this.anims.generateFrameNumbers('pod', { start: 0, end: 9 }),
      frameRate: 8,
      repeat: -1
    });
    this.pod.play('pod-idle');
  }

  setupPlayerMovement() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');
  }

  update() {
    this.player.setVelocityX(0);

    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      this.player.setVelocityX(-250);
      this.player.play('player-walk', true);
      this.player.flipX = true;
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      this.player.setVelocityX(250);
      this.player.play('player-walk', true);
      this.player.flipX = false;
    } else {
      this.player.play('player-idle', true);
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

    
  }
}
