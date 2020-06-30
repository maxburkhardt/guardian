export function getCameraCenter(scene: Phaser.Scene): [number, number] {
  return getPointRelativeToView(scene, 0.5, 0.5);
}

export function getPointRelativeToView(
  scene: Phaser.Scene,
  xPercent: number,
  yPercent: number
): [number, number] {
  const xCenter = scene.game.scale.gameSize.width * xPercent;
  const yCenter = scene.game.scale.gameSize.height * yPercent;
  return [xCenter, yCenter];
}

export const titleStyle: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: "Metamorphous",
  fontSize: "64px",
  color: "#fff",
  align: "center",
};
export const buttonStyle: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: "Metamorphous",
  fontSize: "36px",
  color: "#fff",
  align: "center",
};
