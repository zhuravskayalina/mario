import { Howl } from 'howler';

import audioFireFlowerShot from '../audio/audioFireFlowerShot.mp3';
import audioCompleteLevel from '../audio/audioCompleteLevel.mp3';
import audioDescend from '../audio/audioDescend.mp3';
import audioLoseLife from '../audio/audioLoseLife.mp3';
import audioFireworkBurst from '../audio/audioFireworkBurst.mp3';
import audioFireworkWhistle from '../audio/audioFireworkWhistle.mp3';
import audioGameOver from '../audio/audioGameOver.mp3';
import audioJump from '../audio/audioJump.mp3';
import audioLosePowerUp from '../audio/audioLosePowerUp.mp3';
import audioObtainPowerUp from '../audio/audioWinLevel.mp3';
import audioGoombaSquash from '../audio/goombaSquash.mp3';
import audioMusicLevel1 from '../audio/audioMusicLevel1.mp3';
import audioDie from '../audio/audioDie.mp3';


export const audio = {
    fireFlowerShot: new Howl({
        src: [audioFireFlowerShot],
        volume: 0.1,

    }),
    completeLevel: new Howl({
        src: [audioCompleteLevel],
        volume: 0.1
    }),
    descend: new Howl({
        src: [audioDescend],
         volume: 0.1

    }),
    loseLife: new Howl({
        src: [audioLoseLife],
        volume: 0.1

    }),
    fireworkBurst: new Howl({
        src: [audioFireworkBurst],
        volume: 0.1

    }),
    fireworkWhistle: new Howl({
        src: [audioFireworkWhistle],
        volume: 0.1

    }),
    gameOver: new Howl({
        src: [audioGameOver],
        volume: 0.1

    }),
    jump: new Howl({
        src: [audioJump],
       volume: 0.1

    }),
    losePowerUp: new Howl({
        src: [audioLosePowerUp],
        volume: 0.1

    }),
    obtainPowerUp: new Howl({
        src: [audioObtainPowerUp],
        volume: 0.1

    }),
    goombaSquash: new Howl({
        src: [audioGoombaSquash],
        volume: 0.1

    }),
    musicLevel1: new Howl({
        src: [audioMusicLevel1],
        volume: 0.1,
        autoplay: true
    }),
    die: new Howl({
        src: [audioDie],
        volume: 0.1,
    }),
}
