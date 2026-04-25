document.addEventListener("DOMContentLoaded", () => {
    const aquarium = document.getElementById('aquarium');
    const fishElements = aquarium.getElementsByClassName('fish');
    
    //fish setup 4 movement timeout purposes
    Array.from(fishElements).forEach(fish => {
        if (fish.offsetParent !== null) {
            fish.movementTimeout = null;
            fish.isFleeing = false;
            fish.isInPursuit = false;
        }
    });
    
    
    const getRandomPositionWithinBounds = (maxX, maxY) => {
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;
        return { x, y };
    };

    const updateFishOrientation = (fish, oldX, newX) => {
    //check if newX and oldX are valid
    if (!isNaN(newX) && !isNaN(oldX)) {
        if (newX > oldX && fish.getAttribute('data-flipped') !== 'true') {
            fish.style.transform = 'scaleX(-1)';
            fish.setAttribute('data-flipped', 'true');
        } else if (newX < oldX && fish.getAttribute('data-flipped') === 'true') {
            fish.style.transform = 'scaleX(1)';
            fish.setAttribute('data-flipped', 'false');
        }
    }
};

const updateFishOrientationTowardsCursor = (fish, cursorX) => {
    const fishRect = fish.getBoundingClientRect();
    const fishCenterX = fishRect.left + fish.offsetWidth / 2;

    if (cursorX > fishCenterX && fish.getAttribute('data-flipped') !== 'true') {
        fish.style.transform = 'scaleX(-1)';
        fish.setAttribute('data-flipped', 'true');
    } else if (cursorX < fishCenterX && fish.getAttribute('data-flipped') === 'true') {
        fish.style.transform = 'scaleX(1)';
        fish.setAttribute('data-flipped', 'false');
    }
};

    const getRandomPosition = (maxX, maxY) => {
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;
        return { x, y };
    };
    
    
    const bobFish = (fish, amount, times, onComplete) => {
    if (times <= 0) {
        if (onComplete) {
            onComplete();
        }
        return;
    }

    const currentTop = parseInt(fish.style.top, 10);
    fish.style.top = `${currentTop + amount}px`;

    setTimeout(() => {
        bobFish(fish, -amount, times - 1, onComplete);
    }, 300); //barely pause between bobs
};


    const restFish = (fish) => {
    bobFish(fish, 2, 10, () => {
        //resume normal movement after bob
        moveFish(fish, 'idle');
    });
};

    const pursuitDistance = 100;
const stopPursuitDistance = 225;

const moveFishTowardCursor = (fish, cursorX, cursorY) => {
    const fishRect = fish.getBoundingClientRect();
    const aquariumRect = aquarium.getBoundingClientRect();

    const fishCenterX = fishRect.left + fish.offsetWidth / 2;
    const fishCenterY = fishRect.top + fish.offsetHeight / 2;

    const distanceToCursor = Math.sqrt(Math.pow(cursorX - fishCenterX, 2) + Math.pow(cursorY - fishCenterY, 2));

    if (distanceToCursor < pursuitDistance) {
        fish.isInPursuit = true;
    } else if (distanceToCursor > stopPursuitDistance) {
        fish.isInPursuit = false;
    }

    if (fish.isInPursuit) {
        const targetX = cursorX - aquarium.getBoundingClientRect().left - fish.offsetWidth / 2;
        const targetY = cursorY - aquarium.getBoundingClientRect().top - fish.offsetHeight / 2;

        const newX = Math.min(Math.max(targetX, 0), aquarium.offsetWidth - fish.offsetWidth);
        const newY = Math.min(Math.max(targetY, 0), aquarium.offsetHeight - fish.offsetHeight);

        if (fish.id === 'evilfish') {
            updateFishOrientationTowardsCursor(fish, cursorX);
        }

        fish.style.transition = 'left 0.3s linear, top 0.3s linear';
        fish.style.left = `${newX}px`;
        fish.style.top = `${newY}px`;
    }
};




    
    const fleeDistance = 50;
    const fleeMoveRange = 60;
    const fleeSpeed = '0.3s';

  const moveFishAwayFromCursor = (fish, cursorX, cursorY) => {
    if (fish.isFleeing) {
        return; //fixes double fleeing
    }
    const fishRect = fish.getBoundingClientRect();
    const aquariumRect = aquarium.getBoundingClientRect();

    const fishCenterX = fishRect.left + fish.offsetWidth / 2;
    const fishCenterY = fishRect.top + fish.offsetHeight / 2;

    const distanceX = cursorX - fishCenterX;
    const distanceY = cursorY - fishCenterY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < fleeDistance) {
        fish.isFleeing = true;
        
        const newX = fishCenterX - Math.sign(distanceX) * fleeMoveRange - aquariumRect.left;
        const newY = fishCenterY - Math.sign(distanceY) * fleeMoveRange - aquariumRect.top;

        
        const oldX = parseInt(fish.style.left, 10) || 0;
        updateFishOrientation(fish, oldX, newX);

        
        clearTimeout(fish.movementTimeout);

        
        fish.style.transition = `left ${fleeSpeed} linear, top ${fleeSpeed} linear`;
        fish.style.left = `${Math.min(Math.max(newX, 0), aquariumRect.width - fish.offsetWidth)}px`;
        fish.style.top = `${Math.min(Math.max(newY, 0), aquariumRect.height - fish.offsetHeight)}px`;

        fish.movementTimeout = setTimeout(() => {
        fish.style.transition = 'left 10s linear, top 10s linear';
        fish.isFleeing = false;
        moveFish(fish, 'idle');
    }, parseFloat(fleeSpeed) * 1000);
    }
};


    document.addEventListener('mousemove', (event) => {
    Array.from(fishElements).forEach(fish => {
        if (fish.offsetParent !== null) {
            if (fish.id !== 'coolfish') {
                moveFishAwayFromCursor(fish, event.clientX, event.clientY);
            }
            if (fish.id === 'evilfish') {
                moveFishTowardCursor(fish, event.clientX, event.clientY);
            }
        }
    });
});
    
    const moveFish = (fish, mode) => {
    if (fish.isFleeing || fish.isInPursuit) {
        //skip movement if fleeing/pursuit
        return;
    }
        
        const aquariumRect = aquarium.getBoundingClientRect();
        const aquariumActualLeft = aquariumRect.left;
        
        let oldX = fish.getBoundingClientRect().left - aquariumActualLeft;

        if (mode === 'resting') {
            restFish(fish);
        } else {
            let newX, newY;
            if (mode === 'idle') {
                const range = 200;
                newX = oldX + (Math.random() - 0.5) * 2 * range;
                newY = parseInt(fish.style.top, 10) || 0 + (Math.random() - 0.5) * 2 * range;
            } else if (mode === 'seeking') {
                const target = getRandomPosition(aquarium.offsetWidth - fish.offsetWidth, aquarium.offsetHeight - fish.offsetHeight);
                newX = target.x;
                newY = target.y;
            }

            //fallback coords
            newX = isNaN(newX) ? oldX : newX;
            newY = isNaN(newY) ? parseInt(fish.style.top, 10) || 0 : newY;
            
            newX = Math.min(Math.max(newX, 0), aquarium.offsetWidth - fish.offsetWidth);
            newY = Math.min(Math.max(newY, 0), aquarium.offsetHeight - fish.offsetHeight);
            
            fish.style.left = `${newX}px`;
            fish.style.top = `${newY}px`;
            updateFishOrientation(fish, oldX, newX);
            
            clearTimeout(fish.movementTimeout);
            
            const nextMoveInterval = mode === 'resting' ? 2400 : 900 + Math.random() * 1100;
            const nextMode = Math.random() < 0.15 ? 'idle' : Math.random() < 0.90 ? 'seeking' : 'resting';
            fish.movementTimeout = setTimeout(() => moveFish(fish, nextMode), nextMoveInterval);
        }
    };
    
    function getDistanceToCursor(fish, cursorX, cursorY) {
    const fishRect = fish.getBoundingClientRect();
    const fishCenterX = fishRect.left + fish.offsetWidth / 2;
    const fishCenterY = fishRect.top + fish.offsetHeight / 2;
    const distanceX = cursorX - fishCenterX;
    const distanceY = cursorY - fishCenterY;
    return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
}
    
    //set up
    Array.from(fishElements).forEach(fish => {
        const maxX = aquarium.offsetWidth - fish.offsetWidth;
        const maxY = aquarium.offsetHeight - fish.offsetHeight;

        const initialPosition = getRandomPositionWithinBounds(maxX, maxY);
        fish.style.transition = 'none';
        fish.style.left = `${initialPosition.x}px`;
        fish.style.top = `${initialPosition.y}px`;
        fish.setAttribute('data-flipped', 'false');

        const initialMode = Math.random() < 0.5 ? 'idle' : 'seeking';
        setTimeout(() => {
            fish.style.transition = 'left 15000ms linear, top 15000ms linear';
            moveFish(fish, initialMode);
        }, 50);
    });
});

//                                  ____
//                               /\|    ~~\
//                             /'  |   ,-. `\
//                            |       | X |  |
//                           _|________`-'   |X
//                         /'          ~~~~~~~~~,
//                       /'             ,_____,/_
//                    ,/'        ___,'~~         ;
//~~~~~~~~|~~~~~~~|---          /  X,~~~~~~~~~~~~,
//        |       |            |  XX'____________'
//        |       |           /' XXX|            ;
//        |       |        --x|  XXX,~~~~~~~~~~~~,
//        |       |          X|     '____________'
//        |   o   |---~~~~\__XX\             |XX
//        |       |          XXX`\          /XXXX
//~~~~~~~~'~~~~~~~'               `\xXXXXx/' \XXX
//                                 /XXXXXX\
//                               /XXXXXXXXXX\
//                             /XXXXXX/^\XDCAU\
//                            ~~~~~~~~   ~~~~~~~



