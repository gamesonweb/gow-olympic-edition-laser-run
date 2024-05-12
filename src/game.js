import { BoundingInfo, Color3, Color4, DefaultRenderingPipeline, FreeCamera, HemisphericLight, KeyboardEventTypes, MeshBuilder, MotionBlurPostProcess, Scalar, Scene, SceneLoader, Sound, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";


import joueur from "../assets/models/man.glb";
import gun from "../assets/models/Pistol.glb";


import stade from "../assets/models/Arena.glb";



import musicUrl from "../assets/musics/Cyberpunk Moonlight Sonata v2.mp3";
import hitSoundUrl from "../assets/sounds/344033__reitanna__cute-impact.wav";
import { AdvancedDynamicTexture, Button, TextBlock } from "@babylonjs/gui";
import MenuUI from "./menuUI";

class Game {

    engine;
    canvas;
    scene;

    #menuUI;
    #gameUI;

    startTimer;

    player;

    constructor(engine, canvas) {
        this.engine = engine;
        this.canvas = canvas;
    }

    async init() {
        this.#menuUI = new MenuUI(this, this.engine);
        await this.#menuUI.init();
    }

    async importModel(modelUrl, scene) {
        try {
            return await SceneLoader.ImportMeshAsync("", "", modelUrl, scene, (event) => {
                let loadedPercent = (event.loaded / event.total) * 100;
                this.engine.loadingUIText = `Loading: ${loadedPercent.toFixed(2)}%`;
            });
        } catch (error) {
            this.engine.loadingUIText = "Error loading assets!";
            console.error("Failed to load model:", modelUrl, error);
            // Optionally, add retry logic here
        }
    }




    start() {

        this.startTimer = 0;
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    async createScene() {
        this.scene = new Scene(this.engine);
        this.camera = new FreeCamera("camera1", new Vector3(0, 3.8, 0), this.scene);
        this.camera.setTarget(new Vector3(0, 3, 3));
        this.camera.attachControl(this.canvas, true);
        var light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;

        MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, this.scene)


        let man = await SceneLoader.ImportMeshAsync("", "", joueur, this.scene);
        let pistol = await SceneLoader.ImportMeshAsync("", "", gun, this.scene);
        let stad = await SceneLoader.ImportMeshAsync("", "", stade, this.scene);

        //Position pistol
        pistol.meshes[0].position = new Vector3(-0.1, 1.5, 6.5);
        pistol.meshes[0].scaling = new Vector3(0.2,0.2,0.2);
        pistol.meshes[0].rotation = new Vector3(0, -1, 0);

        // Set the target of the camera to the first imported mesh
        this.player = man.meshes[0];
        man.meshes[0].name = "Player";
        man.meshes[0].scaling = new Vector3(1, 1, 1);
        man.meshes[0].position.set(0, 0.1 / 2, 6);
        man.meshes[0].rotation = new Vector3(0, 0, 0);
        man.animationGroups[0].stop();
        man.animationGroups[1].play(true);
    }
    async createTarget(scene) {
        const invisibleSphere = MeshBuilder.CreateSphere("target", { diameter: 1 }, scene);
        invisibleSphere.material = new StandardMaterial("sphereMaterial", scene);
        invisibleSphere.material.alpha = 0;
        invisibleSphere.isVisible = true;  // Ajuster selon le besoin de visibilité
        invisibleSphere.isPickable = true;

        let { meshes } = await SceneLoader.ImportMeshAsync("", "assets/models/", "targetnews.glb", scene);
        let targetModel = meshes[0];
        targetModel.parent = invisibleSphere;
        targetModel.position = new Vector3(0, 0, 0);
        targetModel.scaling = new Vector3(0.1, 0.14, 0.14);

        this.resetTargetPosition(invisibleSphere, scene);
        return invisibleSphere;
    }

    resetTargetPosition(target, scene) {
        const distance = 15;
        const forwardPosition = this.camera.getFrontPosition(distance);
        const offsetX = (Math.random() - 0.5) * 5;
        const offsetY = (Math.random() - 0.5) * 4;
        const offsetZ = (Math.random() - 0.5) * 4;
        target.position = new Vector3(forwardPosition.x + offsetX, forwardPosition.y + offsetY, forwardPosition.z + offsetZ);
    }


}

export default Game;