import { GameInstance } from "../../engine/core/GameInstance";
import { SkyLightActor } from "../../engine/light/SkyLight";
import { clamp } from "../../engine/math/math";
import { CurveFloat } from "../../engine/misc/Curve";
import { Actor } from "../../engine/scene/actors/Actor";
import { EBiomeType } from "../world/WorldData";

export class DayTimeActor extends Actor
{
    skyLightActorRef: SkyLightActor | null = null;
    elapsedSeconds = 0.0;
    lightIntensityCurve: CurveFloat;
    maxDaySeconds = 60;
    constructor()
    {
        super();

        /** Light intensity by time */
        this.lightIntensityCurve = new CurveFloat([ 
            [ 0, 0 ], /** 00:00 */
            [ 0.16, 0 ], /** 04:00 */
            [ 0.25, 0.8 ], /** 06:00 */
            [ 0.5, 1 ], /** 12:00 */
            [ 0.7, 0.95 ], /** 17:00 */
            [ 0.83, 0.5 ], /** 20:00 */
            [ 0.91, 0 ], /** 22:00 */
            [ 1, 0 ] /** 24:00 */
            ], );

        this.updateTimeSeconds(0.5 * this.maxDaySeconds);
    }

    tick(deltaTime: number)
    {
        super.tick(deltaTime);

        const gameInstance = GameInstance.Get();

        if (!gameInstance || !this.skyLightActorRef)
        {
            return;
        }

        
        this.elapsedSeconds += deltaTime / 1000;

        if (this.elapsedSeconds > this.maxDaySeconds)
        {
            this.elapsedSeconds = clamp( this.maxDaySeconds - this.elapsedSeconds, 0, this.maxDaySeconds );
        }

        this.updateTimeSeconds(this.elapsedSeconds);
    }

    updateTimeSeconds(newTimeSeconds: number): void
    {
        newTimeSeconds = clamp(newTimeSeconds, 0, this.maxDaySeconds);
        this.elapsedSeconds = newTimeSeconds;

        let intensity = this.lightIntensityCurve.getValue( this.elapsedSeconds / this.maxDaySeconds );

        intensity = clamp(intensity, 0, 1);
        
        if (!this.skyLightActorRef)
        {
            return;
        }

        this.skyLightActorRef.setLightIntensity(intensity);
    }
    updateBiome(biome: EBiomeType): void
    {
        if (!this.skyLightActorRef)
        {
            return;
        }

        let lightColor = [ 0.964, 0.925, 0.819 ];

        switch (biome)
        {
            case EBiomeType.Desert:
                lightColor = [ 1, 0.976, 0.901 ];
                break;
            case EBiomeType.Snow:
                lightColor = [ 0.85, 0.85, 0.99 ];
                break;
        }

        this.skyLightActorRef.lightColor = lightColor;
        this.skyLightActorRef.updateLight();
    }
}