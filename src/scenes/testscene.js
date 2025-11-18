export default class TerminalCutscene extends Phaser.Scene {
  constructor() {
    super({ key: 'TerminalCutscene' });
  }

  create() {
    const { width, height } = this.cameras.main;
    // background
    this.add.rectangle(width / 2, height / 2, width, height, 0x0b0d0f);

    // build UI
    this.createSciFiUI(width, height);

    // dialogue sequence (kept same as you provided)
    this.dialogueSequence = [
      {
        speaker: '6O',
        message: "Hey 2B! Got another patch job for you — those factory nodes are acting up again.",
        choices: [
          { text: "Figures. Machines never learn.", response: "acknowledge" },
          { text: "What kind of malfunction?", response: "question" }
        ]
      },
      {
        speaker: '6O',
        message: "Heh, well, that's why you're there. Just… try not to blow up the terminal this time, okay?",
        choices: [
          { text: "No promises.", response: "sarcastic" },
          { text: "I'll be careful.", response: "serious" }
        ]
      },
      {
        speaker: '6O',
        message: "Ugh, fine. Just stay in one piece, alright?",
        choices: [
          { text: "Copy that. Starting operation.", response: "proceed" },
          { text: "Don't worry about me.", response: "confident" }
        ]
      }
    ];

    this.currentDialogueIndex = 0;
    this.isShowingNotification = false;
    this.messageHistory = [];
    this.messageYPosition = 150;

    // icons
    this.createPlaceholderIcons();

    // start notifications and show comm active
    this.time.delayedCall(1000, () => this.showNotification());
    this.showSystemMessage('[COMM LINK — ACTIVE]', '#7ae2b3');
  }

  createSciFiUI(width, height) {
    const panelWidth = 800;
    const panel = this.add.rectangle(0, 0, panelWidth, height, 0x0b0d0f, 0.95)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x7ae2b3, 0.2);

    const headerBar = this.add.rectangle(0, 0, panelWidth, 60, 0x0d0f12, 1)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x7cc7d9, 0.3);

    // logo + version
    this.add.text(20, 20, 'STΛTIC', {
      fontFamily: 'Arial Black',
      fontSize: '26px',
      color: '#7ae2b3',
      shadow: { offsetX: 0, offsetY: 0, color: '#7ae2b3', blur: 8, fill: true }
    });

    this.add.text(20, 48, 'MISSION INTERFACE v4.72', {
      fontFamily: 'Courier New',
      fontSize: '11px',
      color: '#7cc7d9',
      alpha: 0.6
    });

    this.createStatusIndicators(panelWidth, 100);
    this.createMissionInfo(panelWidth, 250);
    this.createSystemDiagnostics(panelWidth, 420);
    this.createPanelScanlines(panelWidth, height);
    this.createPanelBrackets(panelWidth, height);
    this.createDataStreams(panelWidth);

    // subtle vignette
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.3)
      .setBlendMode('MULTIPLY')
      .setDepth(200);
  }

  createStatusIndicators(panelWidth, startY) {
    this.add.rectangle(20, startY, panelWidth - 40, 120, 0x000000, 0.25)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x7cc7d9, 0.25);

    this.add.text(30, startY + 10, '[ SYSTEM STATUS ]', {
      fontFamily: 'Courier New',
      fontSize: '13px',
      color: '#7cc7d9'
    });

    const statuses = [
      { label: 'COMM LINK', value: 'ACTIVE', color: '#7ae2b3' },
      { label: 'ENCRYPTION', value: 'ENABLED', color: '#7cc7d9' },
      { label: 'LOCATION', value: 'COORDINATES LOCKED', color: '#7ae2b3' }
    ];

    statuses.forEach((status, index) => {
      const y = startY + 40 + index * 25;
      const dot = this.add.circle(40, y + 5, 4, Phaser.Display.Color.HexStringToColor(status.color).color);
      this.tweens.add({
        targets: dot,
        alpha: { from: 0.4, to: 1 },
        duration: 1200,
        yoyo: true,
        repeat: -1
      });

      this.add.text(55, y, status.label, {
        fontFamily: 'Courier New',
        fontSize: '12px',
        color: '#8b8b8b'
      });
      this.add.text(230, y, status.value, {
        fontFamily: 'Courier New',
        fontSize: '12px',
        color: status.color
      });
    });
  }

  createMissionInfo(panelWidth, startY) {
    this.add.rectangle(20, startY, panelWidth - 40, 140, 0x000000, 0.25)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0xd1779b, 0.25);

    this.add.text(30, startY + 10, '[ MISSION DATA ]', {
      fontFamily: 'Courier New',
      fontSize: '13px',
      color: '#d1779b'
    });

    const missionData = [
      'OBJECTIVE: Factory Maintenance',
      'PRIORITY: Standard',
      'OPERATOR: 6O',
      'UNIT: 2B [Infantry Model]'
    ];

    missionData.forEach((data, index) => {
      this.add.text(30, startY + 45 + index * 22, data, {
        fontFamily: 'Courier New',
        fontSize: '12px',
        color: '#b8b8b8'
      });
    });
  }

