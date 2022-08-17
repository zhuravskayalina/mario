import gsap from 'gsap';

spa();

import {
  createImage,
  createImageAsync,
  isOnTopOfPlatform,
  collisionTop,
  isOnTopOfPlatformCircle,
  hitBottomOfPlatform,
  hitSideOfPlatform,
  isObjectsTouch
} from './utils.js';

import platform from '../img/platform.png';
import hills from '../img/hills.png';
import background from '../img/background.png';
import platformSmallTall from '../img/platformSmallTall.png';
import block from '../img/block.png';
import blockTri from '../img/blockTri.png';
import mdPlatform from '../img/mdPlatform.png';
import lgPlatform from '../img/lgPlatform.png';
import tPlatform from '../img/tPlatform.png';
import xtPlatform from '../img/xtPlatform.png';
import flagPoleSprite from '../img/flagPole.png';

import spriteMarioRunLeft from '../img/spriteMarioRunLeft.png';
import spriteMarioRunRight from '../img/spriteMarioRunRight.png';
import spriteMarioStandLeft from '../img/spriteMarioStandLeft.png';
import spriteMarioStandRight from '../img/spriteMarioStandRight.png';
import spriteMarioJumpRight from '../img/spriteMarioJumpRight.png';
import spriteMarioJumpLeft from '../img/spriteMarioJumpLeft.png';

import spriteFireFlowerRunLeft from '../img/spriteFireFlowerRunLeft.png';
import spriteFireFlowerRunRight from '../img/spriteFireFlowerRunRight.png';
import spriteFireFlowerStandLeft from '../img/spriteFireFlowerStandLeft.png';
import spriteFireFlowerStandRight from '../img/spriteFireFlowerStandRight.png';
import spriteFireFlowerJumpRight from '../img/spriteFireFlowerJumpRight.png';
import spriteFireFlowerJumpLeft from '../img/spriteFireFlowerJumpLeft.png';

import spriteFireFlower from '../img/spriteFireFlower.png';

import spriteGoomba from '../img/spriteGoomba.png';

import { audio } from './audio.js';

import { images } from './images.js';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

const modalNewGame = document.querySelector('.new-game-modal');

const points = modalNewGame.querySelector('.points');
const newGameButton = modalNewGame.querySelector('.new-game-button');

let gravity = 1.5;

class Player {
  constructor() {
    this.shooting = false;

    this.speed = 10;

    this.name = '';

    this.position = {
      x: 100,
      y: 100
    };

    this.velocity = {
      x: 0,
      y: 0
    }

    this.scale = 0.3;
    this.width = 398 * this.scale;
    this.height = 353 * this.scale;
    this.frames = 0; // what frame are we currently on of 28
    this.image = createImage(spriteMarioStandRight);
    this.sprites = {
      stand: {
        right: createImage(spriteMarioStandRight),
        left: createImage(spriteMarioStandLeft),
        fireFlower: {
          right: createImage(spriteFireFlowerStandRight),
          left: createImage(spriteFireFlowerStandLeft),
        },
      },
      run: {
        right: createImage(spriteMarioRunRight),
        left: createImage(spriteMarioRunLeft),
        fireFlower: {
          right: createImage(spriteFireFlowerRunRight),
          left: createImage(spriteFireFlowerRunLeft),
        },
      },
      jump: {
        right: createImage(spriteMarioJumpRight),
        left: createImage(spriteMarioJumpLeft),
        fireFlower: {
          right: createImage(spriteFireFlowerJumpRight),
          left: createImage(spriteFireFlowerJumpLeft),
        },
      },
      shoot: {
        fireFlower: {
          right: createImage(images.mario.shoot.fireFlower.right),
          left: createImage(images.mario.shoot.fireFlower.left),
        }
      }
    };

    this.currentSprite = this.sprites.stand.right;
    this.currentCropWith = 398;
    this.powerUps = {
      fireFlower: false
    };

    this.invincible = false;
    this.opacity = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = 'rgba(0, 0, 0, 0)'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
    c.fillStyle = 'red'
    c.drawImage(this.currentSprite,
      this.currentCropWith * this.frames,
      0, this.currentCropWith,
      353,
      this.position.x,
      this.position.y,
      this.width,
      this.height);
    c.restore();
  };

  update() {
    this.frames++;
    const { currentSprite, sprites } = this;

    //reset frames when the sprite ends or need to change
    if (this.frames > 58 && (currentSprite === sprites.stand.right || currentSprite === sprites.stand.left
      || currentSprite === sprites.stand.fireFlower.right || currentSprite === sprites.stand.fireFlower.left)) {
      this.frames = 0;
    } else if (this.frames > 28 && (currentSprite === sprites.run.right || currentSprite === sprites.run.left
      || currentSprite === sprites.run.fireFlower.right || currentSprite === sprites.run.fireFlower.left)) {
      this.frames = 0;
    } else if (currentSprite === sprites.jump.right ||
      currentSprite === sprites.jump.left ||
      currentSprite === sprites.jump.fireFlower.right ||
      currentSprite === sprites.jump.fireFlower.left ||
      currentSprite === sprites.shoot.fireFlower.left ||
      currentSprite === sprites.shoot.fireFlower.right) {
      this.frames = 0;
    }


    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    };

    if (this.invincible) {
      if (this.opacity === 1) {
        this.opacity = 0;
      } else {
        this.opacity = 1;
      }
    } else {
      this.opacity = 1;
    }
  };
};

class Platform {
  constructor({ x, y, image, block, text }) {
    this.position = {
      x: x,
      y: y
    };

    this.velocity = {
      x: 0
    };

    this.image = image;
    this.width = image.width;
    this.height = image.height;
    this.block = block;
    this.text = text;
  };

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);

    if (this.text) {
      c.font = '20px Arial';
      c.fillStyle = 'red';
      c.fillText(this.text, this.position.x, this.position.y);
    }
  };

  update() {
    this.draw();
    this.position.x += this.velocity.x;

  };
};

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x: x,
      y: y
    };

    this.velocity = {
      x: 0
    };

    this.image = image;

    this.width = image.width;
    this.height = image.height;
  };

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  };

  update() {
    this.draw();
    this.position.x += this.velocity.x;

  };
};

class Goomba {
  constructor({ position, velocity, distance = { limit: 50, traveled: 0 } }) {
    this.position = {
      x: position.x,
      y: position.y
    };

    this.velocity = {
      x: velocity.x,
      y: velocity.y
    };

    this.width = 43.33;
    this.height = 50;
    this.image = createImage(spriteGoomba);
    this.frames = 0;

    this.distance = distance;
  };

  draw() {
    c.drawImage(
      this.image,
      130 * this.frames,
      0,
      130,
      150,
      this.position.x,
      this.position.y,
      this.width,
      this.height);
  };

  update() {
    this.frames++;
    if (this.frames >= 58) {
      this.frames = 0;
    }
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    };

    // walk the goomba back and forth

    this.distance.traveled += Math.abs(this.velocity.x);

    if (this.distance.traveled > this.distance.limit) {
      this.distance.traveled = 0;
      this.velocity.x = -this.velocity.x;
    }
  }

};

