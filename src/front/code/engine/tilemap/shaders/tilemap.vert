
attribute vec4 aPosition;
attribute vec3 aLightColor;
attribute vec2 aTextureCoord;
attribute float aTextureId;

uniform mat3 translationMatrix;

varying vec2 vTextureCoord;
varying float vTextureId;
varying vec3 vLightColor;

void main() {
    float x = aPosition.x;
    float y = aPosition.y;

    vec2 pos = vec2(x, y);

    gl_Position = vec4((translationMatrix * vec3(pos.x, pos.y, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = aTextureCoord;
    vTextureId = aTextureId;
    vLightColor = aLightColor;
}