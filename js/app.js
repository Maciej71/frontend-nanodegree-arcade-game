class Enemy {
    constructor(row, speed) {
        this.x = -100;
        this.y = 60 + row * 80;
        this.speed = speed;
        this.sprite = 'images/enemy-bug.png';
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    // Move enemy back to initial horizontal position when 
    // it reaches end of the screen
    update(dt) {
        //
        this.x = this.x + this.speed * dt;
        if (this.x > 500) this.x = -100;
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

class Player {
    constructor(status, allGems) {
        this.x = 200;
        this.y = 460;
        this.gameStarted = false;
        this.won = false;
        this.sprite = 'images/char-horn-girl.png';
    }

    //Update after plyer reaches water lane
    async update() {
        if(this.y < -15) {
            resetGems();
            addPoints(5);
            this.won = true;
            await sleep(150);
            this.resetPosition();
            this.won = false;
        }
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    //Should be executed when collision with enemy occurs
    async die() {
        this.resetPosition();
        substractPoints(3);
        resetGems();
    }

    resetPosition() {
        this.x = 200;
        this.y = 380;
    }

    //Move player and make sure to not cross board's borders
    handleInput(key) {
        switch(key) {
            case 'left':
                if(this.x > 0) { 
                    this.x -= 100;
                }
                break;
            case 'right':
                if(this.x < 400) {
                    this.x += 100;
                }
                break;
            case 'up':
                if(this.y > 0) {
                    this.y -= 80;
                }
                if(this.gameStarted === false && this.y !== 460) {
                    this.gameStarted = true;
                }
                break;
            case 'down':
                if(this.y < 380) {
                    this.y += 80
                }
                break;
            default:
                console.log('Incorrect input key')
        }
    }
}

class Gem {
    constructor(row, column) {
        this.x = column * 100;
        this.y = 60 + row * 80;
        this.sprite = 'images/Gem Blue.png';
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    //Move gem outside of game board and add point
    moveOut() {
        addPoints(2);
        this.x = -100;
        this.y = -100;
        this.render();
    }
}

//Object contains game status
class Status {
    constructor() {
        this.time = 60;
        this.score = 0;
        this.started = false;
    }

    timer() {
        this.started = true;
        let timer = setInterval(() => {
            this.time -= 1;
            if(this.time === 0) {
                clearInterval(timer);
            }
        }, 1000);
    }
}

//Objects instantiation
const allEnemies = createEnemies(6);
let allGems = createGems(3);
const status = new Status();
const player = new Player(status, allGems);

function resetGems() {
    allGems = createGems(3);
}

function addPoints(numberOfPoints) {
    for(let i = 0; i < numberOfPoints; i++) {
        status.score += 1;
    }
}

function substractPoints(numberOfPoints) {
    for(let i = 0; i < numberOfPoints; i++) {
        status.score -= 1;   
    }
}

//Key input listener
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//Create enemies array
function createEnemies(amount) {
    const enemies = [];
    for (let i = 0; i <= amount; i++) {
        enemies[i] = new Enemy(getRandom(0,2), getRandom(100, 200));
    }
    return enemies;
}

//Create gems
function createGems(amount) {
    const gems = [];
    const occupiedRow = [];
    let keep = true;

    for (let i = 0; i < amount; i++) {
        //Distribute gems in every row
        while(keep) {
            let position = getRandomPropositions();
            if(!occupiedRow.includes(position[0])) {
                occupiedRow.push(position[0]);
                gems[i] = new Gem(position[0], position[1]);
                keep = false;
            }
        }
        keep = true;
    }
    return gems;
}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Get propsed position
function getRandomPropositions() {
    return [getRandom(0,2), getRandom(0, 4)];
}

//Simple sleeper
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