class Particle {
  constructor({ position, velocity, radius, color = '#422f1f', fireball = false, fades = false }) {
    this.position = {
      x: position.x,
      y: position.y
    };

    this.velocity = {
      x: velocity.x,
      y: velocity.y
    };

    this.radius = radius;
    this.timeToLive = 300; //frames
    this.color = color;
    this.fireball = fireball;
    this.opacity = 1;
    this.fades = fades
  };

  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  };

  update() {
    this.timeToLive--;
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.radius + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity * 0.5;
    };

    if (this.fades && this.opacity > 0) {
      this.opacity -= 0.01;
    };

    if (this.opacity < 0) {
      this.opacity = 0;
    };
  }
};

class FireFlower {
  constructor({ position, velocity }) {
    this.position = {
      x: position.x,
      y: position.y
    };

    this.velocity = {
      x: velocity.x,
      y: velocity.y
    };

    this.width = 56;
    this.height = 60;
    this.image = createImage(spriteFireFlower);
    this.frames = 0;
  };

  draw() {
    c.drawImage(
      this.image,
      56 * this.frames,
      0,
      56,
      60,
      this.position.x,
      this.position.y,
      this.width,
      this.height);
  };

  update() {
    this.frames++;
    if (this.frames >= 75) {
      this.frames = 0;
    }
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    };
  }
};

class Message {
  constructor({ position, text }) {
    this.position = {
      x: position.x,
      y: position.y
    }

    this.text = text;
  }

  draw() {
    c.font = "30px 'Press Start 2P'";
    c.fillStyle = "white";
    c.fillText("PAUSE", this.position.x, this.position.y);
  }
};

let platformImage;
let platformSmallTallImage;
let blockTriImage;
let lgPlatformImage;
let mdPlatformImage;
let tPlatformImage;
let xtPlatformImage;
let blockImage;
let flagPoleImage;

let player = new Player();
let platforms = [];
let genericObjects = [];
let goombas = [];
let particles = [];
let fireFlowers = [];
let messages = [];

//cheking if the main keys is pressed for animation
let defaultDirection;
let lastKey;
let keys;

let scrollOffset; // how far the player has gone

let flagPole;

let game = {
  disableUserInput: true
};

let currentLevel = 1;

let score = 0;

let isPause = false;

function drawLevelAndScore() {
  c.font = "16px 'Press Start 2P'";
  c.fillStyle = "white";
  c.fillText("SCORE: " + score, 10, 25);
  c.fillText("LEVEL: " + currentLevel, 885, 25);
};

function drawWinGame() {
  c.font = "60px 'Press Start 2P'";
  c.fillStyle = "#e9df3c";
  c.fillText("GAME OVER!" , 240, 230);
  c.strokeStyle = "#22c33c";
  c.strokeText("GAME OVER!" , 240, 230);
  c.fillStyle = "#22c33c";
  c.fillText("YOU'RE WIN!!!" , 150, 330);
  c.strokeStyle = "#e9df3c";
  c.strokeText("YOU'RE WIN!!!" , 150, 330);


}

async function selectLevel(currentLevel) {
  gravity = 0;

  player.position = {
    x: 100,
    y: 100
  };

  if (!audio.musicLevel1.playing()) audio.musicLevel1.play();
  switch (currentLevel) {
    case 1:
      await init();
      break;
    case 2:
      await initLevel2();
      break;
    case 3:
      await initLevel3();
      break;
    case 4:
      await initLevel4();
      break;
    case 5:
      await initLevel5();
      break;
  };

  gravity = 1.5;

};

function gameOver() {
  audio.die.play();

  saveScore(score);
  points.innerHTML = score;
  cancelAnimationFrame(animationId);
  points.textContent = score;
  score = 0;
  modalNewGame.style.display = 'flex';
};

// data base code // ajax // database

const dbName = 'Zhuravskaya';
const password = 'privet';

async function saveScore(score) {
  const ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";

  let bestScores = await getBestScores('LOCKGET');

  if (bestScores.error) {
    bestScores = await getBestScores('READ');
  };

  const bestScoresParsed = bestScores.result ? JSON.parse(bestScores.result) : [];
  //console.log(bestScoresParsed);
  const playerRecord = bestScoresParsed?.find(item => item.playerName === player.name);

  if (!playerRecord || playerRecord.score < score) {
    let updatedBestScores = bestScoresParsed;
    if (playerRecord) {
      playerRecord.score = score;
    } else {
      updatedBestScores.push({
        playerName: player.name,
        score
      })
    };

    $.ajax({
      url: ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
      data: {
        f: 'UPDATE', n: dbName, v: JSON.stringify(updatedBestScores), p: password
      },
      success: saveScoreSuccess, error: errorHandler
    }
    );
  };
};

function saveScoreSuccess() {
 // console.log('data saved');
};

function errorHandler() {
 // console.log('error')
};

async function getBestScores(method) {
  const ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";

  return $.ajax({
    url: ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
    data: { f: method, n: dbName, p: password },
    //success: getBestScoreSuccess, error: errorHandler
  }
  );
};

function getBestScoreSuccess(result) {
  if (result.error != undefined)
    alert(result.error);
 // console.log(result);
};



