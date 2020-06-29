export function getCameraCenter(scene: Phaser.Scene): [number, number] {
  const xCenter = scene.cameras.main.worldView.x + scene.cameras.main.width / 2;
  const yCenter =
    scene.cameras.main.worldView.y + scene.cameras.main.height / 2;
  return [xCenter, yCenter];
}
