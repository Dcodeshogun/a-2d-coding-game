const questionsPerLevel = {
  1: [
    { type: 'mcq', prompt: "Which of these is a valid variable declaration in C++?", options: ["int 5num;", "int num5;", "num int;", "integer num;"], answer: 1 },
    { type: 'input', prompt: "Write the correct keyword to define a constant integer num: ___ int num = 10;", answer: "const" },
    { type: 'mcq', prompt: "What is the output type of 'sizeof(int)' in C++?", options: ["int", "size_t", "void", "char"], answer: 1 },
    {
      type: 'mcq',
      prompt: "What does 'protected' access specifier mean in C++?",
      options: [
        "Accessible only inside the same class",
        "Accessible inside the same class and derived classes",
        "Accessible everywhere",
        "Accessible only by friends"
      ],
      answer: 1
    },
    {
      type: 'input',
      prompt: "Write the keyword used to handle exceptions: ___",
      answer: "try"
    }
  ],
  2: [
    { type: 'mcq', prompt: "Which operator is used to access members through a pointer?", options: ["*", "&", "->", "."], answer: 2 },
    { type: 'input', prompt: "Write the keyword used to declare a reference in C++: ___ int &ref = num;", answer: "int" },
    { type: 'mcq', prompt: "Which header file is needed for std::vector?", options: ["<vector>", "<array>", "<list>", "<map>"], answer: 0 },
    {
      type: 'mcq',
      prompt: "Which of the following can’t be overloaded in C++?",
      options: ["++", "==", "::", "+"],
      answer: 2
    },
    {
      type: 'mcq',
      prompt: "Which of the following is true about references?",
      options: [
        "A reference can be null",
        "A reference must be initialized when declared",
        "A reference can be reseated to another variable",
        "References consume more memory than pointers"
      ],
      answer: 1
    }
  ]
};

export default class QuizScene extends Phaser.Scene {
  constructor() {
    super({ key: 'QuizScene' });
    this.endMessages = {
      1: "Pod-096> Nodes secured. Returning back to factory ruins...",
      2: "Pod-096> All nodes patched. Resume search in the mall ruins...",
      3: "Pod-096> Inheritance restored. Proceed to next sector...",
      4: "Pod-096> Polymorphic overrides fixed. All systems stable..."
    };
  }

  preload() {
    this.load.image('terminalBg', 'src/ui/quiz-bg.png');
    this.load.audio('correct', './audio/sfx/correct.mp3');
    this.load.audio('wrong', './audio/sfx/Error.mp3');
  }

