export class PunchEnemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, player) {
    super(scene, x, y, 'punch-enemy-idle'); 
    
    this.maxHealth = 100;     
    this.health = this.maxHealth;
    
    this.scene = scene;
    this.player = player;

    scene.add.existing(this);
    scene.physics.add.existing(this);


    this.setCollideWorldBounds(true);
    this.setOrigin(0.5, 1);
    this.setScale(2);
    this.body.setAllowGravity(true);
    this.body.setSize(30 , 70);    
    this.body.setOffset(100, 50);   

    this.speed = 120;
    this.attackRange = 50;
    this.lightPunchRange = 30;  
    this.lightPunchDamage = 20;
    this.heavyPunchDamage = 30;

    this.isDead = false;
    this.state = 'idle';

    
    this.healthBarBg = this.scene.add.graphics();
    this.healthBarFg = this.scene.add.graphics();
    this.healthBarWidth = 65;  
    this.healthBarHeight = 5;  


    this.createAnimations(scene);
    this.play('punch-enemy-idle');
    
  }

  createAnimations(scene) {
    if (!scene.anims.exists('punch-enemy-idle')) {
      scene.anims.create({
        key: 'punch-enemy-idle',
        frames: scene.anims.generateFrameNumbers('punch-enemy', { start: 7, end: 9 }),
        frameRate: 6,
        repeat: -1
      });
    }

    if (!scene.anims.exists('punch-enemy-glare')) {
      scene.anims.create({
        key: 'punch-enemy-glare',
        frames: scene.anims.generateFrameNumbers('punch-enemy', { start: 0, end: 6 }),
        frameRate: 6,
        repeat: 0
      });
    }

    if (!scene.anims.exists('punch-enemy-walk')) {
      scene.anims.create({
        key: 'punch-enemy-walk',
        frames: scene.anims.generateFrameNumbers('punch-enemy', { start: 10, end: 17 }),
        frameRate: 10,
        repeat: -1
      });
    }

    if (!scene.anims.exists('punch-enemy-punch')) {
      scene.anims.create({
        key: 'punch-enemy-punch',
        frames: scene.anims.generateFrameNumbers('punch-enemy', { start: 27, end: 33}),
        frameRate: 12,
        repeat: 0
      });

    if (!scene.anims.exists('punch-enemy-punch2')) {
      scene.anims.create({
        key: 'punch-enemy-punch2',
        frames: scene.anims.generateFrameNumbers('punch-enemy', { start: 18, end: 26}),
        frameRate: 12,
        repeat: 0
      });  
    }

    if (!scene.anims.exists('punch-enemy-death')) {
    scene.anims.create({
        key: 'punch-enemy-death',
        frames: scene.anims.generateFrameNumbers('punch-enemy', { start: 34,  }), 
        frameRate: 10,
        repeat: 0
    });
}
  
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.isDead) return;

    switch (this.state) {
      case 'idle':
    
    if (!this.patrolDirection) this.patrolDirection = -1; 
    this.setVelocityX(30 * this.patrolDirection); 
    this.flipX = this.patrolDirection > 0; 

    
    if (this.body.blocked.right) this.patrolDirection = -1;
    if (this.body.blocked.left) this.patrolDirection = 1;

    
    if (this.scene.cameras.main.worldView.contains(this.x, this.y)) {
      this.state = 'glare';
      this.setVelocity(0, 0);
      this.play({
        key: 'punch-enemy-idle',
        repeat: 1 
      });
    }
    break;

  case 'glare':
    
    this.once('animationcomplete-punch-enemy-idle', () => {
      this.play('punch-enemy-glare');
      this.once('animationcomplete-punch-enemy-glare', () => {
        this.state = 'chase';
        this.play('punch-enemy-walk');
      });
    });
    break;

      case 'chase':
        this.scene.physics.moveToObject(this, this.player, this.speed);
        this.flipX = this.body.velocity.x > 0;

        const dist = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
        if (dist < this.lightPunchRange) {
        this.state = 'punch';
        this.setVelocity(0, 0);

        
        if (Math.random() < 0.4) {  
            this.play('punch-enemy-punch2');
            this.scene.cameras.main.shake(150, 0.01); 
            this.once('animationcomplete', () => {
                this.player.emit('hitByEnemy', this.heavyPunchDamage);
                this.state = 'chase';
                this.play('punch-enemy-walk');
            });
        } else {
            this.play('punch-enemy-punch');
            this.scene.cameras.main.shake(100, 0.005); 
            this.once('animationcomplete', () => {
                this.player.emit('hitByEnemy', this.lightPunchDamage);
                this.state = 'chase';
                this.play('punch-enemy-walk');
            });
        }
    }
    break;
    }
    this.updateHealthBar();

  }

  takeDamage(amount) {
    if (this.isDead) return;    
    this.health -= amount;
    this.updateHealthBar();
    if (this.health <= 0) {
        this.health = 0;
        this.die();              
    } else {
        this.setTint(0xff0000);
        this.scene.time.addEvent({
            delay: 100,
            callback: () => this.clearTint()
        });
    }
}


  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.setVelocity(0, 0);
    this.play('punch-enemy-death');


    this.body.enable = false;

     
    if (this.healthBarBg) this.healthBarBg.destroy();
    if (this.healthBar) this.healthBar.destroy();
    this.once('animationcomplete', () => this.destroy());
  }
 updateHealthBar() {
    
    let x = this.x - this.healthBarWidth / 8;
    const y = this.y - this.body.height - 26;

    if (this.flipX) {
        x = this.x - this.healthBarWidth ; 
    }

    
    this.healthBarBg.clear();
    this.healthBarBg.fillStyle(0x575349, 1);
    this.healthBarBg.fillRect(x, y, this.healthBarWidth, this.healthBarHeight);

    
    this.healthBarFg.clear();
    let healthPercent = Phaser.Math.Clamp(this.health / this.maxHealth, 0, 1);
    let color = 0xc8c3ad;
    if (healthPercent < 0.5) color = 0xaca793;
    if (healthPercent < 0.25) color = 0xff0000;

    this.healthBarFg.fillStyle(color, 1);
    this.healthBarFg.fillRect(x, y, this.healthBarWidth * healthPercent, this.healthBarHeight);
}


}