async function init() { //----------------------------------------------------------------------init level 1  func---------------------------------
  game = {
    disableUserInput: false,
  };

  player.position = {
    x: 100,
    y: 100
  };

  currentLevel = 1;

  defaultDirection = 'right';

  keys = {
    right: {
      pressed: false
    },
    left: {
      pressed: false
    }
  };

  scrollOffset = 0;

  platformImage = await createImageAsync(platform);
  platformSmallTallImage = await createImageAsync(platformSmallTall);
  blockImage = await createImageAsync(block);
  blockTriImage = await createImageAsync(blockTri);
  lgPlatformImage = await createImageAsync(lgPlatform);
  mdPlatformImage = await createImageAsync(mdPlatform);
  tPlatformImage = await createImageAsync(tPlatform);
  xtPlatformImage = await createImageAsync(xtPlatform);
  flagPoleImage = await createImageAsync(flagPoleSprite);


  flagPole = new GenericObject({
    x: 6864 + 600,
    //x: 500,
    y: canvas.height - lgPlatformImage.height - flagPoleImage.height,
    image: flagPoleImage,
  })

  fireFlowers = [new FireFlower({
    position: {
      x: 400,
      y: 100
    },
    velocity: {
      x: 0,
      y: 0
    }
  }),]

  //player = new Player();

  const goombaWidth = 43.33;

  goombas = [new Goomba({
    position: {
      x: 908 + lgPlatformImage.width - goombaWidth,
      y: 100
    }, velocity: {
      x: -0.3,
      y: 0
    },
    distance: {
      limit: 400,
      traveled: 0
    }
  }), new Goomba({
    position: {
      x: 3249 + lgPlatformImage.width - goombaWidth,
      y: 100
    }, velocity: {
      x: -0.3,
      y: 0
    },
    distance: {
      limit: 400,
      traveled: 0
    }
  }), new Goomba({
    position: {
      x: 3249 + lgPlatformImage.width - goombaWidth * 2,
      y: 100
    }, velocity: {
      x: -0.3,
      y: 0
    },
    distance: {
      limit: 400,
      traveled: 0
    }
  }), new Goomba({
    position: {
      x: 3249 + lgPlatformImage.width - goombaWidth * 3,
      y: 100
    }, velocity: {
      x: -0.3,
      y: 0
    },
    distance: {
      limit: 400,
      traveled: 0
    }
  }), new Goomba({
    position: {
      x: 3249 + lgPlatformImage.width - goombaWidth * 4,
      y: 100
    }, velocity: {
      x: -0.3,
      y: 0
    },
    distance: {
      limit: 400,
      traveled: 0
    }
  }), new Goomba({
    position: {
      x: 5135 + xtPlatformImage.width / 2 + goombaWidth,
      y: 100
    }, velocity: {
      x: -0.3,
      y: 0
    },
    distance: {
      limit: 100,
      traveled: 0
    }
  }), new Goomba({
    position: {
      x: 6964,
      y: 0
    }, velocity: {
      x: -0.3,
      y: 0
    },
    distance: {
      limit: 100,
      traveled: 0
    }
  }),
  ];

  particles = [];

  platforms = [
    new Platform({
      x: 908 + 100,
      y: 300,
      image: blockTriImage,
      block: true
    }),
    new Platform({
      x: 908 + 100 + blockImage.width,
      y: 100,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 1989 + lgPlatformImage.width - tPlatformImage.width,
      y: canvas.height - lgPlatformImage.height - tPlatformImage.height,
      image: tPlatformImage,
      block: true
    }),
    new Platform({
      x: 1989 + lgPlatformImage.width - tPlatformImage.width - 100,
      y: canvas.height - lgPlatformImage.height - tPlatformImage.height + blockImage.height,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 5714 + xtPlatformImage.width + 175,
      y: canvas.height - xtPlatformImage.height,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 6114 + 175,
      y: canvas.height - xtPlatformImage.height,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 6114 + 175 * 2,
      y: canvas.height - xtPlatformImage.height,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 6114 + 175 * 3,
      y: canvas.height - xtPlatformImage.height - 500,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 6012 + 175 * 4,
      y: canvas.height - xtPlatformImage.height - 100,
      image: blockTriImage,
      block: true,
    }),
    new Platform({
      x: 6012 + 175 * 4 + blockTriImage.width,
      y: canvas.height - xtPlatformImage.height - 100,
      image: blockTriImage,
      block: true,
    }),
    new Platform({
      x: 6864 + 300,
      y: canvas.height - lgPlatformImage.height,
      image: lgPlatformImage,
      block: false,
    }),
  ];

  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: await createImageAsync(background)
    }),
    new GenericObject({
      x: -1,
      y: -1,
      image: await createImageAsync(hills)
    }),
    new GenericObject({
      x: 0,
      y: 0,
      image: await createImageAsync(images.levels[1].seaweeds)
    }),
  ];

  scrollOffset = 0;

  const platformsMap = ['lg', 'lg', 'gap', 'lg', 'gap', 'gap', 'lg', 'gap', 't', 'gap', 'xt', 'gap', 'xt', 'gap', 'gap', 'xt'];
  let platformDistance = 0;

  platformsMap.forEach(symbol => {
    switch (symbol) {
      case 'lg':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - lgPlatformImage.height,
          image: lgPlatformImage,
          block: true,
        }));
        platformDistance += lgPlatformImage.width;
        break;
      case 'gap':
        platformDistance += 175;
        break;
      case 't':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - tPlatformImage.height,
          image: tPlatformImage,
          block: true,
        }));
        platformDistance += tPlatformImage.width;
        break;
      case 'xt':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - xtPlatformImage.height,
          image: xtPlatformImage,
          block: true,
        }));
        platformDistance += xtPlatformImage.width;
        break;
    };
  });

};

async function initLevel2() { //-------------------------------------------------------------------init level 2 func---------------------------------
  player.position = {
    x: 100,
    y: 100
  };

  currentLevel = 2;

  defaultDirection = 'right'

  keys = {
    right: {
      pressed: false
    },
    left: {
      pressed: false
    }
  };

  game = {
    disableUserInput: false,
  };
  blockImage = await createImageAsync(block);
  blockTriImage = await createImageAsync(blockTri);
  lgPlatformImage = await createImageAsync(images.levels[2].lgPlatform);
  mdPlatformImage = await createImageAsync(images.levels[2].mdPlatform);
  flagPoleImage = await createImageAsync(flagPoleSprite);
  const mountains = await createImageAsync(images.levels[2].mountains);
  const sun = await createImageAsync(images.levels[2].sun);

  flagPole = new GenericObject({
    x: 7850,
    y: canvas.height - lgPlatformImage.height - flagPoleImage.height,
    image: flagPoleImage,
  })

  fireFlowers = [
    new FireFlower({
      position: {
        x: 3213 - 13,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      }
    })
  ];

  //player = new Player();

  const goombaWidth = 43.33;

  goombas = [
    new Goomba({
      position: {
        x: 903 + mdPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -2,
        y: 0
      },
      distance: {
        limit: 700,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 1879 + lgPlatformImage.width / 2,
        y: 100
      },
      velocity: {
        x: -2,
        y: 0
      },
      distance: {
        limit: 300,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 3650,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      },
      distance: {
        limit: 0,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 3832 + lgPlatformImage.width / 2 - goombaWidth,
        y: 100
      },
      velocity: {
        x: -1,
        y: 0
      },
      distance: {
        limit: 400,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 4284 + mdPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -1,
        y: 0
      },
      distance: {
        limit: mdPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 4735 + lgPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -1,
        y: 0
      },
      distance: {
        limit: 500,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 4735 + lgPlatformImage.width - goombaWidth * 2,
        y: 100
      },
      velocity: {
        x: -1,
        y: 0
      },
      distance: {
        limit: 500,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 4735 + lgPlatformImage.width - goombaWidth * 3,
        y: 100
      },
      velocity: {
        x: -1,
        y: 0
      },
      distance: {
        limit: 500,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 5988 + mdPlatformImage.width - goombaWidth,
        y: canvas.height - mdPlatformImage.height * 2
      },
      velocity: {
        x: -2,
        y: 0
      },
      distance: {
        limit: mdPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 6789 + mdPlatformImage.width - goombaWidth,
        y: canvas.height - mdPlatformImage.height * 3,
      },
      velocity: {
        x: -2,
        y: 0
      },
      distance: {
        limit: mdPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),

  ];

  particles = [];

  platforms = [
    new Platform({
      x: 903 + mdPlatformImage.width + 115,
      y: 300,
      image: blockTriImage,
      block: true,
    }),
    new Platform({
      x: 1469 + blockTriImage.width,
      y: 300,
      image: blockTriImage,
      block: true
    }),
    new Platform({
      x: 1879 + lgPlatformImage.width + 180,
      y: 350,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 2962 + blockImage.width + 190,
      y: 300,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 2962 + blockImage.width + 190,
      y: 300,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 3213 + blockImage.width + 170,
      y: 350,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 3464 + blockImage.width + 135,
      y: 320,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 3464 + blockImage.width + 135,
      y: 320,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 3832 + lgPlatformImage.width / 2,
      y: canvas.height - lgPlatformImage.height - mdPlatformImage.height,
      image: mdPlatformImage,
    }),

    new Platform({
      x: 5988,
      y: canvas.height - mdPlatformImage.height * 2,
      image: mdPlatformImage,
    }),
    new Platform({
      x: 5988,
      y: canvas.height - mdPlatformImage.height * 3,
      image: mdPlatformImage,
    }),
    new Platform({
      x: 6789,
      y: canvas.height - mdPlatformImage.height * 2,
      image: mdPlatformImage,
    }),
    new Platform({
      x: 6789,
      y: canvas.height - mdPlatformImage.height * 3,
      image: mdPlatformImage,
    }),
  ];

  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(images.levels[2].background)
    }),
    new GenericObject({
      x: 600,
      y: 200,
      image: sun
    }),
    new GenericObject({
      x: -1,
      y: canvas.height - mountains.height,
      image: mountains
    })];


  scrollOffset = 0;

  const platformsMap = [
    'lg',
    'md',
    'gap',
    'gap',
    'gap',
    'lg',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'lg',
    'lg',
    'gap',
    'gap',
    'md',
    'gap',
    'gap',
    'md',
    'gap',
    'gap',
    'lg',
  ];


  let platformDistance = 0;

  platformsMap.forEach(symbol => {
    switch (symbol) {
      case 'md':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - mdPlatformImage.height,
          image: mdPlatformImage,
          block: true,
        }));
        platformDistance += mdPlatformImage.width;
        break;

      case 'lg':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - lgPlatformImage.height,
          image: lgPlatformImage,
          block: true,
        }));
        platformDistance += lgPlatformImage.width;
        break;

      case 'gap':
        platformDistance += 175;
        break;
    };
  });
};

