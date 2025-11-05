
import BootScene from "./src/scenes/bootScene.js";
import MenuScene from "./src/scenes/menu.js";
import GameScene from "./src/scenes/levelscene.js";
import GameScene2 from "./src/scenes/levelscene2.js";   
import InstructionScene from "./src/scenes/instructionScene.js";
import LangScene from "./src/scenes/langselect.js";
import QuizScene from "./src/scenes/quizscene.js";
import GameoverScene from "./src/scenes/gameoverScene.js";



const config = {
    type: Phaser.AUTO,// phasor will uses webgl or canvas api
    title: 'Bootscene',
    description: '',
    parent: 'game-container',
    width: 800,
    height: 550,
    backgroundColor: '#000000',
    pixelArt: true,
     antialias: true,        //  blurry edges fix
    roundPixels: true,       
    physics: {
        default: 'arcade' ,
         arcade: {
        gravity: { y: 500 },
        debug: false
    }   
    },
    
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [MenuScene,LangScene,QuizScene,GameoverScene,InstructionScene,BootScene,GameScene,GameScene2] 
    //scene: [GameScene2] //for debugging
    //scene: [QuizScene,InstructionScene,BootScene,GameScene] //for debugging
    //scene: [GameScene,GameScene2]
    //scene: [QuizScene] //for debugging
    //scene:[BootScene]
    
    //scene:[GameoverScene]
};

new Phaser.Game(config);
            