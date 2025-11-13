
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
    this.level = data.level || 1;
    this.nextLevel = data.nextLevel || this.level + 1;
    this.skipInstruction = data.skipInstruction || false; 

    this.questions = questionsPerLevel[this.level]; 
    this.currentIndex = 0;
    this.wrongCount = 0; // <-- track wrong answers

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

    this.storyTextObj = this.add.text(40, 40, '', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#00ff88ff',
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
        color: '#5e906eff'
      }).setInteractive({ useHandCursor: true });

      txt.on('pointerdown', () => {
        this.optionTexts.forEach(t => t.disableInteractive && t.disableInteractive());
        if (this.inputDom) { this.inputDom.destroy(); this.inputDom = null; }
        this.handleAnswer(opt, question.answer, question.type, index);
      });

      this.optionTexts.push(txt);
    });
  }

  showTextInput(question) {
    const inputX = 190;
    const inputY = this.lastQuestionY + 6;
    this.inputDom = this.add.dom(inputX, inputY, 'input', {
      width: '300px', fontSize: '18px', backgroundColor: '#000', color: '#3c6241ff', border: '1px solid #000000ff', padding: '3px'
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

  // clear options/input
  this.optionTexts.forEach(t => { try { t.destroy(); } catch (e) {} });
  this.optionTexts = [];
  if (this.inputDom) { try { this.inputDom.destroy(); } catch (e) {} this.inputDom = null; }

  this.printLine("");
  this.typewriter(msg, 20, () => {
    if (!isCorrect) {
      // 👇 show correct answer when player gets it wrong
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

// helper to continue flow
afterAnswerCheck() {
  // if too many wrongs
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