async function initLevel3() { //---------------------------------------------------------------------init level 3 func---------------------------------

  currentLevel = 3;

  defaultDirection = 'right'

  keys = {
    right: {
      pressed: false
    },
    left: {
      pressed: false
    }
  };

  game = {
    disableUserInput: false,
  };

  blockImage = await createImageAsync(block);
  blockTriImage = await createImageAsync(blockTri);
  lgPlatformImage = await createImageAsync(images.levels[3].lgPlatform);
  mdPlatformImage = await createImageAsync(images.levels[3].mdPlatform);
  tPlatformImage = await createImageAsync(images.levels[3].tPltaform);
  xtPlatformImage = await createImageAsync(images.levels[3].xtPltaform);
  flagPoleImage = await createImageAsync(flagPoleSprite);
  const mountains = await createImageAsync(images.levels[3].mountains);
  const sun = await createImageAsync(images.levels[3].sun);

  flagPole = new GenericObject({
    x: 6831 + 300,
    y: canvas.height - lgPlatformImage.height - flagPoleImage.height,
    image: flagPoleImage,
  })

  fireFlowers = [
    new FireFlower({
      position: {
        x: 1050,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      }
    }),
    new FireFlower({
      position: {
        x: 3045 + blockTriImage.width / 2 - 30,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      }
    }),
  ];

  const goombaWidth = 43.33;

  goombas = [
    new Goomba({
      position: {
        x: 629 - 175 - goombaWidth,
        y: 100
      },
      velocity: {
        x: -1,
        y: 0
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 829,
        y: 100
      },
      velocity: {
        x: -1,
        y: 0
      },
      distance: {
        limit: 120,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 1536 + tPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -2,
        y: 0
      },
      distance: {
        limit: tPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 1763 + xtPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -2,
        y: 0
      },
      distance: {
        limit: xtPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 2164 + mdPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -2,
        y: 0
      },
      distance: {
        limit: mdPlatformImage.width - goombaWidth * 3,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 2164 + mdPlatformImage.width - goombaWidth * 2,
        y: 100
      },
      velocity: {
        x: -2,
        y: 0
      },
      distance: {
        limit: mdPlatformImage.width - goombaWidth * 3,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 2164 + mdPlatformImage.width - goombaWidth * 3,
        y: 100
      },
      velocity: {
        x: -2,
        y: 0
      },
      distance: {
        limit: mdPlatformImage.width - goombaWidth * 3,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 3397 + blockTriImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -2,
        y: 0
      },
      distance: {
        limit: blockTriImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 4603,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      },
      distance: {
        limit: 0,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 4945 + lgPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -4,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth * 3,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 4945 + lgPlatformImage.width - goombaWidth * 2,
        y: 100
      },
      velocity: {
        x: -4,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth * 3,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 4945 + lgPlatformImage.width - goombaWidth * 3,
        y: 100
      },
      velocity: {
        x: -4,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth * 3,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 6021 + mdPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -4,
        y: 0
      },
      distance: {
        limit: mdPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
  ];

  particles = [];

  platforms = [
    new Platform({
      x: 629 + 200,
      y: 300,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 1050,
      y: 250,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 1300,
      y: 310,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 2618 + tPlatformImage.width + 200,
      y: 310,
      image: blockTriImage,
      block: true,
    }),
    new Platform({
      x: 3045 + blockTriImage.width + 200,
      y: 310,
      image: blockTriImage,
      block: true,
    }),
    new Platform({
      x: 3397 + blockTriImage.width + 200,
      y: 310,
      image: blockTriImage,
      block: true,
    }),
    new Platform({
      x: 3749 + blockTriImage.width + 200,
      y: 270,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 4101 + blockImage.width + 200,
      y: 240,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 4352 + blockImage.width + 200,
      y: 240,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 4603 + blockImage.width + 200,
      y: 300,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 6027,
      y: canvas.height - mdPlatformImage.height * 2,
      image: mdPlatformImage,
    }),
    new Platform({
      x: 6027,
      y: canvas.height - mdPlatformImage.height * 3,
      image: mdPlatformImage,
    }),
  ];

  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(images.levels[3].background)
    }),
    new GenericObject({
      x: 600,
      y: 200,
      image: sun
    }),
    new GenericObject({
      x: -1,
      y: canvas.height - mountains.height,
      image: mountains
    })];


  scrollOffset = 0;

  const platformsMap = [
    'md',
    'gap',
    'lg',
    't',
    'xt',
    'gap',
    'md',
    't',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'lg',
    'gap',
    'md',
    'gap',
    'gap',
    'lg'
  ];


  let platformDistance = 0;

  platformsMap.forEach(symbol => {
    switch (symbol) {
      case 't':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - tPlatformImage.height,
          image: tPlatformImage,
          block: true
        }));
        platformDistance += tPlatformImage.width;
        break;
      case 'xt':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - xtPlatformImage.height,
          image: xtPlatformImage,
          block: true

        }));
        platformDistance += xtPlatformImage.width;
        break;
      case 'md':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - mdPlatformImage.height,
          image: mdPlatformImage,
        }));
        platformDistance += mdPlatformImage.width;
        break;

      case 'lg':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - lgPlatformImage.height,
          image: lgPlatformImage,
        }));
        platformDistance += lgPlatformImage.width;
        break;

      case 'gap':
        platformDistance += 175;
        break;
    };
  });
};

