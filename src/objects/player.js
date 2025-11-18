export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    Phaser.Events.EventEmitter.call(this); 

    this.setScale(1.2).setCollideWorldBounds(true);
    this.setOrigin(0.5,1);

    
    this.setSize(40, 40);      
    this.setOffset(40, 90);  

    this.health = 240;
    this.maxHealth = 240;

    
    this.on('hitByEnemy', () => {
      if (this.isDead) return;  
      this.health -= 1;   
      this.flashWhite();   
      this.playRandomDamageSound();
      if (this.health <= 0) {
        this.health = 0;
        this.die(); 
      }
    });

    
    if (!scene.anims.exists('player-idle')) {
      scene.anims.create({
        key: 'player-idle',
        frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
        frameRate: 8,
        repeat: -1
      });
    }

    if (!scene.anims.exists('player-walk')) {
      scene.anims.create({
        key: 'player-walk',
        frames: scene.anims.generateFrameNumbers('walk', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
      });
    }

    if (!scene.anims.exists('player-slash')) {
      scene.anims.create({
        key: 'player-slash',
        frames: scene.anims.generateFrameNumbers('slash', { start: 0, end: 7 }),
        frameRate: 12,
        repeat: 0
      });
    }

    if (!scene.anims.exists('player-down-slash')) {
      scene.anims.create({
        key: 'player-down-slash',
        frames: scene.anims.generateFrameNumbers('down-slash', { start: 0, end: 7 }),
        frameRate: 12,
        repeat: 0
      });
    }

    if (!scene.anims.exists('player-double-slash')) {
      scene.anims.create({
        key: 'player-double-slash',
        frames: scene.anims.generateFrameNumbers('double-slash', { start: 0, end: 11 }), 
        frameRate: 16,
        repeat: 0
      });
    }

    if (!scene.anims.exists('player-death')) {
      scene.anims.create({
        key: 'player-death',
        frames: scene.anims.generateFrameNumbers('player-death', { start: 0, end: 15 }),
        frameRate: 8,
        repeat: 0
      });
    }

    this.play('player-idle');

    this.isAttacking = false;
    this.canUseSpecial = true;      
    this.specialCooldown = 3000;    
    this.lastDamageSoundTime = 0;
    this.damageSoundCooldown = 500; 
  }

  
  attack() {
    if (this.isAttacking || this.isDead) return;

    this.isAttacking = true;
    this.setVisible(false);

    let slash = this.scene.add.sprite(this.x, this.y - 20, 'slash'); 
    slash.play('player-slash');
    this.scene.sound.play('lightslash', { volume: 0.2, rate: 0.95, loop: false });

    slash.flipX = this.flipX;
    slash.setOrigin(0.5, 0.89);
    slash.setScale(1.0998);

    this.scene.physics.add.existing(slash);
    slash.body.allowGravity = false;

    const hitboxWidth = slash.width * 0.5;
    const hitboxHeight = slash.height;

    if (this.flipX) {
        slash.body.setSize(hitboxWidth, hitboxHeight);
        slash.body.setOffset(slash.width * 0.0, slash.height * 0.1);
    } else {
        slash.body.setSize(hitboxWidth, hitboxHeight);
        slash.body.setOffset(slash.width * 0.5, slash.height * 0.1);
    }

    let enemyCollider = this.scene.physics.add.overlap(
        slash, 
        this.scene.enemies, 
        (slashObj, enemy) => {
            enemy.die(); 
            this.scene.cameras.main.shake(100, 0.002);
        }
    );

    let punchCollider = this.scene.physics.add.overlap(
        slash, 
        this.scene.punchEnemies, 
        (slashObj, enemy) => {
            enemy.takeDamage(45); 
            this.scene.cameras.main.shake(100, 0.002);
            this.scene.physics.world.removeCollider(punchCollider);
        }
    );

    slash.on('animationcomplete', () => {
        slash.destroy();
        this.setVisible(true);
        this.isAttacking = false;
        this.scene.physics.world.removeCollider(enemyCollider);
        this.scene.physics.world.removeCollider(punchCollider);
    });
  }

  specialAttack() {
    if (this.isAttacking || this.isDead || !this.canUseSpecial) return;

    this.canUseSpecial = false;
    this.specialStartTime = this.scene.time.now;
    this.isAttacking = true;
    this.setVisible(false);

    this.scene.time.delayedCall(this.specialCooldown, () => {
        this.canUseSpecial = true;
    });

    let offsetX = this.flipX ? -60 : 0;
    let special = this.scene.add.sprite(this.x + offsetX, this.y - 27, 'double-slash'); 
    special.play('player-double-slash');
    special.flipX = this.flipX;
    special.setScale(1.12);
    special.setOrigin(0.365, 0.8);

    this.scene.physics.add.existing(special);
    special.body.allowGravity = false;

    let firstHitDone = new Set();
    let secondHitDone = new Set();
    let firstSlashHit = false;
    let secondSlashHit = false;

    this.scene.sound.play('swing1', { volume: 0.2 });

    this.scene.physics.add.overlap(
        special, 
        [...this.scene.enemies.getChildren(), ...this.scene.punchEnemies.getChildren()], 
        (slashObj, enemy) => {
            if (!firstHitDone.has(enemy)) {
                if (enemy.takeDamage) enemy.takeDamage(30);
                else enemy.die();
                this.scene.cameras.main.shake(90, 0.01);

                if (!firstSlashHit) {
                    this.scene.sound.play('slash1', { volume: 0.2 });
                    firstSlashHit = true;
                }

                firstHitDone.add(enemy);
            }
        }
    );

    this.scene.time.delayedCall(500, () => {
        if (!special.active) return;

        this.scene.sound.play('swing2', { volume: 0.2 });

        this.scene.physics.add.overlap(
            special, 
            [...this.scene.enemies.getChildren(), ...this.scene.punchEnemies.getChildren()], 
            (slashObj, enemy) => {
                if (!secondHitDone.has(enemy)) {
                    if (enemy.takeDamage) enemy.takeDamage(50);
                    else enemy.die();
                    this.scene.cameras.main.shake(120, 0.001);

                    if (!secondSlashHit) {
                        this.scene.sound.play('slash2', { volume: 0.2 });
                        secondSlashHit = true;
                    }

                    secondHitDone.add(enemy);
                }
            }
        );
    });

    special.on('animationcomplete', () => {
        special.destroy();
        this.setVisible(true);
        this.isAttacking = false;
    });
  }

  downSlash() {
    if (this.isAttacking || this.isDead) return;

    this.isAttacking = true;
    this.body.enable = false;
    this.play('player-down-slash');
    this.scene.sound.play('downslash', { volume: 0.35 });

    const dashDistance = this.flipX ? -80 : 80;

    this.scene.tweens.add({
      targets: this,
      x: this.x + dashDistance,
      duration: 333,
      ease: 'Linear'
    });

    const hitboxWidth = 200;
    const hitboxHeight = 140;
    let hitboxX = this.x + (this.flipX ? -hitboxWidth : 0); 
    const hitbox = this.scene.add.rectangle(hitboxX, this.y - 20, hitboxWidth, hitboxHeight);
    this.scene.physics.add.existing(hitbox);
    hitbox.body.allowGravity = false;
    hitbox.setOrigin(0, 0.8);

    const hitEnemies = new Set();
    const overlapHandler = (hb, enemy) => {
      if (hitEnemies.has(enemy)) return;
      hitEnemies.add(enemy);
      if (enemy.takeDamage) enemy.takeDamage(70);
      else enemy.die();
      this.scene.cameras.main.shake(120, 0.01);
    };

    this.scene.physics.add.overlap(hitbox, [...this.scene.enemies.getChildren(), ...this.scene.punchEnemies.getChildren()], overlapHandler);

    this.scene.time.delayedCall(200, () => hitbox.destroy());
    this.scene.time.delayedCall(450, () => {
      this.body.enable = true;
      this.isAttacking = false;
      this.setVelocityX(0);
      this.play('player-idle');
    });
  }

  flashWhite() {
    if (this.isDead) return;
    if (this.flashTween) {
      this.flashTween.remove();
    }

    this.flashTween = this.scene.tweens.add({
      targets: this,
      alpha: { from: 1, to: 0 },
      ease: 'Linear',
      duration: 80,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        this.alpha = 1;
        this.flashTween = null;
      }
    });
  }

  playRandomHeelSound() {
    const sounds = ['heel1', 'heel2', 'heel3'];
    const soundKey = Phaser.Utils.Array.GetRandom(sounds);
    this.scene.sound.play(soundKey, { volume: 0.025 });
  }

  playRandomDamageSound() {
    const now = this.scene.time.now;
    if (now - this.lastDamageSoundTime < this.damageSoundCooldown) return;

    const sounds = ['damage1', 'damage2'];
    const soundKey = Phaser.Utils.Array.GetRandom(sounds);
    this.scene.sound.play(soundKey, { volume: 0.035 });

    this.lastDamageSoundTime = now;
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;

    this.setVelocity(0, 0);
    this.body.enable = false;

    this.play('player-death');
    this.scene.sound.play('death', { volume: 0.060 });

    const bgm = this.scene.bgm1; 
    if (bgm && bgm.isPlaying) {
        this.scene.tweens.add({
            targets: bgm,
            volume: 0,
            duration: 2100, 
            onComplete: () => {
                bgm.stop();
                bgm.setVolume(0.18); 
            }
        });
    }

    const bgm2 = this.scene.bgm2; 
    if (bgm2 && bgm2.isPlaying) {
        this.scene.tweens.add({
            targets: bgm2,
            volume: 0,
            duration: 2100, 
            onComplete: () => {
                bgm2.stop();
                bgm2.setVolume(0.18); 
            }
        });
    }

    this.once('animationcomplete', () => {
      this.scene.time.delayedCall(1900, () => {
        this.scene.scene.start('GameoverScene'); 
      });
    });
  }
}
