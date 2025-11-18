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
    this.load.audio('bgm1', 'audio/bgm/l1bgm.mp3');
    this.load.audio('korose', 'audio/sfx/korose.mp3');
    this.load.audio('korose2', 'audio/sfx/korose2.mp3');
    this.load.audio('heel1', 'audio/sfx/heel1.mp3');
    this.load.audio('heel2', 'audio/sfx/heel2.mp3');
    this.load.audio('heel3', 'audio/sfx/heel3.mp3');
    this.load.audio('damage1', 'audio/sfx/damage1.mp3');
    this.load.audio('damage2', 'audio/sfx/damage2.mp3');
    this.load.audio('death', 'audio/sfx/grunt.mp3');
    this.load.audio('lightslash', 'audio/sfx/lightslash.mp3');
    this.load.audio('slash1', 'audio/sfx/slash1.mp3');
    this.load.audio('slash2', 'audio/sfx/slash2.mp3');
    this.load.audio('swing1', 'audio/sfx/swing1.mp3');
    this.load.audio('swing2', 'audio/sfx/swing2.mp3');
    this.load.audio('downslash', 'audio/sfx/slash.mp3');


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

    this.load.spritesheet('player-death', 'assets/2B-death.png', {
      frameWidth: 128, frameHeight: 128
    });


    // slash attack
    this.load.spritesheet('slash', 'assets/2B_slash.png', {
      frameWidth: 256, frameHeight: 159
    });
    // down slash
    this.load.spritesheet('down-slash', 'assets/2B_downslash.png', {
      frameWidth: 192,
      frameHeight: 128
    });
    // double slash
    this.load.spritesheet('double-slash', 'assets/2B-doubleswipe.png', {
      frameWidth: 224, frameHeight: 128
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
    this.load.spritesheet('spark', 'assets/sparksbursts.png',{frameWidth: 256,
    frameHeight: 256}); 




    

  }

  create() {
    this.cameras.main.fadeIn(600, 0, 0, 0); //  fade in
    // Play 
    this.bgm1 = this.sound.add('bgm1', {
        volume: 0.19,   
        rate:1.05,
        loop: true      
    });
    this.bgm1.play();
  
  this.time.delayedCall(4000, () => {
    this.sound.play('korose', { volume: 0.2 });
  });
  this.time.delayedCall(8000, () => {
    this.sound.play('korose2', { volume: 0.15 });
  });
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
    bgDark.setScrollFactor(0); // stays fixed on screen
   

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
  const barWidth1 = 250;
  const barHeight1 = 4;
  this.cooldownBarBg = this.add.rectangle(21, 33, barWidth1, barHeight1, 0x585350).setOrigin(0, 0);
  this.cooldownBar = this.add.rectangle(21, 33, 0, barHeight1, 0xfffcf9).setOrigin(0, 0);
  this.uielem = this.add.rectangle(275, 33, 6, 4, 0xfffcf9).setOrigin(0, 0);
  this.cooldownBar.maxWidth = barWidth1;
  this.cooldownBarBg.setScrollFactor(0);
  this.cooldownBar.setScrollFactor(0);
  this.uielem.setScrollFactor(0);
  this.cooldownBarBg.setDepth(1000);
  this.uielem.setDepth(1001);
  this.cooldownBar.setDepth(1001);

  // pod using Pod.js
  this.pod = new Pod(this, 100, 339,this.player);
  if (this.registry.values.podCharges !== undefined) {
  this.pod.maxUses = this.registry.values.podCharges;
  }
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
    this.currentBarWidth = Phaser.Math.Linear(this.currentBarWidth, targetWidth, 0.3); // 0.1 = speed factor

    // Determine color based on health
    let color = 0xc8c3ad; // full health
    if (healthPercent < 0.6) color = 0xaca793; // medium health
    if (healthPercent < 0.3) color = 0x967C66; // low health (red)

    // Draw foreground
    this.healthBarFg.clear();
    this.healthBarFg.fillStyle(color, 1);
    this.healthBarFg.fillRect(barX, barY, this.currentBarWidth, barHeight);
};

// Initial draw
this.updateHealthBar();


  this.podChargeText = this.add.text(600, 10, '', {
    fontFamily: 'monospace',
    fontSize: '16px',
    color: '#fff'
  });
  this.podChargeText.setScrollFactor(0);
  this.podChargeText.setDepth(1000);
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


const startY = 433;
const maxEnemies = 15;        
const maxAliveAtOnce = 5;       
this.totalSpawnedEnemies = 0;


for (let i = 0; i < 3; i++) {
  let x = 900 + Math.random()*900;
  let enemy = new Enemy(this, x, startY, this.player);
  this.enemies.add(enemy);
  this.physics.add.collider(enemy, this.ground);
  this.totalSpawnedEnemies++;
}


for (let i = 0; i < 4; i++) {
  let x = 800 + Math.random()*500;
  let punchEnemy = new PunchEnemy(this, x, startY, this.player);
  this.punchEnemies.add(punchEnemy);
  this.physics.add.collider(punchEnemy, this.ground);
  this.totalSpawnedEnemies++;
}
for (let i = 0; i < 4; i++) {
  let x = 600 + Math.random()*700;
  let punchEnemy = new PunchEnemy(this, x, startY, this.player);
  this.punchEnemies.add(punchEnemy);
  this.physics.add.collider(punchEnemy, this.ground);
  this.totalSpawnedEnemies++;
}




// WAVE SPAWNER
this.time.addEvent({
  delay: 2500,   // spawn every 2.5s
  loop: true,
  callback: () => {
    const alive = this.enemies.countActive(true) + this.punchEnemies.countActive(true);

    // Stop spawning if limit reached
    if (this.totalSpawnedEnemies >= maxEnemies) return;
    if (alive >= maxAliveAtOnce) return;

    const y = startY;
    const x = 1500 + Phaser.Math.Between(0, 50); 

    // Randomly pick enemy type
    if (Math.random() < 0.5) {
      const enemy = new Enemy(this, x, y, this.player);
      this.enemies.add(enemy);
      this.physics.add.collider(enemy, this.ground);
    } else {
      const punchEnemy = new PunchEnemy(this, x, y, this.player);
      this.punchEnemies.add(punchEnemy);
      this.physics.add.collider(punchEnemy, this.ground);
    }

    this.totalSpawnedEnemies++;
  }
});

// LEVEL COMPLETE CHECK
this.checkLevelComplete = () => {
  const totalAlive = this.enemies.countActive(true) + this.punchEnemies.countActive(true);

  if (this.totalSpawnedEnemies >= maxEnemies && totalAlive === 0) {
    if (this.bgm1 && this.bgm1.isPlaying) {
      this.tweens.add({
        targets: this.bgm1,
        volume: 0,
        duration: 2000,
        onComplete: () => this.bgm1.stop()
      });
    }

    if (this.pod) this.pod.stopFiring();
      this.time.delayedCall(2500, () => {
      this.input.keyboard.removeAllListeners();
      this.scene.start('TerminalCutscene2');
    });
  }
};

this.events.on('update', this.checkLevelComplete);



    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      enemy.explode();
    }, null, this);
   
    this.player.on('hitByEnemy', (damage = 30) => { 
    if (this.player.isDead) return; 

    this.player.health -= damage;

    if (this.player.health <= 0) {
        this.player.health = 0;
        this.player.die();  
    }

    this.updateHealthBar();
});


    this.physics.add.overlap(this.player, this.punchEnemies, (player, punchEnemy) => {
        if (player.isAttacking) {
            punchEnemy.takeDamage(25); 
        }
    }, null, this);


  //    this.time.addEvent({
  //     delay: 4000,
  //     loop: true,
  //     callback: () => {
  //       const cam = this.cameras.main;
  //       const x = cam.worldView.x + cam.width + 50; 
  //       const y = 433; 

  //       let enemy = new Enemy(this, x, y, this.player);
  //       this.enemies.add(enemy);

    
  //       this.physics.add.collider(enemy, this.ground);
  //     }
  //   });
 
  //  this.time.addEvent({
  //   delay: 7000, 
  //   loop: true,
  //   callback: () => {
  //       const cam = this.cameras.main;
  //       const x = cam.worldView.x + cam.width + Phaser.Math.Between(25, 400); 
  //       const y = 433; 

  //       let punchEnemy = new PunchEnemy(this, x, y, this.player);
  //       this.punchEnemies.add(punchEnemy);

  //       this.physics.add.collider(punchEnemy, this.ground);
  //     }
  // });
      this.anims.create({
      key: 'spark-anim',
      frames: this.anims.generateFrameNumbers('spark', { start: 0, end: 53 }), // adjust frames
      frameRate: 58,
      repeat: 0
    });



    
    this.setupPlayerMovement();

    //  Play idle
    this.player.play('player-idle');
    
 




  }

  setupPlayerMovement() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');
    this.slashKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.specialKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.podFireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
  }

  update() {
          if (this.player.anims.currentAnim) {
          if (this.player.anims.currentAnim.key === 'player-idle') {
            this.player.setScale(1.1); 
          } else if (this.player.anims.currentAnim.key === 'player-walk') {
            this.player.setScale(1.2); 
          }
          this.updateHealthBar();
        }
        if (this.player.isDead) return;
        this.player.setVelocityX(0);

    let moving = false;
  if (!this.player.isAttacking) {
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
        this.player.setVelocityX(-280);
        this.player.play('player-walk', true);
        this.player.flipX = true;
        moving = true;
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
        this.player.setVelocityX(280);
        this.player.play('player-walk', true);
        this.player.flipX = false;
        moving = true;
    } else {
        this.player.play('player-idle', true);
    }
    if (moving) {
        if (!this.player.walkTimer) this.player.walkTimer = 0;
        this.player.walkTimer += this.game.loop.delta;

        if (this.player.walkTimer >= 350) { 
            this.player.playRandomHeelSound();
            this.player.walkTimer = 0;
        }
    }
  }

  if (this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S), 0)
      && Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE))) {
    this.player.downSlash();
  }

  if (Phaser.Input.Keyboard.JustDown(this.slashKey)) {
    this.player.attack();
  }
  if (Phaser.Input.Keyboard.JustDown(this.specialKey)) {
    this.player.specialAttack();
  }
 if (Phaser.Input.Keyboard.JustDown(this.podFireKey)) {
    this.pod.engageFire(this);
  }
 

  if (this.pod.state === 'idle' || this.pod.state === 'walk') {
      if (moving) this.pod.walk();
      else this.pod.idle();
  }
  this.podChargeText.setText(`Barrage Charges: ${this.pod.maxUses - this.pod.currentUses}/${this.pod.maxUses}`);


  this.bgLayer2.setScrollFactor(1.6); 
  this.wires.setScrollFactor(1.3);     

  this.pod.update(); 

  if (this.player && !this.player.canUseSpecial) {
    
    const elapsed = this.player.scene.time.now - this.player.specialStartTime;
    const progress = Phaser.Math.Clamp(elapsed / this.player.specialCooldown, 0, 1);

    
    this.cooldownBar.width = this.cooldownBar.maxWidth * progress;
  } else if (this.player && this.player.canUseSpecial) {
    this.cooldownBar.width = this.cooldownBar.maxWidth;
  }

  
 
  }
}
