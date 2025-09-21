import {level1questions} from '../data/level1questions.js';  // default import

export default class QuizScene extends Phaser.Scene {
  constructor() {
    super({ key: 'QuizScene' });
    this.questions = [];
    this.currentIndex = 0;   // consistent name
    this.inputDom = null;
  }

  preload() {
    this.load.image('quizBg', 'src/ui/quiz-bg.png');
  }

  create(data = {}) {
    this.level = data.level || this.registry.get('currentLevel') || 1;

    const bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'quizBg');
    bg.setOrigin(0.5);

    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0)
      .setOrigin(0, 0);

    this.add.text(39, 24, `Level ${this.level} — OOP concept`, {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff'
    });

    this.storyFull = this.getIntroTextForLevel(this.level);
    this.storyTextObj = this.add.text(40, 60, '', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffffff',
      wordWrap: { width: this.cameras.main.width - 80 }
    });

    this.typewriter(this.storyFull, 30, () => {
      this.time.delayedCall(300, () => this.startQuestions());
    });

    this.qStartY = 160;
    this.qTextObj = null;
    this.optionTexts = [];

    this.add.text(40, this.cameras.main.height - 20,
      "Click answers with mouse. Snippet questions use input box.", {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#0xff0000'
      });
  }

  // ---------- Question flow ----------
  startQuestions() {
    this.questions = this.getQuestionsForLevel(this.level);
    console.log("Loaded questions:", this.questions); // DEBUG
    this.currentIndex = 0;
    this.showCurrentQuestion();
  }

  showCurrentQuestion() {
    // end of quiz
    if (this.currentIndex >= this.questions.length) {
      this.onQuizComplete();
      return;
    }

    // Clear old UI
    if (this.questionText) this.questionText.destroy();
    if (this.optionTexts) this.optionTexts.forEach(t => t.destroy());

    let q = this.questions[this.currentIndex];

    // Show "Q1/5"
    if (this.questionCounterText) this.questionCounterText.destroy();
    this.questionCounterText = this.add.text(58, 110, `Q${this.currentIndex + 1}/${this.questions.length}`, {
      fontSize: "18px",
      fill: "#fff"
    }).setOrigin(0.5);

    // Show the question text
    this.questionText = this.add.text(360, 250, q.prompt, {
      fontSize: "16px",
      fill: "#0x4c4940",
      wordWrap: { width: 700 }
    }).setOrigin(0.5);

    // Options 
    q.options.forEach((opt, index) => {
    let option = this.add.text(32, 370 + index * 19, `${index + 1}. ${opt}`, {
        fontSize: "16px",
        fill: "#0x4c4940"
    }).setOrigin(0.0);

    option.setInteractive({ useHandCursor: true });
    option.on("pointerdown", () => {
        this.handleAnswer(index === q.answer);
    });

    this.optionTexts.push(option);
    });
  }

  handleAnswer(correct) {
    this.showFeedback(correct);
  }

  showFeedback(correct) {
    const msg = correct ? 'Correct — Pod Barrage AmmunitionCharge +1' : 'Incorrect';
    const color = correct ? '#88ff88' : '#ff8888';

    const txt = this.add.text(this.cameras.main.centerX - 200, this.cameras.main.height-90, msg, {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: color
    });

    this.time.delayedCall(2000, () => {
      txt.destroy();
      this.currentIndex++;
      this.showCurrentQuestion();
    });
  }

  // ---------- end of quiz ----------
  onQuizComplete() {
    this.add.text(this.cameras.main.centerX - 160, this.cameras.main.height - 80,
      'All checks complete. Returning to factory ruins...', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffffff'
      });

    this.cameras.main.flash(250, 180, 200, 255);

    this.time.delayedCall(1400, () => {
      this.scene.start('InstructionScene', { levelCompleted: this.level });
    });
  }

  typewriter(text, speed = 40, onComplete = null) {
    let i = 0;
    this.storyTextObj.setText('');
    const ev = this.time.addEvent({
      delay: speed,
      callback: () => {
        this.storyTextObj.text += text[i] || '';
        i++;
        if (i >= text.length) {
          ev.remove(false);
          if (onComplete) onComplete();
        }
      },
      repeat: text.length - 1
    });

    this.input.once('pointerdown', () => {
      ev.remove(false);
      this.storyTextObj.setText(text);
      if (onComplete) onComplete();
    });
  }

  getIntroTextForLevel(level) {
    const map = {
      1: "Pod-042: Corrupted class definitions detected.\n2B: Patch the declarations — restore structure.",
      2: "Pod-042: Encapsulation breach found. Seal internal states.",
      3: "Pod-042: Inheritance chains broken. Reconnect derived behaviors.",
      4: "Pod-042: Polymorphic dispatch corrupted. Restore virtual overrides."
    };
    return map[level] || "Pod-042: Unknown corruption. Solve these queries to stabilize the node.";
  }

  getQuestionsForLevel(level) {
    if (level === 1) return level1questions;

    const pools = {
      2: [
        {
          type: 'mcq',
          prompt: "Why make data members private?",
          options: ['Faster code', 'Prevent external modification', 'Easier debugging', 'No reason'],
          answer: 1
        }
      ]
    };
    return pools[level] || [];
  }
}
