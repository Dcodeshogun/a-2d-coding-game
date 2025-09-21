export const level1questions = [
  {
    id: 1,
    prompt: `Commander: Machine reinforcements incoming. Our system instantiates androids like this… but how many are created?\n\n` +
            `\`\`\`cpp\nclass Android {\npublic:\nAndroid() {std::cout << "Unit ready";}\n};\n\nint main() {\nAndroid a,b,c;\n}\n\`\`\``,
    options: [
      "Unit ready",
      "Unit ready Unit ready",
      "Unit ready Unit ready Unit ready",
      "Compilation error"
    ],
    answer: 2,
    reward: { type: "barrage", value: 1 }
  },
  {
    id: 2,
    prompt: `Pod scans a fallen unit: Access violation detected. What happens here?\n\n` +
            `\`\`\`cpp\nclass Machine {\nprivate:\nint core = 100;\n};\n\nint main() {\nMachine m;\nstd::cout << m.core;\n}\n\`\`\``,
    options: [
      "Prints 100",
      "Prints garbage",
      "Compilation error",
      "Runtime crash"
    ],
    answer: 2,
    reward: { type: "defense", value: 20 }
  },
  {
    id: 3,
    prompt: `Commander: Watch closely. Which output sequence does this attack log?\n\n` +
            `\`\`\`cpp\nclass Weapon {\npublic:\nWeapon() {std::cout<<"Forged"; }\n~Weapon() { std::cout<<"Destroyed";}\n};\n\nint main() {\nWeapon blade;\n}\n\`\`\``,
    options: [
      "Forged Destroyed",
      "Forged only",
      "Destroyed only",
      "Compilation error"
    ],
    answer: 0,
    reward: { type: "cooldown", value: -1 }
  },
  {
    id: 4,
    prompt: `Pod: Enemy type mismatched. What’s the output?\n\n` +
            `\`\`\`cpp\nclass Machine {\npublic:\nint power = 10;\n};\n\nclass Heavy : public Machine {\npublic:\n int power = 20;\n};\n\nint main() {\n    Heavy h;\n    Machine m = h;\n    std::cout << m.power;\n}\n\`\`\``,
    options: [
      "10",
      "20",
      "Undefined",
      "Compilation error"
    ],
    answer: 0,
    reward: { type: "crit", value: 1 }
  },
  {
    id: 5,
    prompt: `Commander:Some weapons belong to all androids, not just one. What’s the output?\n\n` +
            `\`\`\`cpp\nclass Pod {\npublic:\nstatic int ammo;\n};\n\nint Pod::ammo = 50;\n\nint main() {\n Pod a, b;\n  a.ammo = 75;\n std::cout << b.ammo;\n}\n\`\`\``,
    options: [
      "50",
      "75",
      "Garbage",
      "Compilation error"
    ],
    answer: 1,
    reward: { type: "barrage", value: "MAX" }
  }
];
