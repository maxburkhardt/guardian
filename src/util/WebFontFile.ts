import * as Phaser from "phaser";
import * as WebFontLoader from "webfontloader";

export default class WebFontFile extends Phaser.Loader.File {
  private fontNames: string | Array<string>;

  constructor(
    loader: Phaser.Loader.LoaderPlugin,
    fontNames: string | Array<string>
  ) {
    super(loader, {
      type: "webfont",
      key: fontNames.toString(),
    });

    this.fontNames = Array.isArray(fontNames) ? fontNames : [fontNames];
  }

  public load(): void {
    const config = {
      active: () => {
        this.loader.nextFile(this, true);
      },
    };

    config["google"] = {
      families: this.fontNames,
    };

    WebFontLoader.load(config);
  }
}
