class Load extends Phaser.Scene {
    constructor() {
        super("Load");
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.image("tilemap", "colored_packed.png");
        this.load.image("transparenttilemap", "colored-transparent_packed.png");
        this.load.tilemapTiledJSON("map", "GameMap.json");
        
        
    }

    create() {
         // ...and pass to the next Scene
         this.scene.start("Start");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}