  create(data = {}) {
 
// Add a subtle semi-transparent neon frame to make it feel like a console window
const frame = this.add.graphics();
frame.lineStyle(2, 0x00ffcc, 0.7);
frame.strokeRoundedRect(25, 25, 750, 520, 12);
frame.fillStyle(0x001a0d, 0.25);
frame.fillRoundedRect(25, 25, 750, 520, 12);

// Add faint corner accents
const corner = this.add.graphics({ lineStyle: { width: 3, color: 0x00ffaa } });
const drawCorner = (x, y, flipX = false, flipY = false) => {
  const c = this.add.graphics();
  c.lineStyle(3, 0x00ffaa, 0.8);
  c.beginPath();
  c.moveTo(x, y);
  c.lineTo(x + (flipX ? -25 : 25), y);
  c.moveTo(x, y);
  c.lineTo(x, y + (flipY ? -25 : 25));
  c.strokePath();
};
drawCorner(25, 25);
drawCorner(775, 25, true, false);
drawCorner(25, 545, false, true);
drawCorner(775, 545, true, true);

// === Add a faint animated scanline overlay for that terminal vibe ===
const scanOverlay = this.add.graphics();
scanOverlay.fillStyle(0x00ff99, 0.04);
for (let i = 0; i < 550; i += 4) {
  scanOverlay.fillRect(26, 25 + i, 748, 2);
}
scanOverlay.setBlendMode(Phaser.BlendModes.ADD);
this.tweens.add({
  targets: scanOverlay,
  alpha: { from: 0.06, to: 0.15 },
  duration: 1600,
  yoyo: true,
  repeat: -1,
});

// Terminal text styling (kept same as before but inside this frame)
this.storyTextObj = this.add.text(40, 50, '', {
  fontFamily: 'monospace',
  fontSize: '18px',
  color: '#7fff9e',
  shadow: {
    offsetX: 0,
    offsetY: 0,
    color: '#00ff88',
    blur: 8,
    fill: true
  },
  wordWrap: { width: 720 }
});

    this.level = data.level || 1;
    this.nextLevel = data.nextLevel || this.level + 1;
    this.skipInstruction = data.skipInstruction || false;

    this.questions = questionsPerLevel[this.level];
    this.currentIndex = 0;
    this.wrongCount = 0;

    const menuScene = this.scene.get('MenuScene');
    if (menuScene && menuScene.bgm) {
      this.tweens.add({
        targets: menuScene.bgm,
        volume: 0,
        duration: 500,
        onComplete: () => menuScene.bgm.stop()
      });
    }
    this.sfx = {
      correct: this.sound.add('correct', { volume: 0.15 }),
      wrong: this.sound.add('wrong', { volume: 0.15 }),
    };

   
    this.add.image(0, 0, 'terminalBg').setOrigin(0, 0);
    this.terminalBuffer = [];
    this.maxLines = 22;
    this.lineHeight = 26;

    // Brighter green text, soft glow effect (optional drop shadow)
    this.storyTextObj = this.add.text(60, 70, '', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#7fff9e',
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: '#52e0f5ff',
        blur: 8,
        fill: true
      },
      wordWrap: { width: 720 }
    });

    this.optionTexts = [];
    this.inputDom = null;

    this.printLine("[Pod-096://> Initializing Node patch sequence]");
    this.typewriter("Detected C++ inconsistencies. Patching nodes...", 35, () => {
      this.showNextQuestion();
    });
  }

  printLine(line) {
    this.terminalBuffer.push(line);
    if (this.terminalBuffer.length > this.maxLines) this.terminalBuffer.shift();
    this.storyTextObj.setText(this.terminalBuffer.join('\n'));
  }

  typewriter(line, speed = 25, onComplete = null) {
    if (this.typewriterEvent) this.typewriterEvent.remove(false);
    let i = 0;
    let printed = '';
    this.typewriterEvent = this.time.addEvent({
      delay: speed,
      callback: () => {
        printed += line[i];
        i++;
        const visible = [...this.terminalBuffer, printed].join('\n');
        this.storyTextObj.setText(visible);
        if (i >= line.length) {
          this.typewriterEvent.remove(false);
          this.terminalBuffer.push(line);
          if (this.terminalBuffer.length > this.maxLines) this.terminalBuffer.shift();
          if (onComplete) onComplete();
        }
      },
      repeat: line.length - 1
    });
  }

  showNextQuestion() {
    if (this.currentIndex >= this.questions.length) {
      this.completeQuiz();
      return;
    }
    const q = this.questions[this.currentIndex];

    this.optionTexts.forEach(t => t.destroy());
    this.optionTexts = [];
    if (this.inputDom) {
      this.inputDom.destroy();
      this.inputDom = null;
    }

    this.typewriter(`[Node_${this.currentIndex + 1}] > ${q.prompt}`, 20, () => {
      const paddingBelowText = 10;
      this.lastQuestionY = this.storyTextObj.y + this.storyTextObj.height + paddingBelowText;
      if (q.type === 'mcq') this.showMCQOptions(q);
      else this.showTextInput(q);
    });
  }

  showMCQOptions(question) {
    const optionSpacing = 30;
    const startX = 60;
    question.options.forEach((opt, index) => {
      const txt = this.add.text(startX, this.lastQuestionY + index * optionSpacing, `${index + 1}. ${opt}`, {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#72d4a7', // muted green for idle
        shadow: {
          offsetX: 0,
          offsetY: 0,
          color: '#00ffcc',
          blur: 4,
          fill: true
        }
      }).setInteractive({ useHandCursor: true });

      txt.on('pointerover', () => txt.setColor('#00ffcc'));  // hover glow
      txt.on('pointerout', () => txt.setColor('#72d4a7'));
      txt.on('pointerdown', () => {
        this.optionTexts.forEach(t => t.disableInteractive && t.disableInteractive());
        if (this.inputDom) { this.inputDom.destroy(); this.inputDom = null; }
        this.handleAnswer(opt, question.answer, question.type, index);
      });

      this.optionTexts.push(txt);
    });
  }

  showTextInput(question) {
    const inputX = 210;
    const inputY = this.lastQuestionY + 6;
    this.inputDom = this.add.dom(inputX, inputY, 'input', {
      width: '300px',
      fontSize: '18px',
      backgroundColor: '#24484aff',
      color: '#34f4d7ff',
      border: '1px solid #2af6e1e3',
      padding: '3px'
    });
    this.inputDom.node.focus();
    this.inputDom.addListener('keyup');
    this.inputDom.on('keyup', event => {
      if (event.key === 'Enter') {
        this.inputDom.removeListener('keyup');
        const val = this.inputDom.node.value;
        this.handleAnswer(val, question.answer, question.type);
      }
    });
    this.optionTexts.push(this.inputDom);
  }

  handleAnswer(given, correct, type, index = null) {
    const isCorrect = type === 'mcq'
      ? index === correct
      : given.trim().toLowerCase() === correct.toLowerCase();

    if (isCorrect) {
      this.sfx.correct.play();
      this.registry.values.podCharges = (this.registry.values.podCharges || 2) + 1;
    } else {
      this.sfx.wrong.play();
      this.wrongCount++;
    }

    const msg = isCorrect
      ? "Pod-096> CODE PATCHED — AmmunitionCharge +1"
      : "Pod-096> ERROR — Invalid input";

    this.optionTexts.forEach(t => { try { t.destroy(); } catch (e) {} });
    this.optionTexts = [];
    if (this.inputDom) { try { this.inputDom.destroy(); } catch (e) {} this.inputDom = null; }

    this.printLine("");
    this.typewriter(msg, 20, () => {
      if (!isCorrect) {
        let correctMsg;
        if (type === 'mcq') {
          const correctOpt = this.questions[this.currentIndex].options[correct];
          correctMsg = `Pod-096> Correct Answer: [${correct + 1}] ${correctOpt}`;
        } else {
          correctMsg = `Pod-096> Correct Answer: "${correct}"`;
        }

        this.typewriter(correctMsg, 20, () => {
          this.afterAnswerCheck();
        });
      } else {
        this.afterAnswerCheck();
      }
    });
  }

  afterAnswerCheck() {
    if (this.wrongCount > 4) {
      this.printLine("");
      this.typewriter("Pod-096> CRITICAL FAILURE — Too many invalid inputs. Restarting node patch sequence...", 25, () => {
        this.time.delayedCall(2000, () => {
          this.scene.restart({ level: this.level, skipInstruction: this.skipInstruction });
        });
      });
      return;
    }

    this.time.delayedCall(1100, () => {
      this.currentIndex++;
      this.showNextQuestion();
    });
  }

  completeQuiz() {
    this.printLine("");
    this.registry.values.podCharges = (this.registry.values.podCharges || 2);
    const msg = this.endMessages[this.level] || "Pod-042> All nodes patched. Returning to factory ruins...";

    this.typewriter(msg, 25, () => {
      this.time.delayedCall(2500, () => {
        if (this.skipInstruction) {
          this.scene.start('GameScene' + this.nextLevel, { level: this.nextLevel });
        } else {
          this.scene.start('InstructionScene', { level: this.nextLevel });
        }
      });
    });
  }
}
