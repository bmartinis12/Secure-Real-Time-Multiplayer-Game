import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import { dimension } from './dimension.mjs';
const socket = io();


let tick;
let playersList = [];
let shrimpEntity;
let playerEntity;
let sharkEntity;


const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');


let fishImage = new Image();
let shrimpImage = new Image();
let sharkImage = new Image();

const init = () => {
  // get images
  fishImage.src = 'public/img/fish.png';
  shrimpImage.src = 'public/img/shrimp.png';
  sharkImage.src = 'public/img/shark.png';
  
  // create user
  socket.on('init', ({ id, players, shrimp, shark }) => {
    console.log(id, players,shrimp,shark);
    shrimpEntity = new Collectible(shrimp);
    playerEntity = players.filter(x => x.id === id)[0];
    playerEntity = new Player(playerEntity);
    sharkEntity = new Player(shark);
  
    playersList = players


    document.onkeydown = e => {
      let  dir = null
      switch(e.keyCode) {
        case 87:
        case 38:
           dir = 'up';
           break;
        case 83:
        case 40:
           dir = 'down';
           break;
        case 65:
        case 37:
           dir = 'left';
           break;
        case 68:
        case 39:
           dir = 'right';
           break;   
      }
      if (dir) {
        playerEntity.movePlayer(dir, 10);
        socket.emit('update', playerEntity);
      }
    }
  
    // update
    socket.on('update', ({players:players,shark:shark, shrimp:shrimp,player:player}) => {
      sharkEntity = new Player(shark)
      playersList = players;
      shrimpEntity = new Collectible(shrimp)
      if (player) {
        if (player.id === playerEntity.id) {
          playerEntity= new Player(player);
        }
      }
      
    });
  
  });
  
  window.requestAnimationFrame(update); 
}

const update = () => {

  context.clearRect(0, 0, canvas.width, canvas.height);

  // Set background color
  context.fillStyle = '#17202A';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Create border for play field
  context.strokeStyle = '#45b6fe';
  context.strokeRect(dimension.minX, dimension.minY, dimension.arenaSizeX, dimension.arenaSizeY);

  // Controls text
  context.fillStyle = '#FDFEFE';
  context.font = `20px 'Papryus'`;
  context.textAlign = 'center';
  context.fillText('Controls', 80, 23);
  context.textAlign = 'center';
  context.fillText('WASD', 80, 45);

  // Game title
  context.font = `40px 'Papyrus'`;
  context.fillText('Fish Life Simulator', 300, 45, 300);

  if (playerEntity) {
    playerEntity.draw(context,fishImage);
    context.font = `26px 'Papyrus'`;
    context.fillText(playerEntity.calculateRank(playersList), 560, 45);
    playersList.forEach((player)=> {
       if (player.id !== playerEntity.id) {
         let p = new Player(player);
         p.draw(context, fishImage);
       }
    });
    if (shrimpEntity) {
      shrimpEntity.draw(context,shrimpImage);
    }
    if (sharkEntity) {
      sharkEntity.draw(context,sharkImage);
    }
  }

 
  tick = requestAnimationFrame(update);
}

init();
