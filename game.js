/* global Phaser */

import { createAnimations } from "./animations.js";
import { checkControls } from "./controls.js";

const config = {
  type: Phaser.AUTO, // webgl, canvas
  width: 256,
  height: 244,
  backgroundColor: "#049cd8",
  parent: "game",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload, // se ejecuta para precargar recursos
    create, // se ejecuta cuando el juego comienza
    update, // se ejecuta en cada frame
  },
};

new Phaser.Game(config);
// this -> game -> el juego que estamos construyendo

function preload() {
  this.load.image("cloud1", "assets/scenery/overworld/cloud1.png");

  this.load.image("floorbricks", "assets/scenery/overworld/floorbricks.png");

  this.load.spritesheet(
    "mario", // <--- id
    "assets/entities/mario.png",
    { frameWidth: 18, frameHeight: 16 }
  );

  this.load.spritesheet("goomba", "assets/entities/overworld/goomba.png", {
    frameWidth: 16,
    frameHeight: 16,
  });

  this.load.audio("gameover", "assets/sound/music/gameover.mp3");
  this.load.audio("goomba-stomp", "assets/sound/effects/goomba-stomp.wav");
} // 1.

function create() {
  // image(x, y, id-del-asset)
  this.add.image(100, 50, "cloud1").setOrigin(0, 0).setScale(0.15);

  this.floor = this.physics.add.staticGroup();

  this.floor
    .create(0, config.height - 16, "floorbricks")
    .setOrigin(0, 0.5)
    .refreshBody();

  this.floor
    .create(150, config.height - 16, "floorbricks")
    .setOrigin(0, 0.5)
    .refreshBody();

  this.mario = this.physics.add
    .sprite(50, 100, "mario")
    .setOrigin(0, 1)
    .setCollideWorldBounds(true)
    .setGravityY(300);

  this.enemy = this.physics.add
    .sprite(280, config.height - 64, "goomba")
    .setOrigin(0, 1)
    .setGravityY(300)
    .setVelocityX(-50);

  this.physics.world.setBounds(0, 0, 2000, config.height);
  this.physics.add.collider(this.mario, this.floor);
  this.physics.add.collider(this.enemy, this.floor);
  this.physics.add.collider(
    this.mario,
    this.enemy,
    onEnemyHit(this.sound, this.scene)
  );

  this.cameras.main.setBounds(0, 0, 2000, config.height);
  this.cameras.main.startFollow(this.mario);

  createAnimations(this);
  this.enemy.anims.play("goomba-walk");
  this.keys = this.input.keyboard.createCursorKeys();
}

function onEnemyHit(sound, scene) {
  return (mario, enemy) => {
    if (mario.body.touching.down && enemy.body.touching.up) {
      mario.setVelocityY(-200);
      enemy.anims.play("goomba-hurt");
      sound.add("goomba-stomp", { volume: 0.2 }).play();
      enemy.setVelocityX(0);
      setTimeout(() => {
        enemy.destroy();
      }, 500);
    } else {
      enemy.setVelocityX(0);
      killMario(mario, sound, scene);
    }
  };
}

function killMario(mario, sound, scene) {
  mario.setVelocityX(0);
  if (mario.isDead) return;
  mario.isDead = true;
  mario.anims.play("mario-dead");
  sound.add("gameover", { volume: 0.2 }).play();
  mario.setCollideWorldBounds(false);

  setTimeout(() => {
    mario.setVelocityY(-350);
  }, 1000);

  setTimeout(() => {
    scene.restart();
  }, 2000);
}

function update() {
  // 3. continuamente
  checkControls(this);
  const { mario } = this;
  if (mario.y >= config.height) {
    killMario(this.mario, this.sound, this.scene);
  }
}
