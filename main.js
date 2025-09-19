//import { Start } from './scenes/Start.js';
import BootScene from "./src/scenes/bootScene.js";
import MenuScene from "./src/scenes/menu.js";
import GameScene from "./src/scenes/levelscene.js";

const config = {
    type: Phaser.AUTO,// phasor will uses webgl or canvas api
    title: 'Bootscene',
    description: '',
    parent: 'game-container',
    width: 800,
    height: 550,
    backgroundColor: '#000000',
    pixelArt: true,
     antialias: false,        //  blurry edges fix
    roundPixels: true,       
    physics: {
        default: 'arcade' ,
         arcade: {
        gravity: { y: 500 },
        debug: true
    }   
    },
    
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    // scene: [MenuScene,BootScene,GameScene] 
     scene: [GameScene] 
};

new Phaser.Game(config);
            