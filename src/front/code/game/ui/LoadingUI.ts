import { Text, TextStyle } from "pixi.js";
import { GameInstance } from "../../engine/core/GameInstance";
import { UIScene } from "../../engine/ui/UIScene";

export class LoadingUI extends UIScene
{
    textComponent: Text;
    constructor()
    {
        super();

        const textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontWeight: '600',
            fill: '#ffffff',
            align: 'center'
        });

        this.textComponent = new Text('Loading..', textStyle);

        const gameInstance = GameInstance.Get();

        if (!gameInstance)
        {
            return;
        }

        const width = gameInstance.getWidth();
        const height = gameInstance.getHeight();

        this.position.set(width / 2, height / 2);

        this.textComponent.anchor.set(0.5);

        this.addChild(this.textComponent);
    }

    updateText(progress: number): void
    {
        this.textComponent.text = `Loading... ${Math.floor(progress * 100)}%`;
    }

}