createSystemDiagnostics(panelWidth, startY) {
  // Diagnostics background (same width as panel)
  const diagBg = this.add.rectangle(20, startY, panelWidth - 40, 100, 0x000000, 0.25)
    .setOrigin(0, 0)
    .setStrokeStyle(1, 0x7ae2b3, 0.25);

  // Title
  this.add.text(30, startY + 10, '[ DIAGNOSTICS ]', {
    fontFamily: 'Courier New',
    fontSize: '13px',
    color: '#7ae2b3',
    fontStyle: 'bold'
  }).setDepth(0);

  // Bar definitions (label, target percent, color)
  const bars = [
    { label: 'POWER', value: 0.95, color: 0x7ae2b3 },
    { label: 'SIGNAL', value: 0.87, color: 0x7cc7d9 },
    { label: 'MEMORY', value: 0.62, color: 0xd1779b }
  ];

  // Layout constants
  const barX = 120;
  const barWidth = 220;
  const barHeight = 8;
  const labelX = 30;
  const percentX = barX + barWidth + 20;

  bars.forEach((bar, i) => {
    const y = startY + 45 + i * 18;

    // label
    this.add.text(labelX, y - 5, bar.label, {
      fontFamily: 'Courier New',
      fontSize: '11px',
      color: '#8b8b8b'
    }).setDepth(0);

    // background (empty bar)
    this.add.rectangle(barX, y, barWidth, barHeight, 0x222222).setOrigin(0, 0.5).setDepth(0);

    // progress rect (start at width 0, tween to full)
    const progress = this.add.rectangle(barX, y, 0, barHeight, bar.color).setOrigin(0, 0.5).setDepth(0);

    this.tweens.add({
      targets: progress,
      width: barWidth * bar.value,
      duration: 900,
      ease: 'Power2',
      delay: i * 120
    });

    // percent text on right
    this.add.text(percentX, y - 7, `${Math.floor(bar.value * 100)}%`, {
      fontFamily: 'Courier New',
      fontSize: '11px',
      color: '#e4e4e4'
    }).setDepth(0);
  });
}


  createPanelScanlines(panelWidth, height) {
    for (let i = 0; i < height; i += 3) {
      this.add.rectangle(panelWidth / 2, i, panelWidth, 1, 0x7ae2b3, 0.02);
    }
  }

  createPanelBrackets(panelWidth, height) {
    const b = 15, c = 0x7ae2b3, a = 0.3;
    this.add.rectangle(0, 0, b, 2, c, a);
    this.add.rectangle(0, 0, 2, b, c, a);
    this.add.rectangle(panelWidth - b, 0, b, 2, c, a);
    this.add.rectangle(panelWidth - 2, 0, 2, b, c, a);
    this.add.rectangle(0, height - 2, b, 2, c, a);
    this.add.rectangle(0, height - b, 2, b, c, a);
    this.add.rectangle(panelWidth - b, height - 2, b, 2, c, a);
    this.add.rectangle(panelWidth - 2, height - b, 2, b, c, a);
  }

  createDataStreams(panelWidth) {
    for (let i = 0; i < 3; i++) {
      const line = this.add.rectangle(
        Phaser.Math.Between(50, panelWidth - 50),
        -10,
        1,
        Phaser.Math.Between(30, 80),
        0x7ae2b3,
        0.15
      );
      this.tweens.add({
        targets: line,
        y: 800,
        duration: Phaser.Math.Between(2000, 4000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000)
      });
    }
  }

  createPlaceholderIcons() {
    // 6O
    if (!this.textures.exists('icon_6o')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x0b2b2b, 1);
      g.fillCircle(25, 25, 25);
      g.lineStyle(2, 0x7cc7d9, 1);
      g.strokeCircle(25, 25, 25);
      g.generateTexture('icon_6o', 50, 50);
      g.destroy();

      const c = this.add.container(-100, -100);
      const icon = this.add.image(0, 0, 'icon_6o');
      const text = this.add.text(0, 0, '6O', {
        fontFamily: 'Arial Black',
        fontSize: '18px',
        color: '#7cc7d9'
      }).setOrigin(0.5);
      c.add([icon, text]);
      this.time.delayedCall(50, () => c.destroy());
    }

    // 2B
    if (!this.textures.exists('icon_2b')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x111111, 1);
      g.fillCircle(25, 25, 25);
      g.lineStyle(2, 0xe4e4e4, 1);
      g.strokeCircle(25, 25, 25);
      g.generateTexture('icon_2b', 50, 50);
      g.destroy();

      const c = this.add.container(-100, -100);
      const icon = this.add.image(0, 0, 'icon_2b');
      const text = this.add.text(0, 0, '2B', {
        fontFamily: 'Arial Black',
        fontSize: '18px',
        color: '#e4e4e4'
      }).setOrigin(0.5);
      c.add([icon, text]);
      this.time.delayedCall(50, () => c.destroy());
    }
  }

  showSystemMessage(text, color) {
    const { width } = this.cameras.main;
    const systemMsg = this.add.text(width / 2, 60, text, {
      fontFamily: 'Courier New',
      fontSize: '14px',
      color: color,
      backgroundColor: '#000000',
      padding: { x: 12, y: 6 },
      shadow: { offsetX: 0, offsetY: 0, color: color, blur: 10, fill: true }
    }).setOrigin(0.5).setAlpha(0).setDepth(100);

    this.tweens.add({
      targets: systemMsg,
      alpha: 1,
      y: 80,
      duration: 450,
      ease: 'Back.easeOut'
    });

    this.time.delayedCall(2700, () => {
      this.tweens.add({
        targets: systemMsg,
        alpha: 0,
        y: 60,
        duration: 300,
        onComplete: () => systemMsg.destroy()
      });
    });
  }

  showNotification() {
    if (this.currentDialogueIndex >= this.dialogueSequence.length) {
      // end sequence
      this.time.delayedCall(1200, () => {
        this.showSystemMessage('[LINK TERMINATED]', '#b35f5f');
        this.time.delayedCall(1600, () => {
          this.cameras.main.fade(500, 0, 0, 0);
          this.time.delayedCall(500, () => {
            this.scene.start('GameScene');
          });
        });
      });
      return;
    }

    // push up older messages
    this.pushMessagesUp(130);

    const dialogue = this.dialogueSequence[this.currentDialogueIndex];
    const { width } = this.cameras.main;

    // container for notification (right side)
    const notificationWidth = 450;
    const notificationX = width - 30;
    const notificationY = this.messageYPosition;

    const container = this.add.container(notificationX, notificationY).setDepth(10);

    // background + topbar using muted palette
    const bg = this.add.rectangle(0, 0, notificationWidth, 120, 0x0e0e0e, 0.95)
      .setOrigin(1, 0)
      .setStrokeStyle(1, 0x7cc7d9, 0.6);
    const topBar = this.add.rectangle(0, 0, notificationWidth, 35, 0x111416, 1).setOrigin(1, 0);

    // icon placeholder (6O) by default for these messages
    const icon = this.add.image(-notificationWidth + 20, 17, 'icon_6o').setOrigin(0.5).setScale(0.7);

    const speakerText = this.add.text(-notificationWidth + 50, 10, `OPERATOR ${dialogue.speaker}`, {
      fontFamily: 'Courier New',
      fontSize: '14px',
      color: '#7cc7d9',
      fontStyle: 'bold'
    }).setOrigin(0, 0);

    const messageText = this.add.text(-notificationWidth + 15, 50, '', {
      fontFamily: 'Courier New',
      fontSize: '15px',
      color: '#e4e4e4',
      wordWrap: { width: notificationWidth - 30 }
    }).setOrigin(0, 0);

    container.add([bg, topBar, icon, speakerText, messageText]);
    container.setAlpha(0);

    this.messageHistory.push(container);

    // slide in
    this.tweens.add({
      targets: container,
      alpha: 1,
      x: notificationX,
      duration: 400,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.typewriterEffect(messageText, dialogue.message, () => {
          this.time.delayedCall(400, () => {
            this.showChoices(dialogue.choices, notificationX, notificationY + 130);
          });
        });
      }
    });

    this.currentNotificationContainer = container;
  }

  typewriterEffect(textObj, fullText, onComplete) {
    textObj.text = '';
    let charIndex = 0;
    const typeTimer = this.time.addEvent({
      delay: 24,
      callback: () => {
        if (charIndex < fullText.length) {
          textObj.text += fullText[charIndex++];
        } else {
          typeTimer.remove();
          if (onComplete) onComplete();
        }
      },
      loop: true
    });
  }

  showChoices(choices, x, y) {
    const { width } = this.cameras.main;
    const choiceWidth = 420;
    const choiceHeight = 45;
    const spacing = 55;

    this.choiceButtons = [];

    choices.forEach((choice, index) => {
      const choiceY = y + index * spacing;
      const container = this.add.container(x, choiceY).setDepth(10);

      const bg = this.add.rectangle(0, 0, choiceWidth, choiceHeight, 0x0c1212, 0.95)
        .setOrigin(1, 0)
        .setStrokeStyle(1, 0x7ae2b3, 0.45);

      const choiceText = this.add.text(-choiceWidth + 20, choiceHeight / 2, `▸ ${choice.text}`, {
        fontFamily: 'Courier New',
        fontSize: '15px',
        color: '#7ae2b3',
        wordWrap: { width: choiceWidth - 40 }
      }).setOrigin(0, 0.5);

      container.add([bg, choiceText]);
      container.setAlpha(0);
      container.setSize(choiceWidth, choiceHeight);
      container.setInteractive();

      this.tweens.add({
        targets: container,
        alpha: 1,
        duration: 300,
        delay: index * 90,
        ease: 'Power2'
      });

      container.on('pointerover', () => {
        bg.setStrokeStyle(1, 0xe4e4e4, 0.8);
        choiceText.setColor('#e4e4e4');
      });

      container.on('pointerout', () => {
        bg.setStrokeStyle(1, 0x7ae2b3, 0.45);
        choiceText.setColor('#7ae2b3');
      });

      container.on('pointerdown', () => this.onChoiceSelected(choice, container));

      this.choiceButtons.push(container);
    });
  }

  onChoiceSelected(choice, selectedContainer) {
    // disable all choice interactions
    this.choiceButtons.forEach(btn => btn.disableInteractive());
    // fade out / destroy choices
    this.choiceButtons.forEach(c => {
      this.tweens.add({
        targets: c,
        alpha: 0,
        duration: 180,
        onComplete: () => c.destroy()
      });
    });

    // show 2B response
    this.show2BResponse(choice.text);

    // advance dialogue index and show next after a short delay
    this.currentDialogueIndex++;
    this.time.delayedCall(1200, () => this.showNotification());
  }

  pushMessagesUp(amount) {
    this.messageHistory.forEach(message => {
      this.tweens.add({
        targets: message,
        y: message.y - amount,
        duration: 380,
        ease: 'Power2'
      });
    });
  }

  show2BResponse(text) {
    // push up existing messages
    this.pushMessagesUp(110);

    const { width } = this.cameras.main;
    const notificationWidth = 450;
    const notificationX = width - 30;
    const notificationY = this.messageYPosition;

    const container = this.add.container(notificationX, notificationY).setDepth(10);

    const bg = this.add.rectangle(0, 0, notificationWidth, 100, 0x0f0f0f, 0.95)
      .setOrigin(1, 0)
      .setStrokeStyle(1, 0xe4e4e4, 0.6);

    const topBar = this.add.rectangle(0, 0, notificationWidth, 35, 0x1a1a1a, 1).setOrigin(1, 0);

    const icon = this.add.image(-notificationWidth + 20, 17, 'icon_2b').setOrigin(0.5).setScale(0.7);

    const speakerText = this.add.text(-notificationWidth + 50, 10, 'UNIT 2B', {
      fontFamily: 'Courier New',
      fontSize: '14px',
      color: '#e4e4e4',
      fontStyle: 'bold'
    }).setOrigin(0, 0);

    const responseText = this.add.text(-notificationWidth + 15, 50, text, {
      fontFamily: 'Courier New',
      fontSize: '15px',
      color: '#dddddd',
      wordWrap: { width: notificationWidth - 30 }
    }).setOrigin(0, 0);

    container.add([bg, topBar, icon, speakerText, responseText]);
    container.setAlpha(0);

    this.messageHistory.push(container);

    this.tweens.add({
      targets: container,
      alpha: 1,
      duration: 300,
      ease: 'Power2'
    });
  }
      skipToGame() {
      // small terminal shutdown flash effect
      this.cameras.main.flash(300, 0, 255, 136);

      this.time.delayedCall(300, () => {
        this.cameras.main.fade(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
          this.scene.start('QuizScene', {
            level: 1,
            nextLevel: 1,
            skipInstruction: false
          });
        });
      });
    }

}
