class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    init() {
        this.doorsLocked = false;

    }

    preload() {
        //audio for chracter, enemies, weapons, and Bg music
        this.load.audio('shootSound', 'assets/Green_shoot.mp3');
        this.load.audio('bugshot', 'assets/Insect_shot.mp3');
        this.load.audio('ghostWhisp', 'assets/Breath_Ghost.mp3');
        this.load.audio('cyclopSeye', 'assets/One_eye.mp3');
        this.load.audio("slugMove", 'assets/Slug_movement.mp3');
        this.load.audio('backgroundCave', 'assets/Bgambience.mp3');
        this.load.audio('playerFoot', 'assets/Player_steps.mp3');
        this.load.audio('batSqueek', 'assets/bat_Squeek.mp3');
        this.load.audio('BossGrowl', 'assets/bossGrowl.mp3');
        this.load.audio('EnemyHit', 'assets/Collision.mp3');
        this.load.multiatlas("kenny-particles", "assets/kenny-particles.json", "assets/");
    }

    create() {
        this.lastShotTime = 0;
        this.shootCooldown = 450;
        this.shootDirection = null;
        this.isCameraPanning = false;
        // this.bossDefeated = false;
        
        //Map, tiles, and layers 
        this.map = this.add.tilemap("map", 16, 16, 90, 50);
        this.tileset = this.map.addTilesetImage("tilemap", "tilemap");
        this.tileset2 = this.map.addTilesetImage("colored-transparent_packed", "transparenttilemap");
        this.groundLayer = this.map.createLayer("Ground", [this.tileset, this.tileset2], 0, 0);
        this.floorboardLayer = this.map.createLayer("Floorboard", [this.tileset, this.tileset2], 0, 0);
        this.behindLayer = this.map.createLayer("Behindstuff", [this.tileset, this.tileset2], 0, 0);
        this.obstacleLayer = this.map.createLayer("Obstacles", [this.tileset, this.tileset2], 0, 0);
        this.doorLayer = this.map.createLayer("Doors", [this.tileset, this.tileset2], 0, 0);

        //creating the audio 
        this.shootSound = this.sound.add('shootSound');
        this.bugshot = this.sound.add('bugshot');
        this.ghostWhisp = this.sound.add('ghostWhisp',{ loop: true, volume: 0.3 });
        this.cyclopSeye = this.sound.add('cyclopSeye');
        this.slugMove = this.sound.add('slugMove', { loop: true, volume: 0.2 });
        this.backgroundCave = this.sound.add('backgroundCave',{ loop: true, volume: 0.2 });
        this.backgroundCave.play();
        this.playerFoot = this.sound.add('playerFoot', { volume: 0.2, loop: true });
        this.batSqueek = this.sound.add('batSqueek');
        this.BossGrowl = this.sound.add('BossGrowl',{ volume: 0.3, loop: true });
        this.EnemyHit = this.sound.add('EnemyHit', { volume: 0.1,});
         
        //health 
        this.maxHealth = 6;  
        this.currentHealth = 6;
        this.lastDamageTime = 0; 

        this.healthText = this.add.text(10, 10, `Health: ${this.currentHealth / 2} Hearts`, {
            fontSize: '16px',
            fill: '#fff'
        }).setScrollFactor(0);

        //Particle
        my.vfx.hit = this.add.particles(0, 0, "kenny-particles", {
            frame: ['flare_01.png', 'flare_01.png'],  // or any other frames you want for hit effect
            scale: { start: 0.1, end: 0 },
            lifespan: 400,
            speed: { min: 50, max: 80 },
            quantity: 5,
            alpha: { start: 1, end: 0.1 },
            on: false // We manually trigger it on hit
        });


        this.obstacleLayer.setCollisionByProperty({collides: true });
        this.behindLayer.setCollisionByProperty({ collides: true });

        const tileIndex = 25;
        const tileWidth = this.tileset.tileWidth;
        const tileHeight = this.tileset.tileHeight;

        const texture = this.textures.get('transparenttilemap');
        const frameName = '__player__';
        if (!texture.has(frameName)) {
            texture.add(
                frameName,
                0,
                (tileIndex % (texture.source[0].width / tileWidth)) * tileWidth,
                Math.floor(tileIndex / (texture.source[0].width / tileWidth)) * tileHeight,
                tileWidth,
                tileHeight
            );
        }

        const bulletIndex = 1056;
        const bulletFrame = '__bullet__';
        if (!texture.has(bulletFrame)) {
            texture.add(
                bulletFrame,
                0,
                (bulletIndex % (texture.source[0].width / tileWidth)) * tileWidth,
                Math.floor(bulletIndex / (texture.source[0].width / tileWidth)) * tileHeight,
                tileWidth,
                tileHeight
            );
        }

        const enemybulletIndex = 135;
        const enemybulletFrame = '__enemybullet__';
        if (!texture.has(enemybulletFrame)) {
            texture.add(
                enemybulletFrame,
                0,
                (enemybulletIndex % (texture.source[0].width / tileWidth)) * tileWidth,
                Math.floor(enemybulletIndex / (texture.source[0].width / tileWidth)) * tileHeight,
                tileWidth,
                tileHeight
            );
        }

        const enemyIndex = 366;
        const enemyFrame = '__enemy__';
        if (!texture.has(enemyFrame)) {
            texture.add(
                enemyFrame,
                0,
                (enemyIndex % (texture.source[0].width / tileWidth)) * tileWidth,
                Math.floor(enemyIndex / (texture.source[0].width / tileWidth)) * tileHeight,
                tileWidth,
                tileHeight
            );
        }
        
        const enemy1Index = 464;
        const enemy1Frame = '__enemy1__';
        if (!texture.has(enemy1Frame)) {
            texture.add(
                enemy1Frame,
                0,
                (enemy1Index % (texture.source[0].width / tileWidth)) * tileWidth,
                Math.floor(enemy1Index / (texture.source[0].width / tileWidth)) * tileHeight,
                tileWidth,
                tileHeight
            );
        }

        const enemy2Index = 465;
        const enemy2Frame = '__enemy2__';
        if (!texture.has(enemy2Frame)) {
            texture.add(
                enemy2Frame,
                0,
                (enemy2Index % (texture.source[0].width / tileWidth)) * tileWidth,
                Math.floor(enemy2Index / (texture.source[0].width / tileWidth)) * tileHeight,
                tileWidth,
                tileHeight
            );
        }

        const enemy3Index = 418;
        const enemy3Frame = '__enemy3__';
        if (!texture.has(enemy3Frame)) {
            texture.add(
                enemy3Frame,
                0,
                (enemy3Index % (texture.source[0].width / tileWidth)) * tileWidth,
                Math.floor(enemy3Index / (texture.source[0].width / tileWidth)) * tileHeight,
                tileWidth,
                tileHeight
            );
        }

        const enemy4Index = 321;
        const enemy4Frame = '__enemy4__';
        if (!texture.has(enemy4Frame)) {
            texture.add(
                enemy4Frame,
                0,
                (enemy4Index % (texture.source[0].width / tileWidth)) * tileWidth,
                Math.floor(enemy4Index / (texture.source[0].width / tileWidth)) * tileHeight,
                tileWidth,
                tileHeight
            );
        }

        const enemy5Index = 410;
        const enemy5Frame = '__enemy5__';
        if (!texture.has(enemy5Frame)) {
            texture.add(
                enemy5Frame,
                0,
                (enemy5Index % (texture.source[0].width / tileWidth)) * tileWidth,
                Math.floor(enemy5Index / (texture.source[0].width / tileWidth)) * tileHeight,
                tileWidth,
                tileHeight
            );
        }

        const starIndex = 297;
        const starFrame = '__stair__';
        if (!texture.has(starFrame)) {
            texture.add(
                starFrame,
                0,
                (starIndex % (texture.source[0].width / tileWidth)) * tileWidth,
                Math.floor(starIndex / (texture.source[0].width / tileWidth)) * tileHeight,
                tileWidth,
                tileHeight
            );
        }

        this.doorLayer.setCollisionByExclusion([-1]); // leave this if you need

        // ADD THIS:
        this.doorLayer.setCollision(starIndex);
        
        this.doorLayer.forEachTile(tile => {
            tile.setCollision(false, false, false, false);
            tile.visible = false;  // optional: hide doors visually at start
        });

        

        this.enemyTypes = {
            Slug: {
                health: 3,
                speed: 20,
                frame: '__enemy__',
                hitbox: { width: 9, height: 8, offsetX: 1, offsetY: 3 }
            },
            Spout: {
                health: 3,
                speed: 10,
                frame: '__enemy1__',
                hitbox: { width: 9, height: 8, offsetX: 1, offsetY: 3 }
            },
            Gun: {
                health: 3,
                speed: 0,
                frame: '__enemy2__',
                hitbox: { width: tileWidth * 0.75, height: tileHeight * 0.6, offsetX: 0, offsetY: 0 }
            },
            Bat: {
                health: 1,
                speed: 50,
                frame: '__enemy3__',
                hitbox: { width: tileWidth * 0.75, height: tileHeight * 0.6, offsetX: 0, offsetY: 0 }
            },
            Ghost: {
                health: 5,
                speed: 15,
                frame: '__enemy4__',
                hitbox: { width: tileWidth * 0.75, height: tileHeight * 0.6, offsetX: 0, offsetY: 0 }
            },
            Boss: {
                health: 100,
                speed: 30,
                frame: '__enemy5__',
                hitbox: { width: tileWidth * 0.75, height: tileHeight * 0.8, offsetX: 0, offsetY: 1 }
            }
        };

        this.add.text(128, 472, 'WASD to move\n\n←↑→↓ to shoot', {
            fontSize: '8px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            resolution: 4,
        }).setOrigin(0.5);

        this.add.text(368, 472, 'Defeat the Boss\nto pass floor', {
            fontSize: '8px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            resolution: 4,
        }).setOrigin(0.5);

        this.add.text(848, 472, 'Defeat all enemies to\nprogress through rooms', {
            fontSize: '8px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            resolution: 4,
        }).setOrigin(0.5);

        this.player = this.physics.add.sprite(30, 504, 'transparenttilemap', frameName);
        this.stair = this.physics.add.image(2616, 504, 'transparenttilemap', starFrame);
        this.player.body.setSize(tileWidth * 0.75, tileHeight * 0.6);
        this.player.body.setOffset(tileWidth * 0.125, tileHeight * 0.35);
        this.physics.add.collider(this.player, this.obstacleLayer);
        this.physics.add.collider(this.player, this.behindLayer);
        this.physics.add.collider(this.player, this.doorLayer);
        this.physics.add.collider(this.player, this.doorLayer, this.checkForStair, null, this);


        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.roomWidth = 15 * 16;
        this.roomHeight = 9 * 16;

        const cam = this.cameras.main;
        cam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        cam.setZoom(6);
        this.snapCameraToPlayerRoom();

        this.projectiles = this.physics.add.group({
            defaultKey: 'transparenttilemap',
            defaultFrame: bulletFrame,
            maxSize: 30
        });

        this.enemyProjectiles = this.physics.add.group({
            defaultKey: 'transparenttilemap',
            defaultFrame: '__enemybullet__',
            maxSize: 20
        });

        this.physics.add.collider(this.projectiles, [this.obstacleLayer, this.doorLayer], (proj) => {
            // this.hitEmitter.explode(10, proj.x, proj.y);
            proj.destroy();
        });
        this.physics.add.collider(this.enemyProjectiles, [this.obstacleLayer, this.doorLayer], (proj) => {
            proj.destroy();
        });


        this.enemies = this.physics.add.group();

        this.physics.add.overlap(this.projectiles, this.enemies, (proj, enemy) => {
            this.EnemyHit.play()
            proj.destroy();
            enemy.health--;
            my.vfx.hit.emitParticleAt(enemy.x, enemy.y);
            if (enemy.health <= 0) {
                enemy.destroy();
                if (enemy.type === 'Boss') {
                    this.bossDefeated = true;
                }
                if (this.BossGrowl.isPlaying) {
                    this.BossGrowl.stop();
                }
                const anyGhostAlive = this.enemies.getChildren().some(e => e.active && e.type === 'Ghost' && e.health > 0);
                if (!anyGhostAlive && this.ghostWhisp.isPlaying) {
                    this.ghostWhisp.stop();
                }
                const anySlugAlive = this.enemies.getChildren().some(e => e.active && e.type === 'Slug' && e.health > 0);
                if (!anySlugAlive && this.slugMove.isPlaying) {
                    this.slugMove.stop();
                }


                const anyAlive = this.enemies.getChildren().some(e => e.active && e.health > 0);
                if (!anyAlive) {
                    this.roomLocked = false;
                    this.doorLayer.forEachTile(tile => {
                        if (tile.properties.collides) {
                            tile.visible = false;
                            tile.setCollision(false, false, false, false);
                        }
                    });
                    this.clearedRooms.add(`${this.currentRoom.x / this.roomWidth},${this.currentRoom.y / this.roomHeight}`);
                }
            }
        });

        this.physics.add.overlap(this.player, this.enemies, () => {
            //player and enemy overlapping
            this.takeDamage(1); 
        });
        this.physics.add.overlap(this.player, this.enemyProjectiles, (player, proj) => {
            //player and enemy projectile overlapping
            this.takeDamage(1);
            proj.destroy();
        });
        
        this.physics.add.overlap(this.player, this.stair, () => {
            if (this.bossDefeated) {
                this.scene.start('WinScene');
            }
        });

        this.clearedRooms = new Set();
        this.roomsWithEnemies = {
            '3,0': [
                { type: 'Spout', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 },
                { type: 'Spout', x: this.roomWidth / 2 - 64, y: this.roomHeight / 2 },
                { type: 'Slug', x: this.roomWidth / 2 + 16, y: this.roomHeight / 2 },
                { type: 'Slug', x: this.roomWidth / 2 - 16, y: this.roomHeight / 2 }
            ],
            '3,1': [
                { type: 'Spout', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 },
                { type: 'Spout', x: this.roomWidth / 2 - 64, y: this.roomHeight / 2 }
            ],
            '3,2': [
                { type: 'Slug', x: this.roomWidth / 2 + 48, y: this.roomHeight / 2 },
                { type: 'Slug', x: this.roomWidth / 2 - 48, y: this.roomHeight / 2 }
            ],
            '3,3': [
                { type: 'Slug', x: this.roomWidth / 2, y: this.roomHeight / 2 }
            ],
            '3,4': [
                { type: 'Slug', x: this.roomWidth / 2 + 32, y: this.roomHeight / 2 },
                { type: 'Slug', x: this.roomWidth / 2 - 32, y: this.roomHeight / 2 }
            ],
            '3,5': [
                { type: 'Spout', x: this.roomWidth / 2 + 16, y: this.roomHeight / 2 },
                { type: 'Spout', x: this.roomWidth / 2 - 16, y: this.roomHeight / 2 },
                { type: 'Slug', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 },
                { type: 'Slug', x: this.roomWidth / 2 - 64, y: this.roomHeight / 2 }
            ],
            '3,6': [
                { type: 'Slug', x: this.roomWidth / 2, y: this.roomHeight / 2 },
                { type: 'Slug', x: this.roomWidth / 2 + 32, y: this.roomHeight / 2 },
                { type: 'Slug', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 },
                { type: 'Slug', x: this.roomWidth / 2 - 32, y: this.roomHeight / 2 },
                { type: 'Slug', x: this.roomWidth / 2 - 64, y: this.roomHeight / 2 }
            ],
            '4,0': [
                { type: 'Spout', x: this.roomWidth / 2 - 32, y: this.roomHeight / 2 },
                { type: 'Spout', x: this.roomWidth / 2 + 32, y: this.roomHeight / 2 },
                { type: 'Ghost', x: this.roomWidth / 2, y: this.roomHeight / 2 }
            ],
            '4,1': [
                { type: 'Bat', x: this.roomWidth / 2 + 16, y: this.roomHeight / 2 },
                { type: 'Bat', x: this.roomWidth / 2 - 16, y: this.roomHeight / 2 }
            ],
            '4,2': [
                { type: 'Ghost', x: this.roomWidth / 2, y: this.roomHeight / 2 }
            ],
            '4,3': [
                { type: 'Ghost', x: this.roomWidth / 2, y: this.roomHeight / 2 },
                { type: 'Slug', x: this.roomWidth / 2 - 32, y: this.roomHeight / 2 },
                { type: 'Slug', x: this.roomWidth / 2 + 32, y: this.roomHeight / 2 }
            ],
            '4,4': [
                { type: 'Spout', x: this.roomWidth / 2, y: this.roomHeight / 2 }
            ],
            '4,5': [
                { type: 'Bat', x: this.roomWidth / 2 + 32, y: this.roomHeight / 2 },
                { type: 'Bat', x: this.roomWidth / 2 - 32, y: this.roomHeight / 2 },
                { type: 'Bat', x: this.roomWidth / 2, y: this.roomHeight / 2 + 16 }
            ],
            '4,6': [
                { type: 'Ghost', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 - 48 },
                { type: 'Ghost', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 + 48 },
                { type: 'Slug', x: this.roomWidth / 2, y: this.roomHeight / 2 }
            ],
            '5,0': [
                { type: 'Ghost', x: this.roomWidth / 2, y: this.roomHeight / 2},
                { type: 'Slug', x: this.roomWidth / 2 - 64, y: this.roomHeight / 2 + 16 },
                { type: 'Slug', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 - 16 }
            ],
            '5,1': [
                { type: 'Slug', x: this.roomWidth / 2, y: this.roomHeight / 2 + 16 },
                { type: 'Slug', x: this.roomWidth / 2, y: this.roomHeight / 2 + 16 },
                { type: 'Slug', x: this.roomWidth / 2 + 16, y: this.roomHeight / 2 },
                { type: 'Slug', x: this.roomWidth / 2 - 16, y: this.roomHeight / 2 },
                { type: 'Spout', x: this.roomWidth / 2 + 48, y: this.roomHeight / 2 },
                { type: 'Spout', x: this.roomWidth / 2 - 48, y: this.roomHeight / 2 }
            ],
            '5,2': [
                { type: 'Bat', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 + 32 },
                { type: 'Bat', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 - 32 },
                { type: 'Bat', x: this.roomWidth / 2 - 64, y: this.roomHeight / 2 + 32 },
                { type: 'Bat', x: this.roomWidth / 2 - 64, y: this.roomHeight / 2 - 32 },
                { type: 'Slug', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 + 48 },
                { type: 'Slug', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 - 48 },
                { type: 'Slug', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 + 48 },
                { type: 'Slug', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 - 48 }
            ],
            '5,3': [
                { type: 'Gun', x: this.roomWidth / 2, y: this.roomHeight / 2 },
                { type: 'Ghost', x: this.roomWidth / 2 + 16, y: this.roomHeight / 2 },
                { type: 'Ghost', x: this.roomWidth / 2 - 16, y: this.roomHeight / 2 }
            ],
            '5,4': [
                { type: 'Spout', x: this.roomWidth / 2, y: this.roomHeight / 2 },
                { type: 'Slug', x: this.roomWidth / 2 + 48, y: this.roomHeight / 2 + 16 },
                { type: 'Slug', x: this.roomWidth / 2 + 48, y: this.roomHeight / 2 - 16 },
                { type: 'Slug', x: this.roomWidth / 2 - 48, y: this.roomHeight / 2 + 16 },
                { type: 'Slug', x: this.roomWidth / 2 - 48, y: this.roomHeight / 2 - 16 }
            ],
            '5,5': [
                { type: 'Gun', x: this.roomWidth / 2, y: this.roomHeight / 2 - 32 },
                { type: 'Slug', x: this.roomWidth / 2 + 16, y: this.roomHeight / 2 - 32 },
                { type: 'Slug', x: this.roomWidth / 2 - 16, y: this.roomHeight / 2 - 32 },
                { type: 'Slug', x: this.roomWidth / 2 + 32, y: this.roomHeight / 2 - 16 },
                { type: 'Slug', x: this.roomWidth / 2 - 32, y: this.roomHeight / 2 - 16 }
            ],
            '5,6': [
                { type: 'Slug', x: this.roomWidth / 2 - 64, y: this.roomHeight / 2 - 32 },
                { type: 'Slug', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 - 32 },
                { type: 'Bat', x: this.roomWidth / 2, y: this.roomHeight / 2 + 16 }
            ],
            '6,0': [
                { type: 'Bat', x: this.roomWidth / 2 + 32, y: this.roomHeight / 2 + 32 },
                { type: 'Bat', x: this.roomWidth / 2 + 32, y: this.roomHeight / 2 - 32 },
                { type: 'Bat', x: this.roomWidth / 2 - 32, y: this.roomHeight / 2 + 32 },
                { type: 'Bat', x: this.roomWidth / 2 - 32, y: this.roomHeight / 2 - 32 }
            ],
            '6,1': [
                { type: 'Gun', x: this.roomWidth / 2, y: this.roomHeight / 2 },
                { type: 'Gun', x: this.roomWidth / 2 + 32, y: this.roomHeight / 2 },
                { type: 'Gun', x: this.roomWidth / 2 - 32, y: this.roomHeight / 2 },
                { type: 'Bat', x: this.roomWidth / 2 + 16, y: this.roomHeight / 2 },
                { type: 'Bat', x: this.roomWidth / 2 - 16, y: this.roomHeight / 2 }
            ],
            '6,2': [
                { type: 'Gun', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 + 48 },
                { type: 'Gun', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 - 48 },
                { type: 'Gun', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 + 48 },
                { type: 'Gun', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 - 48 }
            ],
            '6,3': [
                { type: 'Ghost', x: this.roomWidth / 2, y: this.roomHeight / 2 - 16 },
                { type: 'Spout', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 + 48 },
                { type: 'Spout', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 - 48 },
                { type: 'Spout', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 + 48 },
                { type: 'Spout', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 - 48 }
            ],
            '6,4': [
                { type: 'Ghost', x: this.roomWidth / 2, y: this.roomHeight / 2 },
                { type: 'Spout', x: this.roomWidth / 2 + 48, y: this.roomHeight / 2 + 16 },
                { type: 'Spout', x: this.roomWidth / 2 - 48, y: this.roomHeight / 2 - 16 }
            ],
            '6,5': [
                { type: 'Gun', x: this.roomWidth / 2 + 80, y: this.roomHeight / 2 },
                { type: 'Gun', x: this.roomWidth / 2 + 48, y: this.roomHeight / 2 + 16 },
                { type: 'Gun', x: this.roomWidth / 2 + 16, y: this.roomHeight / 2 + 32 },
                { type: 'Bat', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 + 32 },
                { type: 'Bat', x: this.roomWidth / 2 + 80, y: this.roomHeight / 2 + 48 }
            ],
            '6,6': [
                { type: 'Gun', x: this.roomWidth / 2 + 32, y: this.roomHeight / 2 },
                { type: 'Gun', x: this.roomWidth / 2 - 32, y: this.roomHeight / 2 },
                { type: 'Spout', x: this.roomWidth / 2, y: this.roomHeight / 2 },
                { type: 'Bat', x: this.roomWidth / 2, y: this.roomHeight / 2 + 48 },
                { type: 'Bat', x: this.roomWidth / 2, y: this.roomHeight / 2 - 48 }
                
            ],
            '7,0': [
                { type: 'Gun', x: this.roomWidth / 2, y: this.roomHeight / 2 + 32 },
                { type: 'Gun', x: this.roomWidth / 2, y: this.roomHeight / 2 - 32 },
                { type: 'Spout', x: this.roomWidth / 2, y: this.roomHeight / 2 },
                { type: 'Slug', x: this.roomWidth / 2 + 32, y: this.roomHeight / 2 },
                { type: 'Slug', x: this.roomWidth / 2 - 32, y: this.roomHeight / 2 }
            ],
            '7,1': [
                { type: 'Bat', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 - 48 },
                { type: 'Bat', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 + 48 },
                { type: 'Ghost', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 - 16 },
                { type: 'Ghost', x: this.roomWidth / 2 - 64, y: this.roomHeight / 2 + 16 },
                { type: 'Spout', x: this.roomWidth / 2 + 16, y: this.roomHeight / 2 },
                { type: 'Spout', x: this.roomWidth / 2 - 16, y: this.roomHeight / 2 }
            ],
            '7,2': [
                { type: 'Spout', x: this.roomWidth / 2 - 64, y: this.roomHeight / 2 },
                { type: 'Spout', x: this.roomWidth / 2, y: this.roomHeight / 2 + 32 }
            ],
            '7,3': [
                { type: 'Spout', x: this.roomWidth / 2 - 16, y: this.roomHeight / 2 },
                { type: 'Spout', x: this.roomWidth / 2 + 16, y: this.roomHeight / 2 },
                { type: 'Bat', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 + 48 },
                { type: 'Bat', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 - 48 },
                { type: 'Bat', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 + 48 },
                { type: 'Bat', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 - 48 }
            ],
            '7,4': [
                { type: 'Gun', x: this.roomWidth / 2, y: this.roomHeight / 2 },
                { type: 'Spout', x: this.roomWidth / 2, y: this.roomHeight / 2 + 48 },
                { type: 'Slug', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 + 48 },
                { type: 'Slug', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 - 48 },
                { type: 'Slug', x: this.roomWidth / 2 - 64, y: this.roomHeight / 2 + 48 },
                { type: 'Slug', x: this.roomWidth / 2 - 64, y: this.roomHeight / 2 - 48 }

            ],
            '7,5': [
                { type: 'Gun', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 + 16 },
                { type: 'Gun', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 - 16 },
                { type: 'Gun', x: this.roomWidth / 2 - 64, y: this.roomHeight / 2 + 16 },
                { type: 'Gun', x: this.roomWidth / 2 - 64, y: this.roomHeight / 2 - 16 },
                { type: 'Slug', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 + 48 },
                { type: 'Slug', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 - 48 },
                { type: 'Slug', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 + 48 },
                { type: 'Slug', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 - 48 }
            ],
            '7,6': [
                { type: 'Gun', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 - 48 },
                { type: 'Gun', x: this.roomWidth / 2 - 64, y: this.roomHeight / 2 - 48 },
                { type: 'Slug', x: this.roomWidth / 2 + 32, y: this.roomHeight / 2 },
                { type: 'Slug', x: this.roomWidth / 2 - 32, y: this.roomHeight / 2 },
                { type: 'Spout', x: this.roomWidth / 2, y: this.roomHeight / 2 },
                { type: 'Ghost', x: this.roomWidth / 2, y: this.roomHeight / 2 + 48 }
            ],
            '8,0': [
                { type: 'Ghost', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 - 48 },
                { type: 'Ghost', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 + 48 },
                { type: 'Gun', x: this.roomWidth / 2, y: this.roomHeight / 2 - 48 },
                { type: 'Spout', x: this.roomWidth / 2, y: this.roomHeight / 2 },
                { type: 'Bat', x: this.roomWidth / 2 + 16, y: this.roomHeight / 2 },
                { type: 'Bat', x: this.roomWidth / 2 - 16, y: this.roomHeight / 2 }
            ],
            '8,1': [
                { type: 'Gun', x: this.roomWidth / 2 + 16, y: this.roomHeight / 2 },
                { type: 'Gun', x: this.roomWidth / 2 - 16, y: this.roomHeight / 2 },
                { type: 'Ghost', x: this.roomWidth / 2, y: this.roomHeight / 2 },
                { type: 'Bat', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 },
                { type: 'Bat', x: this.roomWidth / 2 , y: this.roomHeight / 2 + 48 }
            ],
            '8,2': [
                { type: 'Gun', x: this.roomWidth / 2, y: this.roomHeight / 2 },
                { type: 'Gun', x: this.roomWidth / 2, y: this.roomHeight / 2 + 16 },
                { type: 'Gun', x: this.roomWidth / 2, y: this.roomHeight / 2 - 16 },
                { type: 'Slug', x: this.roomWidth / 2 + 16, y: this.roomHeight / 2 },
                { type: 'Slug', x: this.roomWidth / 2 - 16, y: this.roomHeight / 2 }
            ],
            '8,3': [
                { type: 'Gun', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 },
                { type: 'Gun', x: this.roomWidth / 2 - 64, y: this.roomHeight / 2 },
                { type: 'Spout', x: this.roomWidth / 2, y: this.roomHeight / 2 - 16 },
                { type: 'Bat', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 + 48 },
                { type: 'Bat', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 - 48 },
                { type: 'Bat', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 + 48 },
                { type: 'Bat', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 - 48 }
            ],
            '8,4': [
                { type: 'Gun', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 - 32 },
                { type: 'Gun', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 + 32 },
                { type: 'Gun', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 },
                { type: 'Spout', x: this.roomWidth / 2, y: this.roomHeight / 2 }
            ],
            '8,5': [
                { type: 'Ghost', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 },
                { type: 'Spout', x: this.roomWidth / 2 + 48, y: this.roomHeight / 2 + 48 },
                { type: 'Spout', x: this.roomWidth / 2 + 48, y: this.roomHeight / 2 - 48 },
                { type: 'Spout', x: this.roomWidth / 2 - 48, y: this.roomHeight / 2 + 48 },
                { type: 'Spout', x: this.roomWidth / 2 - 48, y: this.roomHeight / 2 - 48 }
            ],
            '8,6': [
                { type: 'Ghost', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 - 48 },
                { type: 'Ghost', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 + 48 },
                { type: 'Spout', x: this.roomWidth / 2, y: this.roomHeight / 2 },
                { type: 'Spout', x: this.roomWidth / 2 - 32, y: this.roomHeight / 2 - 32 },
                { type: 'Spout', x: this.roomWidth / 2 + 32, y: this.roomHeight / 2 + 32 }
            ],
            '9,0': [
                { type: 'Gun', x: this.roomWidth / 2 + 80, y: this.roomHeight / 2 - 32 },
                { type: 'Gun', x: this.roomWidth / 2 - 80, y: this.roomHeight / 2 - 32 },
                { type: 'Spout', x: this.roomWidth / 2, y: this.roomHeight / 2 - 32 },
                { type: 'Spout', x: this.roomWidth / 2 - 16, y: this.roomHeight / 2 - 32 },
                { type: 'Spout', x: this.roomWidth / 2 + 16, y: this.roomHeight / 2 - 32 },
                { type: 'Ghost', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 }
            ],
            '9,1': [
                { type: 'Spout', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 + 32 },
                { type: 'Spout', x: this.roomWidth / 2 - 64, y: this.roomHeight / 2 - 32 },
                { type: 'Gun', x: this.roomWidth / 2, y: this.roomHeight / 2 },
                { type: 'Ghost', x: this.roomWidth / 2 + 32, y: this.roomHeight / 2 + 16 },
                { type: 'Ghost', x: this.roomWidth / 2 - 32, y: this.roomHeight / 2 - 16 }

            ],
            '9,2': [
                { type: 'Slug', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 - 16 },
                { type: 'Slug', x: this.roomWidth / 2 + 80, y: this.roomHeight / 2 - 16 },
                { type: 'Slug', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 - 16 },
                { type: 'Slug', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 - 32 },
                { type: 'Slug', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 - 48 },
                { type: 'Spout', x: this.roomWidth / 2 + 80, y: this.roomHeight / 2 - 32 },
                { type: 'Spout', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 - 32 }
            ],
            '9,3': [
                { type: 'Spout', x: this.roomWidth / 2 - 32, y: this.roomHeight / 2 },
                { type: 'Gun', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 },
                { type: 'Ghost', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 + 48 },
                { type: 'Ghost', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 - 48 }
            ],
            '9,4': [
                { type: 'Gun', x: this.roomWidth / 2 + 80, y: this.roomHeight / 2 },
                { type: 'Gun', x: this.roomWidth / 2 - 80, y: this.roomHeight / 2 },
                { type: 'Bat', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 + 48 },
                { type: 'Bat', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 - 48 },
                { type: 'Bat', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 + 48 },
                { type: 'Bat', x: this.roomWidth / 2 - 96, y: this.roomHeight / 2 - 48 },
                { type: 'Slug', x: this.roomWidth / 2, y: this.roomHeight / 2 },
            ],
            '9,5': [
                { type: 'Slug', x: this.roomWidth / 2 + 48, y: this.roomHeight / 2 + 48 },
                { type: 'Slug', x: this.roomWidth / 2 + 48, y: this.roomHeight / 2 - 48 },
                { type: 'Slug', x: this.roomWidth / 2 - 48, y: this.roomHeight / 2 + 48 },
                { type: 'Slug', x: this.roomWidth / 2 - 48, y: this.roomHeight / 2 - 48 },
                { type: 'Slug', x: this.roomWidth / 2, y: this.roomHeight / 2 }
            ],
            '9,6': [
                { type: 'Gun', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 + 48 },
                { type: 'Gun', x: this.roomWidth / 2 + 96, y: this.roomHeight / 2 - 48 },
                { type: 'Spout', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 },

            ],
            '10,3': [
                { type: 'Boss', x: this.roomWidth / 2 + 64, y: this.roomHeight / 2 },
            ]
        };
        this.roomLocked = false;
        this.currentRoom = { x: 0, y: 0 };

        this.spawnEnemiesInRoom(this.currentRoom.x, this.currentRoom.y);

        this.easystar = new EasyStar.js();
        this.easystarBat = new EasyStar.js();

        const grid = [];
        const batGrid = [];

        for (let y = 0; y < this.map.height; y++) {
            const row = [];
            const batRow = [];
            for (let x = 0; x < this.map.width; x++) {
                const obstacleTile = this.obstacleLayer.getTileAt(x, y);
                const behindTile = this.behindLayer.getTileAt(x, y);
                const isLowTile = (obstacleTile && obstacleTile.properties.low) || (behindTile && behindTile.properties.low);
                const isCollidingGround = (obstacleTile && obstacleTile.properties.collides) || (behindTile && behindTile.properties.collides);
                row.push(isCollidingGround ? 1 : 0);
                const isCollidingBatOnlyObstacle = (obstacleTile && obstacleTile.properties.collides && !isLowTile) || (behindTile && behindTile.properties.collides && !isLowTile);
                batRow.push(isCollidingBatOnlyObstacle ? 1 : 0);
            }
            grid.push(row);
            batGrid.push(batRow);
        }

        this.easystar.setGrid(grid);
        this.easystar.setAcceptableTiles([0]);
        this.easystar.enableDiagonals();
        this.easystar.disableCornerCutting();

        this.easystarBat.setGrid(batGrid);
        this.easystarBat.setAcceptableTiles([0]);
        this.easystarBat.enableDiagonals();
        this.easystarBat.disableCornerCutting();
    }

    update() {
        const speed = 90;
        const player = this.player;
        const keys = this.keys;

        if (this.isCameraPanning) {
            player.setVelocity(0, 0);
            return;
        }

        let vx = 0;
        let vy = 0;

        if (keys.left.isDown) vx = -1;
        else if (keys.right.isDown) vx = 1;

        if (keys.up.isDown) vy = -1;
        else if (keys.down.isDown) vy = 1;

        const length = Math.hypot(vx, vy);
        if (length > 0) {
            vx = (vx / length) * speed;
            vy = (vy / length) * speed;
        }

        player.setVelocity(vx, vy);

        if (length > 0) {
            if (!this.playerFoot.isPlaying) {
                this.playerFoot.play();
            }
        } else {
            if (this.playerFoot.isPlaying) {
                this.playerFoot.stop();
            }
        }

        const newRoomX = Math.floor(this.player.x / this.roomWidth) * this.roomWidth;
        const newRoomY = Math.floor(this.player.y / this.roomHeight) * this.roomHeight;

        if (this.roomLocked) {
            this.player.x = Phaser.Math.Clamp(this.player.x, this.currentRoom.x, this.currentRoom.x + this.roomWidth - 1);
            this.player.y = Phaser.Math.Clamp(this.player.y, this.currentRoom.y, this.currentRoom.y + this.roomHeight - 1);
        }

        if (newRoomX !== this.currentRoom.x || newRoomY !== this.currentRoom.y) {
            if (!this.roomLocked) {
                this.isCameraPanning = true;
                this.currentRoom = { x: newRoomX, y: newRoomY };
                this.spawnEnemiesInRoom(newRoomX, newRoomY);

                this.cameras.main.pan(
                    newRoomX + this.roomWidth / 2,
                    newRoomY + this.roomHeight / 2,
                    500,
                    'Power2',
                    false,
                    (camera, progress) => {
                        if (progress === 1) {
                            this.isCameraPanning = false;
                        }
                    }
                );
            } else {
                this.player.x = Phaser.Math.Clamp(this.player.x, this.currentRoom.x, this.currentRoom.x + this.roomWidth - 1);
                this.player.y = Phaser.Math.Clamp(this.player.y, this.currentRoom.y, this.currentRoom.y + this.roomHeight - 1);
            }
        }

        if (this.roomLocked) {
        this.enemies.getChildren().forEach(enemy => {
            if (!enemy.active) return;

            if (enemy.type === 'Boss') {
                const now = this.time.now;

                if (enemy.health <= enemy.maxHealth * 0.66 && enemy.state === 'phase1') {
                    enemy.state = 'phase2';
                    enemy.body.setVelocity(0,0);
                } else if (enemy.health <= enemy.maxHealth * 0.33 && enemy.state === 'phase2') {
                    enemy.state = 'phase3';
                }

                switch (enemy.state) {
                    case 'phase1':
                        if (!this.BossGrowl.isPlaying) {
                            this.BossGrowl.play();
                        }
                        this.BossMovement(enemy);
                        break;

                    case 'phase2':
                        if (!enemy.isPositioned) {
                            const roomCenterX = this.currentRoom.x + this.roomWidth / 2;
                            const roomCenterY = this.currentRoom.y + this.roomHeight / 2;
                            const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, roomCenterX, roomCenterY);

                            if (distance > 5) {
                                this.physics.moveTo(enemy, roomCenterX, roomCenterY, enemy.speed * 1.5);
                            } else {
                                enemy.body.reset(roomCenterX, roomCenterY);
                                enemy.isPositioned = true;
                            }
                        } else {
                            this.EightWayShot(enemy, now, 2000);
                            this.TripleShotAttack(enemy, now, 1500);
                        }
                        break;

                    case 'phase3':
                        this.BossMovement(enemy);
                        this.EightWayShot(enemy, now, 1500);
                        this.TripleShotAttack(enemy, now, 1000);
                        break;
                }

            } else if (enemy.type === 'Ghost') {
                    const dx = this.player.x - enemy.x;
                    const dy = this.player.y - enemy.y;
                    const distance = Math.hypot(dx, dy);

                    if (distance > 0) {
                        const speed = enemy.speed;
                        const vx = (dx / distance) * speed;
                        const vy = (dy / distance) * speed;
                        enemy.body.setVelocity(vx, vy);
                    } else {
                        enemy.body.setVelocity(0, 0);
                    }
                } else if (enemy.type === 'Bat') {
                    if (!enemy.pathTimer || this.time.now - enemy.pathTimer > 500) {
                        const enemyTileX = Math.floor(enemy.x / 16);
                        const enemyTileY = Math.floor(enemy.y / 16);
                        const playerTileX = Math.floor(this.player.x / 16);
                        const playerTileY = Math.floor(this.player.y / 16);

                        this.easystarBat.findPath(enemyTileX, enemyTileY, playerTileX, playerTileY, path => {
                            if (path && path.length > 1) {
                                const next = path[1];
                                const targetX = next.x * 16 + 8;
                                const targetY = next.y * 16 + 8;

                                const dx = targetX - enemy.x;
                                const dy = targetY - enemy.y;
                                const dist = Math.hypot(dx, dy);
                                const speed = enemy.speed;

                                if (dist > 1) {
                                    enemy.setVelocity((dx / dist) * speed, (dy / dist) * speed);
                                } 
                                
                                else {
                                    enemy.setVelocity(0, 0);
                                }
                            } 
                            
                            else {
                                enemy.setVelocity(0, 0);
                            }
                        });

                        if (!this.batSqueek.isPlaying) {
                            this.batSqueek.play();
                        }

                        this.easystarBat.calculate();
                        enemy.pathTimer = this.time.now;
                    }
                }
                else {
                    if (!enemy.pathTimer || this.time.now - enemy.pathTimer > 500) {
                        const enemyTileX = Math.floor(enemy.x / 16);
                        const enemyTileY = Math.floor(enemy.y / 16);
                        const playerTileX = Math.floor(this.player.x / 16);
                        const playerTileY = Math.floor(this.player.y / 16);

                        this.easystar.findPath(enemyTileX, enemyTileY, playerTileX, playerTileY, path => {
                            if (path && path.length > 1) {
                                const next = path[1];
                                const targetX = next.x * 16 + 8;
                                const targetY = next.y * 16 + 8;

                                const dx = targetX - enemy.x;
                                const dy = targetY - enemy.y;
                                const dist = Math.hypot(dx, dy);
                                const speed = enemy.speed;

                                if (dist > 1) {
                                    enemy.setVelocity((dx / dist) * speed, (dy / dist) * speed);
                                    if (enemy.type === 'Slug') {
                                        if (!this.slugMove.isPlaying) {
                                            this.slugMove.play();
                                        }
                                    }

                                } else {
                                    enemy.setVelocity(0, 0);
                                }
                            } else {
                                enemy.setVelocity(0, 0);
                            }
                        });
                        this.easystar.calculate();
                        enemy.pathTimer = this.time.now;
                    }
                }
            });
        } else {
            this.enemies.getChildren().forEach(enemy => enemy.setVelocity(0, 0));
        }
        
        const now = this.time.now;
        let dx = 0;
        let dy = 0;

        if (this.cursors.left.isDown) dx -= 1;
        if (this.cursors.right.isDown) dx += 1;
        if (this.cursors.up.isDown) dy -= 1;
        if (this.cursors.down.isDown) dy += 1;

        if ((dx !== 0 || dy !== 0) && now - this.lastShotTime > this.shootCooldown) {
            const length = Math.hypot(dx, dy);
            if (length !== 0) {
                dx /= length;
                dy /= length;
            }
            this.fireProjectile(dx, dy);
            this.lastShotTime = now;
        }

        this.enemies.getChildren().forEach(enemy => {
            if (!enemy.active || !enemy.isSpout) return;

            const now = this.time.now;
            const cooldown = Phaser.Math.Between(1800, 2200);

            if (now - enemy.lastShotTime >= cooldown) {
                if (enemy.lastPatternDiagonal === undefined) {
                    enemy.lastPatternDiagonal = true;
                }

                const diagonalDirs = [
                    { dx: 1, dy: 1 },
                    { dx: -1, dy: 1 },
                    { dx: 1, dy: -1 },
                    { dx: -1, dy: -1 }
                ];

                const plusDirs = [
                    { dx: 0, dy: -1 },
                    { dx: 0, dy: 1 },
                    { dx: -1, dy: 0 },
                    { dx: 1, dy: 0 }
                ];

                const pattern = enemy.lastPatternDiagonal ? diagonalDirs : plusDirs;
                pattern.forEach(({ dx, dy }) => {
                    const offset = 10;
                    const proj = this.enemyProjectiles.get(enemy.x + dx * offset, enemy.y + dy * offset);
                    if (!proj) return;

                    proj.setActive(true);
                    proj.setVisible(true);
                    proj.body.setAllowGravity(false);
                    proj.setVelocity(dx * 50, dy * 50);
                    proj.setScale(0.3);
                    proj.body.setSize(8, 8);
                    proj.body.setOffset((proj.width * 0.5) / 2, (proj.height * 0.5) / 2);
                });

                this.bugshot.play();
                enemy.lastPatternDiagonal = !enemy.lastPatternDiagonal;
                enemy.lastShotTime = now;
            }
        });

        this.enemies.getChildren().forEach(enemy => {
            if (!enemy.active || !enemy.isGun) return;

            const now = this.time.now;
            const cooldown = Phaser.Math.Between(1800, 2200);
            if (now - enemy.lastShotTime >= cooldown) {
                const dx = this.player.x - enemy.x;
                const dy = this.player.y - enemy.y;
                const length = Math.hypot(dx, dy);

                if (length !== 0) {
                    const normX = dx / length;
                    const normY = dy / length;

                    const offset = 10;
                    const proj = this.enemyProjectiles.get(enemy.x + normX * offset, enemy.y + normY * offset);
                    if (proj) {
                        proj.setActive(true);
                        proj.setVisible(true);
                        proj.body.setAllowGravity(false);
                        proj.setVelocity(normX * 90, normY * 90);
                        proj.setScale(0.3);
                        proj.body.setSize(8, 8);
                        proj.body.setOffset((proj.width * 0.5) / 2, (proj.height * 0.5) / 2);
                        this.cyclopSeye.play();
                    }
                }

                enemy.lastShotTime = now;
            }
        });
    }

    checkForStair(_player, tile) {
        if (tile.index === 297) {  // stair tile index
            this.scene.start('WinScene');
        }
    }

    snapCameraToPlayerRoom() {
        const cam = this.cameras.main;
        const roomX = Math.floor(this.player.x / this.roomWidth) * this.roomWidth;
        const roomY = Math.floor(this.player.y / this.roomHeight) * this.roomHeight;
        cam.centerOn(roomX + this.roomWidth / 2, roomY + this.roomHeight / 2);
        this.currentRoom = { x: roomX, y: roomY };
    }

    fireProjectile(dx, dy) {
        const offset = 10;
        const proj = this.projectiles.get(this.player.x + dx * offset, this.player.y + dy * offset);
        if (!proj) return;

        proj.setActive(true);
        proj.setVisible(true);
        proj.body.setAllowGravity(false);
        proj.setVelocity(dx * 150, dy * 150);
        proj.setScale(0.6);
        proj.body.setSize(8, 8);
        proj.body.setOffset((proj.width * 0.5) / 2, (proj.height * 0.5) / 2);
        this.shootSound.play();

    }    

    BossMovement(enemy) {
        const dx = this.player.x - enemy.x;
        const dy = this.player.y - enemy.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 1) {
            const speed = enemy.speed;
            const vx = (dx / distance) * speed;
            const vy = (dy / distance) * speed;
            enemy.body.setVelocity(vx, vy);
        } else {
            enemy.body.setVelocity(0, 0);
        }
    }

    EightWayShot(enemy, now, cooldown) {
        if (now - enemy.lastEightWayShot >= cooldown) {
            const eightDirs = [
                { dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
                { dx: 1, dy: 1 }, { dx: -1, dy: 1 }, { dx: 1, dy: -1 }, { dx: -1, dy: -1 }
            ];

            eightDirs.forEach(({ dx, dy }) => {
                const speed = 70;
                const proj = this.enemyProjectiles.get(enemy.x, enemy.y);
                if (!proj) return;
                proj.setActive(true).setVisible(true).body.setAllowGravity(false);
                proj.setVelocity(dx * speed, dy * speed);
                proj.setScale(0.3).body.setSize(8, 8);
            });
            enemy.lastEightWayShot = now;
        }
    }

    TripleShotAttack(enemy, now, cooldown) {
        if (now - enemy.lastTripleShot >= cooldown) {
            const baseAngle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
            const angles = [baseAngle - 0.2, baseAngle, baseAngle + 0.2];

            angles.forEach(angle => {
                const speed = 90;
                const proj = this.enemyProjectiles.get(enemy.x, enemy.y);
                if (!proj) return;
                proj.setActive(true).setVisible(true).body.setAllowGravity(false);
                this.physics.velocityFromRotation(angle, speed, proj.body.velocity);
                proj.setScale(0.3).body.setSize(8, 8);
            });
            enemy.lastTripleShot = now;
        }
    }
    
    updateHealthDisplay() {
        this.healthText.setText(`Health: ${this.currentHealth / 2} Hearts`);
    }

    takeDamage = (amount) => {
        const now = this.time.now;
        if (now - this.lastDamageTime < 1000) return; // 1 second invincibility
        this.currentHealth -= amount;
        this.updateHealthDisplay();
        this.lastDamageTime = now;
        if (this.currentHealth <= 0) {
            this.scene.restart(); // restart the game when you die
        }
    }

  
    
    

    spawnEnemiesInRoom(roomX, roomY) {
        this.enemies.clear(true, true);

        const key = `${roomX / this.roomWidth},${roomY / this.roomHeight}`;
        console.log("Spawning enemies in room:", key);

        if (this.clearedRooms.has(key)) {
            console.log("Room already cleared:", key);
            this.roomLocked = false;
            this.doorLayer.setCollisionByProperty({ collides: false });
            return;
        }
        const enemyPositions = this.roomsWithEnemies[key];
        console.log("Enemy positions:", enemyPositions);

        if (enemyPositions && enemyPositions.length > 0) {
            enemyPositions.forEach(pos => {
                const type = pos.type || 'basic';
                const config = this.enemyTypes[type];

                const enemy = this.enemies.create(roomX + pos.x, roomY + pos.y, 'transparenttilemap', config.frame);
                enemy.health = config.health;
                enemy.speed = config.speed;
                enemy.type = type;

                if (type === 'Slug') {
                    this.physics.add.collider(enemy, this.obstacleLayer);
                    this.physics.add.collider(enemy, this.behindLayer);
                }

                if (type === 'Boss') {
                    enemy.setScale(2);
                    enemy.state = 'phase1';
                    enemy.maxHealth = config.health;
                    enemy.isPositioned = false;
                    enemy.lastEightWayShot = 0;
                    enemy.lastTripleShot = 0;
                }

                if (type === 'Spout') {
                    this.physics.add.collider(enemy, this.obstacleLayer);
                    this.physics.add.collider(enemy, this.behindLayer);
                    enemy.lastShotTime = this.time.now;
                    enemy.isSpout = true;
                }

                if (type === 'Gun') {
                    this.physics.add.collider(enemy, this.obstacleLayer);
                    this.physics.add.collider(enemy, this.behindLayer);
                    enemy.lastShotTime = this.time.now;
                    enemy.isGun = true;
                }

                if (type === 'Bug') {
                    this.physics.add.collider(enemy, this.obstacleLayer);
                }

                if (type == 'Ghost') {
                    if (!this.ghostWhisp.isPlaying) {
                        this.ghostWhisp.play();
                    }
                }

                if (type == 'Boss') {
                    enemy.setScale(2);
                }

                enemy.body.setSize(config.hitbox.width, config.hitbox.height);
                enemy.body.setOffset(
                    (enemy.width - config.hitbox.width) / 2 + config.hitbox.offsetX,
                    (enemy.height - config.hitbox.height) / 2 + config.hitbox.offsetY
                );

                
            });

            const margin = 20;
            const px = this.player.x;
            const py = this.player.y;
            const rx = roomX;
            const ry = roomY;
            const rw = this.roomWidth;
            const rh = this.roomHeight;

            const fromLeft = px < rx + 4;
            const fromRight = px > rx + rw - 4;
            const fromTop = py < ry + 4;
            const fromBottom = py > ry + rh - 4;

            if (fromLeft) {
                this.player.x = rx + margin;
            } else if (fromRight) {
                this.player.x = rx + rw - margin;
            }

            if (fromTop) {
                this.player.y = ry + margin;
            } else if (fromBottom) {
                this.player.y = ry + rh - margin;
            }
            this.time.delayedCall(150, () => {
                this.roomLocked = true;
                this.doorLayer.forEachTile(tile => {
                    if (tile.properties.collides) {
                        tile.visible = true;
                    }
                });
                this.doorLayer.setCollisionByProperty({ collides: true });
                console.log("Room locked:", key);
            });
        } else {
            this.roomLocked = false;
            this.doorLayer.setCollisionByProperty({ collides: false });
        }
    }
}


//COMMENT SECTION: FOR DYLAN
// Here is the todo list:
// - Health system: player has three hearts or six lives to start out and can gain more through powerups. 
// add a text that stays with the camera in order for the player to know. or you can put it aboe the player's head.
// or you can use the tiles to make a HUD that shows 3 hearts(full heart, half heart, empty). Use the transparent tileset

// - powerups: we dont need to make the player choose powerups anymore. You can either make it so enemies have a chance to drop powerups
// or the player automatically gains them after clearing a certain amount of rooms.

// - Different powerups could be an increase to max health, firing speed, walking speed, a double shot, or triple shot.
// you can try adding skills like a dash/dodge/roll if you want to be as cool as fortnite gaming but you dont have to.
// Try to make it random and if you do add a new skill, make sure to add to the text in the beginning of the game to say controls
// also the game is kinda hard so try out the game to feel what the max max health the player can get to. like 6 or more hearts.

// - End game: once the player defeats the boss make it so they can interact with that stair tile so leave/ end the game.
// you can make a new scene as the win screen and allow the player to replay the game.

// - animations: you dont have to do much. Just make it so enemy sprites are facing the player because currently they only look one direction
// can also give enemies other animations if you want like different frames


