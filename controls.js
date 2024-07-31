export function checkControls({mario, keys, scene, comm}) {
  if (mario.isDead) return;
  const isMarioTouchingFloor = mario.body.touching.down;
  const isLeftKeyDown = keys.left.isDown;
  const isRightKeyDown = keys.right.isDown;
  const isUpKeyIsDown = keys.up.isDown;
  if (isLeftKeyDown) {
    isMarioTouchingFloor && mario.anims.play("mario-walk", true);
    mario.x -= 2;
    mario.flipX = true;
  } else if (isRightKeyDown) {
    isMarioTouchingFloor && mario.anims.play("mario-walk", true);
    mario.x += 2;
    mario.flipX = false;
  } else if (isMarioTouchingFloor) {
    mario.anims.play("mario-idle", true);
  }

  if (isUpKeyIsDown && isMarioTouchingFloor) {
    mario.setVelocityY(-300);
    mario.anims.play("mario-jump", true);
  }

  if (comm.r.isDown) {
    scene.restart();
  }
}