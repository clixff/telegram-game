import * as PIXI from 'pixi.js';
import { GameInstance } from '../core/GameInstance';
import { lerp, rgbToHex } from '../math/math';
import { Actor } from '../scene/actors/Actor';

export class SkyLightActor extends Actor
{
    lightColor = [ 0.964, 0.925, 0.819 ];
    minColor = [ 0.2, 0.185, 0.25 ];

    private _lightIntensity = 1;

    get lightIntensity()
    {
        return this._lightIntensity;
    }

    constructor()
    {
        super();

        this.setLightIntensity(1);
    }

    tick(deltaTime: number)
    {
        super.tick(deltaTime);
    }

    setLightIntensity(newIntensity: number)
    {
        this._lightIntensity = newIntensity;

        this.updateLight();
    }

    updateLight()
    {
        const newLightColor = [
            lerp(this.minColor[0], this.lightColor[0], this._lightIntensity),
            lerp(this.minColor[1], this.lightColor[1], this._lightIntensity),
            lerp(this.minColor[2], this.lightColor[2], this._lightIntensity)
        ];

        const gameInstance = GameInstance.Get();

        if (!gameInstance)
        {
            return;
        }
        
        const app = gameInstance.getApp();

        const renderer = (app.renderer as PIXI.Renderer);
        const isWebGL = renderer.type === PIXI.RENDERER_TYPE.WEBGL;

        if (isWebGL)
        {
            renderer.globalUniforms.uniforms.globalLight = new Float32Array(newLightColor);
        }
    }
}