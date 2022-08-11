varying vec2 vTextureCoord;
varying float vTextureId;
varying vec3 vLightColor;

uniform sampler2D uSamplers[%count%];
uniform vec3 globalLight;

void main(void){
    vec4 color;
    %forloop%
    vec3 lightColor = clamp(globalLight.rgb + vLightColor.rgb, 0.0, 1.0);
    gl_FragColor = vec4(color.rgb * lightColor.rgb, 1.0);
}