async function initLevel4() { //---------------------------------------------------------------------init level 4 func---------------------------------

  currentLevel = 4;

  defaultDirection = 'right'

  keys = {
    right: {
      pressed: false
    },
    left: {
      pressed: false
    }
  };

  game = {
    disableUserInput: false,
  };

  blockImage = await createImageAsync(block);
  blockTriImage = await createImageAsync(blockTri);
  lgPlatformImage = await createImageAsync(images.levels[4].lgPlatform);
  mdPlatformImage = await createImageAsync(images.levels[4].mdPlatform);
  tPlatformImage = await createImageAsync(images.levels[4].tPltaform);
  xtPlatformImage = await createImageAsync(images.levels[4].xtPltaform);
  flagPoleImage = await createImageAsync(flagPoleSprite);
  const mountains = await createImageAsync(images.levels[4].mountains);

  flagPole = new GenericObject({
    x: 8962,
    y: canvas.height - lgPlatformImage.height - flagPoleImage.height,
    image: flagPoleImage,
  })

  fireFlowers = [
    new FireFlower({
      position: {
        x: 15,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      }
    }),
    new FireFlower({
      position: {
        x: 2643,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      }
    }),
    new FireFlower({
      position: {
        x: 4580,
        y: canvas.height - tPlatformImage.height - 100
      },
      velocity: {
        x: 0,
        y: 0
      }
    }),
    new FireFlower({
      position: {
        x: 6151 + 88,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      }
    }),

  ];

  const goombaWidth = 43.33;

  goombas = [
    new Goomba({
      position: {
        x: 402 + tPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -3,
        y: 0
      },
      distance: {
        limit: tPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 829 + blockTriImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -2,
        y: 0
      },
      distance: {
        limit: blockTriImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 1154 + mdPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -3,
        y: 0
      },
      distance: {
        limit: mdPlatformImage.width - goombaWidth * 3,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 1154 + mdPlatformImage.width - goombaWidth * 2,
        y: 100
      },
      velocity: {
        x: -3,
        y: 0
      },
      distance: {
        limit: mdPlatformImage.width - goombaWidth * 3,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 1154 + mdPlatformImage.width - goombaWidth * 3,
        y: 100
      },
      velocity: {
        x: -3,
        y: 0
      },
      distance: {
        limit: mdPlatformImage.width - goombaWidth * 3,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 2341 + blockTriImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -2,
        y: 0
      },
      distance: {
        limit: blockTriImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 2844 + blockImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      },
      distance: {
        limit: blockTriImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 3008 + lgPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -4,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth * 3,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 3008 + lgPlatformImage.width - goombaWidth * 2,
        y: 100
      },
      velocity: {
        x: -4,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth * 3,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 3008 + lgPlatformImage.width - goombaWidth * 3,
        y: 100
      },
      velocity: {
        x: -3,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth * 3,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 4494 + tPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -3,
        y: 0
      },
      distance: {
        limit: tPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 4894 + mdPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -3,
        y: 0
      },
      distance: {
        limit: mdPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 4894 + mdPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -2,
        y: 0
      },
      distance: {
        limit: mdPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 5698 + lgPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -4,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 6780 + lgPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -4,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 6780 + lgPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -2,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 6780 + lgPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -3,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 6780 + lgPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -2,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 8239 + blockTriImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -2,
        y: 0
      },
      distance: {
        limit: blockTriImage.width - goombaWidth,
        traveled: 0
      }
    }),
  ];

  particles = [];

  platforms = [
    new Platform({
      x: 402 + tPlatformImage.width + 200,
      y: 300,
      image: blockTriImage,
      block: true,
    }),
    new Platform({
      x: 1134 + mdPlatformImage.width + 150,
      y: 350,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 1738 + blockImage.width + 150,
      y: 280,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 1939 + blockImage.width + 150,
      y: 210,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 2140 + blockImage.width + 150,
      y: 140,
      image: blockTriImage,
      block: true,
    }),
    new Platform({
      x: 2341 + blockTriImage.width + 150,
      y: 210,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 2643 + blockImage.width + 150,
      y: 280,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 4492,
      y: canvas.height - tPlatformImage.height - tPlatformImage.height,
      image: tPlatformImage,
    }),
    new Platform({
      x: 5698 + lgPlatformImage.width - xtPlatformImage.width - tPlatformImage.width,
      y: canvas.height - lgPlatformImage.height - xtPlatformImage.height,
      image: xtPlatformImage,
    }),
    new Platform({
      x: 6151 + xtPlatformImage.width,
      y: canvas.height - lgPlatformImage.height - tPlatformImage.height,
      image: tPlatformImage,
    }),
    new Platform({
      x: 6780,
      y: canvas.height - lgPlatformImage.height - lgPlatformImage.height,
      image: lgPlatformImage,
    }),
    new Platform({
      x: 6780 + lgPlatformImage.width + 200,
      y: 300,
      image: blockTriImage,
    }),
    new Platform({
      x: 7887 + blockTriImage.width + 200,
      y: 200,
      image: blockTriImage,
    }),
  ];

  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(images.levels[4].background)
    }),
    new GenericObject({
      x: 1800,
      y: 110,
      image: createImage(images.levels[4].sun)
    }),
    new GenericObject({
      x: -1,
      y: canvas.height - mountains.height,
      image: mountains
    }),
  ];



  scrollOffset = 0;

  const platformsMap = [
    'xt',
    'gap',
    't',
    'gap',
    'gap',
    'gap',
    'md',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'lg',
    'gap',
    'xt',
    'gap',
    't',
    'gap',
    'md',
    'gap',
    'gap',
    'lg',
    'gap',
    'lg',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'lg'
  ];


  let platformDistance = 0;

  platformsMap.forEach(symbol => {
    switch (symbol) {
      case 't':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - tPlatformImage.height,
          image: tPlatformImage,
          block: true
        }));
        platformDistance += tPlatformImage.width;
        break;
      case 'xt':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - xtPlatformImage.height,
          image: xtPlatformImage,
          block: true

        }));
        platformDistance += xtPlatformImage.width;
        break;
      case 'md':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - mdPlatformImage.height,
          image: mdPlatformImage,
        }));
        platformDistance += mdPlatformImage.width;
        break;

      case 'lg':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - lgPlatformImage.height,
          image: lgPlatformImage,
        }));
        platformDistance += lgPlatformImage.width;
        break;

      case 'gap':
        platformDistance += 175;
        break;
    };
  });
};

