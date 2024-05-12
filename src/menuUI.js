import { AdvancedDynamicTexture, StackPanel, Button } from "@babylonjs/gui";

class MenuUI {
    game;
    screenUI;
    engine;
    loadingScreenDisplayed = true;

    constructor(game, engine) {
        this.game = game;
        this.engine = engine;
    }

    displayLoadingUI(loadingText = "Game is loading, please wait...") {
        if (!this.loadingScreenDisplayed) {
            this.engine.loadingUIText = loadingText;
            this.engine.loadingUIBackgroundColor = "blue";
            this.engine.displayLoadingUI();
            this.loadingScreenDisplayed = true;
        }
    }

    hideLoadingUI() {
        if (this.loadingScreenDisplayed) {
            this.engine.hideLoadingUI();
            this.loadingScreenDisplayed = false;
        }
    }

    loadUI() {
        this.screenUI = AdvancedDynamicTexture.CreateFullscreenUI("menuUI");
        const menuPanel = new StackPanel();
        menuPanel.horizontalAlignment = StackPanel.HORIZONTAL_ALIGNMENT_CENTER;
        menuPanel.verticalAlignment = StackPanel.VERTICAL_ALIGNMENT_CENTER;
        this.screenUI.addControl(menuPanel);

        this.addButton(menuPanel, "Play", () => {
            console.log("Play button clicked!");
            this.hideLoadingUI();
            this.game.start();
            this.screenUI.dispose();
        });

        this.addButton(menuPanel, "View HighScore", () => {
            console.log("Viewing high scores...");
            let highScores = localStorage.getItem("highScores");
            highScores = highScores ? JSON.parse(highScores) : [];
            alert("High Scores:\n" + highScores.join("\n"));
        });

        this.addButton(menuPanel, "Settings", () => {
            console.log("Settings clicked...");
            alert("Settings page under construction.");
        });
    }
    addButton(menuPanel, text, callback) {
        const button = Button.CreateSimpleButton("button_" + text, text);
        button.width = "200px";
        button.height = "40px";
        button.color = "white";
        button.background = "green";
        button.paddingTop = "10px";
        button.onPointerUpObservable.add(callback);
        menuPanel.addControl(button);
    }

    async init() {
        this.displayLoadingUI();
        await this.game.createScene();
        this.loadUI();
    }
}

export default MenuUI;
