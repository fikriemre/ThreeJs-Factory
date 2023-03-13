uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;
uniform float u_time;
varying vec2 vuv;
varying vec3 vWorldPosition;

void main() {
    //float h = normalize( vWorldPosition + offset ).y;
    //gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
    gl_FragColor = vec4(.3,.3,.7,1.0);
    gl_FragColor.xyz +=  sin( (vuv.x+ u_time)*12.0)*.5;    
    
}