async function initLevel5() { //---------------------------------------------------------------------init level 5 func---------------------------------

  currentLevel = 5;

  defaultDirection = 'right'

  keys = {
    right: {
      pressed: false
    },
    left: {
      pressed: false
    }
  };

  game = {
    disableUserInput: false,
  };

  blockImage = await createImageAsync(block);
  blockTriImage = await createImageAsync(blockTri);
  lgPlatformImage = await createImageAsync(images.levels[5].lgPlatform);
  mdPlatformImage = await createImageAsync(images.levels[5].mdPlatform);
  tPlatformImage = await createImageAsync(images.levels[5].tPltaform);
  xtPlatformImage = await createImageAsync(images.levels[5].xtPltaform);
  flagPoleImage = await createImageAsync(flagPoleSprite);
  const mountains = await createImageAsync(images.levels[5].mountains);

  flagPole = new GenericObject({
    x: 8962,
    y: canvas.height - lgPlatformImage.height - flagPoleImage.height,
    image: flagPoleImage,
  })

  fireFlowers = [
    new FireFlower({
      position: {
        x: 15,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      }
    }),
    new FireFlower({
      position: {
        x: 2643,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      }
    }),
    new FireFlower({
      position: {
        x: 4580,
        y: canvas.height - tPlatformImage.height - 100
      },
      velocity: {
        x: 0,
        y: 0
      }
    }),
    new FireFlower({
      position: {
        x: 6151 + 88,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      }
    }),

  ];

  const goombaWidth = 43.33;

  goombas = [
    new Goomba({
      position: {
        x: 402 + tPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -3,
        y: 0
      },
      distance: {
        limit: tPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 829 + blockTriImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -5,
        y: 0
      },
      distance: {
        limit: blockTriImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 1154 + mdPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -4,
        y: 0
      },
      distance: {
        limit: mdPlatformImage.width - goombaWidth * 3,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 1154 + mdPlatformImage.width - goombaWidth * 2,
        y: 100
      },
      velocity: {
        x: -4,
        y: 0
      },
      distance: {
        limit: mdPlatformImage.width - goombaWidth * 3,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 1154 + mdPlatformImage.width - goombaWidth * 3,
        y: 100
      },
      velocity: {
        x: -4,
        y: 0
      },
      distance: {
        limit: mdPlatformImage.width - goombaWidth * 3,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 2341 + blockTriImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -3,
        y: 0
      },
      distance: {
        limit: blockTriImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 2844 + blockImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      },
      distance: {
        limit: blockTriImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 3008 + lgPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -4,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth * 3,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 3008 + lgPlatformImage.width - goombaWidth * 2,
        y: 100
      },
      velocity: {
        x: -5,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth * 3,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 3008 + lgPlatformImage.width - goombaWidth * 3,
        y: 100
      },
      velocity: {
        x: -4,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth * 3,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 4494 + tPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -4,
        y: 0
      },
      distance: {
        limit: tPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 4894 + mdPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -4,
        y: 0
      },
      distance: {
        limit: mdPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 4894 + mdPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -3,
        y: 0
      },
      distance: {
        limit: mdPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 5698 + lgPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -5,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 6780 + lgPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -5,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 6780 + lgPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -4,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 6780 + lgPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -4,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 6780 + lgPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -3,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 8239 + blockTriImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -3,
        y: 0
      },
      distance: {
        limit: blockTriImage.width - goombaWidth,
        traveled: 0
      }
    }),
  ];

  particles = [];

  platforms = [
    new Platform({
      x: 402 + tPlatformImage.width + 200,
      y: 300,
      image: blockTriImage,
      block: true,
    }),
    new Platform({
      x: 1134 + mdPlatformImage.width + 150,
      y: 350,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 1738 + blockImage.width + 150,
      y: 280,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 1939 + blockImage.width + 150,
      y: 210,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 2140 + blockImage.width + 150,
      y: 140,
      image: blockTriImage,
      block: true,
    }),
    new Platform({
      x: 2341 + blockTriImage.width + 150,
      y: 210,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 2643 + blockImage.width + 150,
      y: 280,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 4492,
      y: canvas.height - tPlatformImage.height - tPlatformImage.height,
      image: tPlatformImage,
    }),
    new Platform({
      x: 5698 + lgPlatformImage.width - xtPlatformImage.width - tPlatformImage.width,
      y: canvas.height - lgPlatformImage.height - xtPlatformImage.height,
      image: xtPlatformImage,
    }),
    new Platform({
      x: 6151 + xtPlatformImage.width,
      y: canvas.height - lgPlatformImage.height - tPlatformImage.height,
      image: tPlatformImage,
    }),
    new Platform({
      x: 6780,
      y: canvas.height - lgPlatformImage.height - lgPlatformImage.height,
      image: lgPlatformImage,
    }),
    new Platform({
      x: 6780 + lgPlatformImage.width + 200,
      y: 300,
      image: blockTriImage,
    }),
    new Platform({
      x: 7887 + blockTriImage.width + 200,
      y: 200,
      image: blockTriImage,
    }),
  ];

  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(images.levels[5].background)
    }),
    new GenericObject({
      x: -1,
      y: canvas.height - mountains.height,
      image: mountains
    }),
  ];



  scrollOffset = 0;

  const platformsMap = [
    'xt',
    'gap',
    't',
    'gap',
    'gap',
    'gap',
    'md',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'lg',
    'gap',
    'xt',
    'gap',
    't',
    'gap',
    'md',
    'gap',
    'gap',
    'lg',
    'gap',
    'lg',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'lg'
  ];


  let platformDistance = 0;

  platformsMap.forEach(symbol => {
    switch (symbol) {
      case 't':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - tPlatformImage.height,
          image: tPlatformImage,
          block: true
        }));
        platformDistance += tPlatformImage.width;
        break;
      case 'xt':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - xtPlatformImage.height,
          image: xtPlatformImage,
          block: true

        }));
        platformDistance += xtPlatformImage.width;
        break;
      case 'md':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - mdPlatformImage.height,
          image: mdPlatformImage,
        }));
        platformDistance += mdPlatformImage.width;
        break;

      case 'lg':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - lgPlatformImage.height,
          image: lgPlatformImage,
        }));
        platformDistance += lgPlatformImage.width;
        break;

      case 'gap':
        platformDistance += 175;
        break;
    };
  });
};


let animationId;

