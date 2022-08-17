import seaweeds from '../img/seaweeds.png';

import backgroundLevel2 from '../img/level2/background.png';
import lgPlatformLevel2 from '../img/level2/lgPlatform.png';
import mdPlatformLevel2 from '../img/level2/mdPlatform.png';
import mountains from '../img/level2/mountains.png';
import sun from '../img/level2/sun.png';

import backgroundLevel3 from '../img/level3/background.png';
import lgPlatformLevel3 from '../img/level3/lgPlatform.png';
import mdPlatformLevel3 from '../img/level3/mdPlatform.png';
import mountainsLevel3 from '../img/level3/mountains.png';
import sunLevel3 from '../img/level3/sun.png';
import tPltaformLevel3 from '../img/level3/tPlatform.png';
import xtPltaformLevel3 from '../img/level3/xtPlatform.png';

import backgroundLevel4 from '../img/level4/background.png';
import lgPlatformLevel4 from '../img/level4/lgPlatform.png';
import mdPlatformLevel4 from '../img/level4/mdPlatform.png';
import tPltaformLevel4 from '../img/level4/tPlatform.png';
import xtPltaformLevel4 from '../img/level4/xtPlatform.png';
import mountainsLevel4 from '../img/level4/mountains.png';
import sunLevel4 from '../img/level4/sun.png';

import backgroundLevel5 from '../img/level5/background.png';
import lgPlatformLevel5 from '../img/level5/lgPlatform.png';
import mdPlatformLevel5 from '../img/level5/mdPlatform.png';
import tPltaformLevel5 from '../img/level5/tPlatform.png';
import xtPltaformLevel5 from '../img/level5/xtPlatform.png';
import mountainsLevel5 from '../img/level5/mountains.png';
import sunLevel5 from '../img/level5/sun.png';




import spriteFireFlowerShootRight from '../img/spriteFireFlowerShootRight.png';
import spriteFireFlowerShootLeft from '../img/spriteFireFlowerShootLeft.png';

export const images = {
    mario: {
        shoot: {
            fireFlower: {
                right: spriteFireFlowerShootRight,
                left: spriteFireFlowerShootLeft
            }
        }
    },
    levels: {
        1: {
            seaweeds: seaweeds
        },
        2: {
            background: backgroundLevel2,
            lgPlatform: lgPlatformLevel2,
            mdPlatform: mdPlatformLevel2,
            mountains,
            sun
        },
        3: {
            background: backgroundLevel3,
            lgPlatform: lgPlatformLevel3,
            mdPlatform: mdPlatformLevel3,
            tPltaform: tPltaformLevel3,
            xtPltaform: xtPltaformLevel3,
            mountains: mountainsLevel3,
            sun: sunLevel3,
        },
        4: {
            background: backgroundLevel4,
            lgPlatform: lgPlatformLevel4,
            mdPlatform: mdPlatformLevel4,
            tPltaform: tPltaformLevel4,
            xtPltaform: xtPltaformLevel4,
            mountains: mountainsLevel4,
            sun: sunLevel4
        },
        5: {
            background: backgroundLevel5,
            lgPlatform: lgPlatformLevel5,
            mdPlatform: mdPlatformLevel5,
            tPltaform: tPltaformLevel5,
            xtPltaform: xtPltaformLevel5,
            mountains: mountainsLevel5,
            sun: sunLevel5
        }

    }
}               