import {Player} from '../objects/player.js';
import {Pod} from '../objects/pod.js';
import {Enemy} from '../objects/enemy.js';
import {PunchEnemy} from '../objects/enemy2.js';



export default class GameScene2 extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene2' });
    
  }

  preload() {

    this.load.audio('bgm2', 'audio/bgm/l2bgm.mp3');
     
    this.load.spritesheet('background2', 'assets/lvl2main.png', {
      frameWidth: 2000,
      frameHeight: 550
    });


    this.load.image('bglvl2', 'assets/lvl2parallaxunderlay.png');
    this.load.image('pipes', 'assets/lvl2parallaxoverlay.png');

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




    this.load.image('vignette', 'assets/vignette-rect.png');

  }

  create() {
    this.cameras.main.fadeIn(600, 0, 0, 0); //  fade in
     this.bgm2 = this.sound.add('bgm2', {
        volume: 0.09,   
        loop: true      
    });
    this.bgm2.play();

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

  
    // Darkening the background2 
    let bgDark = this.add.rectangle(600, 300, 2000, 600, 0x000000, 0.3);
    
    this.bg = this.add.sprite(0, 0, 'background2').setOrigin(0, 0);
    this.anims.create({
      key: 'bg-anim1',
      frames: this.anims.generateFrameNumbers('background2', { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1
    });
    this.bg.play('bg-anim1');
    // Parallax backgrounds
      this.bglvl2 = this.add.image(0, 0, 'bglvl2').setOrigin(0, 0);
      this.pipes = this.add.image(0, 0, 'pipes').setOrigin(0, 0);
      
        

      // Depth ordering: front first
      this.bg.setDepth(0); 
      this.pipes.setDepth(1);
      this.bglvl2.setDepth(2);
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
this.healthBarBg.fillStyle(0x575349, 1); 
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

const maxEnemies = 18;        
const maxAliveAtOnce = 5;       
this.totalSpawnedEnemies = 0;


for (let i = 0; i < 4; i++) {
  let x = 900 + Math.random()*900;
  let enemy = new Enemy(this, x, startY, this.player);
  this.enemies.add(enemy);
  this.physics.add.collider(enemy, this.ground);
  this.totalSpawnedEnemies++;
}


for (let i = 0; i < 9; i++) {
  let x = 800 + Math.random()*800;
  let punchEnemy = new PunchEnemy(this, x, startY, this.player);
  this.punchEnemies.add(punchEnemy);
  this.physics.add.collider(punchEnemy, this.ground);
  this.totalSpawnedEnemies++;
}





// WAVE SPAWNER
this.time.addEvent({
  delay: 2500,   
  loop: true,
  callback: () => {
    const alive = this.enemies.countActive(true) + this.punchEnemies.countActive(true);


    if (this.totalSpawnedEnemies >= maxEnemies) return;
    if (alive >= maxAliveAtOnce) return;

    const y = startY;
    const x = 1500 + Phaser.Math.Between(0, 50); 

    // Randompick enemy 
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

this.checkLevelComplete = () => {
  const totalAlive = this.enemies.countActive(true) + this.punchEnemies.countActive(true);

  if (this.totalSpawnedEnemies >= maxEnemies && totalAlive === 0) {
    if (this.bgm2 && this.bgm2.isPlaying) {
      this.tweens.add({
        targets: this.bgm2,
        volume: 0,
        duration: 2300,
        onComplete: () => this.bgm2.stop()
      });
    }

    if (this.pod) this.pod.stopFiring();

    this.time.delayedCall(2500, () => {
      this.input.keyboard.removeAllListeners();
      this.scene.start('GameScene2'); // next level
    });
  }
};


this.events.on('update', this.checkLevelComplete);



    // Player–enemy overlap (explode when they touch)
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      enemy.explode();
    }, null, this);
    //damage and death
    this.player.on('hitByEnemy', (damage = 30) => { // default 30 damage
    if (this.player.isDead) return; 

    this.player.health -= damage;

    if (this.player.health <= 0) {
        this.player.health = 0;
        this.player.die();  // call die 
    }

    this.updateHealthBar();
});


    // Player attack vs PunchEnemy
    this.physics.add.overlap(this.player, this.punchEnemies, (player, punchEnemy) => {
        if (player.isAttacking) {
            punchEnemy.takeDamage(25); // heavy attack
        }
    }, null, this);

      if (!this.anims.exists('spark-anim')) {
        this.anims.create({
          key: 'spark-anim',
          frames: this.anims.generateFrameNumbers('spark', { start: 0, end: 53 }),
          frameRate: 58,
          repeat: 0
        });
      }



    
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


  this.pod.update(); 

  if (this.player && !this.player.canUseSpecial) {
    
    const elapsed = this.player.scene.time.now - this.player.specialStartTime;
    const progress = Phaser.Math.Clamp(elapsed / this.player.specialCooldown, 0, 1);

    
    this.cooldownBar.width = this.cooldownBar.maxWidth * progress;
  } else if (this.player && this.player.canUseSpecial) {
    this.cooldownBar.width = this.cooldownBar.maxWidth;
  }

  this.bglvl2.setScrollFactor(1.7); 
  this.pipes.setScrollFactor(1.3);

 
  }
}