function animate() { //---------------------------------------------------------------------------------------------------animate func----------------------------------
  animationId = requestAnimationFrame(animate);
  c.fillStyle = 'white';
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach(genericObject => {
    genericObject.update();
    genericObject.velocity.x = 0;
  });

  platforms.forEach(platform => {
    platform.update();
    platform.velocity.x = 0;
  });

  particles.forEach((particle, index) => {
    particle.update();

    if (particle.fireball && (particle.position.x - particle.radius >= canvas.width || particle.position.x + particle.radius <= 0)) {
      setTimeout(() => {
        particles.splice(index, 1);
      }, 0);
    };
  });

  if (score < 0) {
    score = 0;
  };

  drawLevelAndScore();

  if (isPause) {
    messages.push(new Message({
      position: {
        x: canvas.width / 2 - 100,
        y: 300
      },
      text: 'PAUSE'
    }));

    messages.forEach(message => {
      message.draw();
    });

    cancelAnimationFrame(animationId);
  }


  if (flagPole) {
    flagPole.update();
    flagPole.velocity.x = 0;

    // mario touches flagpole
    // win condition
    // complete level
    if (!game.disableUserInput && isObjectsTouch({ object1: player, object2: flagPole })) {
      audio.completeLevel.play();
      audio.musicLevel1.stop();

      game.disableUserInput = true;
      player.velocity.x = 0;
      player.velocity.y = 0;
      player.currentSprite = player.sprites.stand.right;
      gravity = 0;

      if (player.powerUps.fireFlower) {
        player.currentSprite = player.sprites.stand.fireFlower.right;
      };

      //flagpole slide
      setTimeout(() => {
        audio.descend.play();
      }, 200);
      gsap.to(player.position, {
        y: canvas.height - lgPlatformImage.height - player.height,
        duration: 1,
        onComplete() {
          player.currentSprite = player.sprites.run.right;

          if (player.powerUps.fireFlower) {
            player.currentSprite = player.sprites.run.fireFlower.right;
          };

        }
      });

      gsap.to(player.position, {
        delay: 1,
        x: canvas.width,
        duration: 1,
        ease: 'power1.in'
      });

      //fireworks

      const particleCount = 300;
      const radians = Math.PI * 2 / particleCount; // directions
      const power = 8;
      let increment = 1

      const intervalId = setInterval(() => {
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle({
            position: {
              x: canvas.width / 4 * increment,
              y: canvas.height / 2,
            },
            velocity: {
              x: Math.cos(radians * i) * power * Math.random(),
              y: Math.sin(radians * i) * power * Math.random(),
            },
            radius: 3 * Math.random(),
            color: `hsl(${Math.random() * 360}, 60%, 50%)`,
            fades: true
          }))
        };

        audio.fireworkBurst.play();
        audio.fireworkWhistle.play();

        if (increment === 3) {
          clearInterval(intervalId);
        };
        increment++;
      }, 1000);
      // switch to the next level 
      setTimeout(() => {
        if (currentLevel === 5) {
          saveScore(score);
          drawWinGame();
          cancelAnimationFrame(animationId);
          
          
        //  console.log('game over'); //endgame


        }
        currentLevel++;
        gravity = 1.5;
        selectLevel(currentLevel);
      }, 8000);
    };
  };

  //mario  powerup
  fireFlowers.forEach((fireFlower, index) => {
    if (isObjectsTouch({
      object1: player,
      object2: fireFlower
    })) {
      score = score + 50;
      audio.obtainPowerUp.play();
      player.powerUps.fireFlower = true;
      setTimeout(() => {
        fireFlowers.splice(index, 1);
      }, 0);
    } else {
      fireFlower.update();
    };
  });

  goombas.forEach((goomba, index) => {
    goomba.update();

    //remove goomba on fireball hit
    particles.forEach((particle, particleIndex) => {
      if (
        particle.fireball &&
        particle.position.x + particle.radius >= goomba.position.x &&
        particle.position.y + particle.radius >= goomba.position.y &&
        particle.position.x - particle.radius <=
        goomba.position.x + goomba.width &&
        particle.position.y - particle.radius <=
        goomba.position.y + goomba.height
      ) {
        score = score + 100;
        audio.goombaSquash.play();
        for (let i = 0; i < 50; i++) {
          particles.push(
            new Particle({
              position: {
                x: goomba.position.x + goomba.width / 2,
                y: goomba.position.y + goomba.height / 2
              },
              velocity: {
                x: (Math.random() - 0.5) * 7,
                y: (Math.random() - 0.5) * 15
              },
              radius: Math.random() * 3
            })
          )
        };

        setTimeout(() => {
          goombas.splice(index, 1);
          particles.splice(particleIndex, 1);
        }, 0);
      };
    });

    // goomba stomp squish // goomba dies

    if (collisionTop({
      object1: player,
      object2: goomba
    })) {
      score = score + 100;
      audio.goombaSquash.play();
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle({
          position: {
            x: goomba.position.x + goomba.width / 2,
            y: goomba.position.y + goomba.height / 2
          },
          velocity: {
            x: (Math.random() - 0.5) * 7,
            y: (Math.random() - 0.5) * 15
          },
          radius: Math.random() * 3
        }));
      };
      player.velocity.y -= 30;
      setTimeout(() => {
        goombas.splice(index, 1);
      }, 0);
    } else if (player.position.x + player.width >= goomba.position.x
      && player.position.y + player.height >= goomba.position.y
      && player.position.x <= goomba.position.x + goomba.width) {
      // player hits goomba
      // fireflower / lose powerup //game over
      if (player.powerUps.fireFlower) {
        player.invincible = true;
        player.powerUps.fireFlower = false;
        score = score - 10;
        audio.losePowerUp.play();
        setTimeout(() => {
          player.invincible = false;
        }, 1000);
      } else if (!player.invincible) { //player toches the goomba and die
        gameOver();
        return;
      };
    };
  });

  player.update();

  if (game.disableUserInput) return;

  //scrolling code
  let hitSide = false;

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    //scrolling code---------------------------------------------------------------------scrolling code-----------------------------------
    if (keys.right.pressed) {
      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i]
        platform.velocity.x = -player.speed

        if (platform.block && hitSideOfPlatform({ object: player, platform })) {
          platforms.forEach((platform) => {
            platform.velocity.x = 0
          })

          hitSide = true;
          break;
        };
      };

      if (!hitSide) {
        scrollOffset += player.speed;

        flagPole.velocity.x = -player.speed;

        genericObjects.forEach(genericObject => { //parallax scroll effect
          genericObject.velocity.x = -player.speed * 0.66;
        });

        goombas.forEach(goomba => {
          goomba.position.x -= player.speed;
        });

        fireFlowers.forEach(fireFlower => {
          fireFlower.position.x -= player.speed;
        });

        particles.forEach(particle => {
          particle.position.x -= player.speed;
        });
      }
    } else if (keys.left.pressed && scrollOffset > 0) {
      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i];
        platform.velocity.x = player.speed;

        if (platform.block && hitSideOfPlatform({
          object: player,
          platform: platform
        })) {
          platforms.forEach(platform => {
            platform.velocity.x = 0;
          });

          hitSide = true;
          break;
        };
      };

      if (!hitSide) {
        scrollOffset -= player.speed;

        flagPole.velocity.x = player.speed;

        genericObjects.forEach(genericObject => { //parallax scroll effect
          genericObject.velocity.x = player.speed * 0.66;
        });

        goombas.forEach(goomba => {
          goomba.position.x += player.speed;
        });

        fireFlowers.forEach(fireFlower => {
          fireFlower.position.x += player.speed;
        });

        particles.forEach(particle => {
          particle.position.x += player.speed;
        });
      }
    }
  }

  // -------------------------------------------------------------------------------------------platform collision detection----------------
  platforms.forEach(platform => {
    if (isOnTopOfPlatform({
      object: player,
      platform: platform
    })) {
      player.velocity.y = 0;
    };

    if (platform.block && hitBottomOfPlatform({
      object: player,
      platform: platform
    })) {
      player.velocity.y = -player.velocity.y;
    };

    if (platform.block && hitSideOfPlatform({
      object: player,
      platform: platform
    })) {
      player.velocity.x = 0;
    };

    //particles bounce
    particles.forEach((particle, index) => {
      if (isOnTopOfPlatformCircle({
        object: particle,
        platform: platform
      })) {
        const bounce = 0.9;
        particle.velocity.y = -particle.velocity.y * .99;

        if (particle.radius - 0.4 < 0) { //making them smaller every time they bounce and then delete
          particles.splice(index, 1);
        } else {
          particle.radius -= 0.4;
        };
      };

      if (particle.timeToLive < 0) {
        particles.splice(index, 1);
      }
    });

    goombas.forEach(goomba => {
      if (isOnTopOfPlatform({
        object: goomba,
        platform: platform
      })) {
        goomba.velocity.y = 0;
      }
    });

    fireFlowers.forEach(fireFlower => {
      if (isOnTopOfPlatform({
        object: fireFlower,
        platform: platform
      })) {
        fireFlower.velocity.y = 0;
      }
    });

  });

  //lose condition //game over
  if (player.position.y > canvas.height) {
    gameOver();
    return;
  }

  //--------------------------------------------------------------------------------sprite switching-----------------------------------------
  if (player.shooting) {
    player.currentSprite = player.sprites.shoot.fireFlower.right;

    if (lastKey === 'left') {
      player.currentSprite = player.sprites.shoot.fireFlower.left;
    };

    return;
  };


  //sprite jump
  if (player.velocity.y !== 0) return;

  if (keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.right) {
    player.currentSprite = player.sprites.run.right;
  } else if (keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.left) {
    player.currentSprite = player.sprites.run.left;
  } else if (!keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.stand.left) {
    player.currentSprite = player.sprites.stand.left;
  } else if (!keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.stand.right) {
    player.currentSprite = player.sprites.stand.right;
  };

  //fireFlower sprites

  if (!player.powerUps.fireFlower) return;

  if (keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.fireFlower.right) {
    player.currentSprite = player.sprites.run.fireFlower.right;
  } else if (keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.fireFlower.left) {
    player.currentSprite = player.sprites.run.fireFlower.left;
  } else if (!keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.stand.fireFlower.left) {
    player.currentSprite = player.sprites.stand.fireFlower.left;
  } else if (!keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.stand.fireFlower.right) {
    player.currentSprite = player.sprites.stand.fireFlower.right;
  };
}; // animation loop ends

//---------------------------------------------------------------------------------event listeners-----------------------------------
addEventListener('keydown', ({ keyCode }) => {
  //console.log(keyCode);
 
  if (game.disableUserInput) return;

  switch (keyCode) {
    case 65:
      keys.left.pressed = true;
      lastKey = 'left';
      break;

    case 83:
      break;

    case 68: //right
      keys.right.pressed = true;
      lastKey = 'right';
      break;

    case 87: //up
      if (player.velocity.y !== 0) { //не более одного прыжка
        break;
      }

      player.velocity.y -= 25;
      audio.jump.play();

      if (!lastKey) {
        lastKey = defaultDirection;
      };

      if (lastKey === 'right') {
        player.currentSprite = player.sprites.jump.right;
      } else {
        player.currentSprite = player.sprites.jump.left;
      }

      if (!player.powerUps.fireFlower) break;

      if (lastKey === 'right') {
        player.currentSprite = player.sprites.jump.fireFlower.right;
      } else {
        player.currentSprite = player.sprites.jump.fireFlower.left;
      };

      break;

    case 32: //space
      if (!player.powerUps.fireFlower) return;

      player.shooting = true;

      setTimeout(() => {
        player.shooting = false;
      }, 100);

      if (!isPause) {
        audio.fireFlowerShot.play();
      };

      let velocity = 15;
      if (lastKey === 'left') {
        velocity = -velocity;
      }

      particles.push(new Particle({
        position: {
          x: player.position.x + player.width / 2,
          y: player.position.y + player.height / 2
        },
        velocity: {
          x: velocity,
          y: 0
        },
        radius: 5,
        color: 'red',
        fireball: true
      }))
      break;

    case 13: //enter

      if (modalNewGame.style.display === 'flex') {
        selectLevel(1);
        animate();
        modalNewGame.style.display = 'none';
      };

      break;

    case 27:// esc

      isPause = !isPause;

      if (modalNewGame.style.display !== 'flex') {
        if (!isPause) {
          animate();
        };
      };
  }
});

addEventListener('keyup', ({ keyCode }) => {

  if (game.disableUserInput) return;

  switch (keyCode) {
    case 65:
      keys.left.pressed = false;
      break;
    case 83:
      break;
    case 68:
      keys.right.pressed = false;
      break;
    case 87:
      break;
  }
});

newGameButton.addEventListener('click', function (event) {
  selectLevel(1);
  animate();
  modalNewGame.style.display = 'none';
});


function spa() { //spa
  const modalStart = document.querySelector('.modal-start');
  const modalRules = document.querySelector('.modal-rules');
  const modalTopScores = document.querySelector('.modal-top-scores');

  const buttonStartGame = document.querySelector('.button-start-game');
  const buttonStartRules = document.querySelector('.modal-start-rules-button');
  const buttonStartScores = document.querySelector('.modal-start-scores-button');

  const buttonRulesBack = document.querySelector('.rules-back-button');
  const buttonScoressBack = document.querySelector('.scores-back-button');

  const links = {
    start: `<div id="start-game-div"><h1>Mario game</h1>
          <div class="rules">
              <a href="#rules" class="modal-start-rules-button" title="Game rules">rules</a>
          </div>
          <div class="top-scores">
              <a href="#topScores" class="modal-start-scores-button" title="Top game scores">top scores</a>
          </div>
          <div class="name-block">
              <input type="text" class="name" id="name" autocomplete="off" required>
              <span class="bar"></span>
              <label class="label-name" for="name">enter your name</label>
          </div>
          <div class="button-block button-start-game">
              <button class="button" id="start-new-game">start new game</button>
          </div></div>`,
    rules: `<h1>Mario game RULES</h1>
          <div class="rules-rules">
              <div class="keys">
                  <p><span>W</span>,<span>A</span>,<span>D</span></p>
                  <p>---</p>
                  <p>Go Up, left, right</p>
              </div>
              <div class="keys">
                  <p><span>Space</span></p>
                  <p>---</p>
                  <p>shoot (when have fireflower)</p>
              </div>
              <div class="keys">
                  <p><span>ESC</span></p>
                  <p>---</p>
                  <p>pause</p>
              </div>
              <div class="rules-text">
                  <p>The goal of the game is to complete as many levels as possible, earning points.</p>
                  <ul class="score-rules">
                      <li>Hit the goomba - <span>100 scores.</span></li>
                      <li>Take a fireFlower - <span>50 scores</span></li>
                      <li>go to the next level - <span>100 scores</span></li>
                  </ul>
                  <p>the game continues until the player dies.</p>
              </div>
          </div>
          <div class="button-block">
              <a href="#start" class="button rules-back-button">back</a>
          </div>`,
    topScores: `<h1>top scores</h1>
              <div class="scores">
                  <ul class="scores-list" id="scores-list">
                      <li><span class="player-name">NAME</span><span class="score-number">SCORE</span></li>
                      <li><span class="player-name">NAME</span><span class="score-number">SCORE</span></li>
                      <li><span class="player-name">NAME</span><span class="score-number">SCORE</span></li>
                      <li><span class="player-name">NAME</span><span class="score-number">SCORE</span></li>
                      <li><span class="player-name">NAME</span><span class="score-number">SCORE</span></li>
                  </ul>
              </div>
              <div class="button button-block">
                  <a href="#start" class="button scores-back-button">back</a>
          </div>`,
  };

  window.addEventListener('load', () => {
    if (window.location.hash.slice(1)) {
      updateState();
    } else {
      window.location.hash = '#start';
    }
  });

  window.addEventListener('hashchange', updateState);

  async function updateState() {
    let content = links[window.location.hash.slice(1)];
    document.title = `Mario game - ${window.location.hash.slice(1)}`
    modalStart.innerHTML = content ? content : `<h1>Page not found</h1>`;
    addEventsListeners();
    document.getElementsByTagName('canvas')[0].style.display = 'none';

    if (window.location.hash.slice(1) === 'topScores') {
      loadTopScoresContent();
    };
  };

  async function loadTopScoresContent() { // load scores 
    let bestScores = await getBestScores('LOCKGET');

    if (bestScores.error) {
      bestScores = await getBestScores('READ');
    };
    const bestScoresParsed = bestScores.result ? JSON.parse(bestScores.result) : []; //inerHTML scor
    const scoresListLiCollection = Array.from(document.getElementById('scores-list').children);
    let bestScoresParsed1 = bestScoresParsed.sort((a, b) => a.score > b.score ? -1 : 1);
   // console.log(bestScoresParsed1);

    for (let i = 0; i < scoresListLiCollection.length; i++) {
      let li = scoresListLiCollection[i];
      let nameHtml = li.querySelector('.player-name');
      let scoreHtml = li.querySelector('.score-number');
      let name = bestScoresParsed1[i].playerName;
      let score = bestScoresParsed1[i].score;
      if (!name) {
        name = 'Jane Doe'
      };

      nameHtml.textContent = name;
      scoreHtml.textContent = score;
    }

  };

  function addEventsListeners() {
    const startNewGameButton = document.getElementById('start-new-game');

    startNewGameButton?.addEventListener('click', function (event) {
      document.getElementsByTagName('canvas')[0].style.display = 'block';
      const playerName = document.getElementById('name').value;
      player.name = playerName;
      document.getElementById('start-game-div').style.display = 'none';
      document.querySelector('.modal').style.display = 'none';
      selectLevel(1);
      animate();
    });
  }
};

