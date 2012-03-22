#ifdef GL_ES
precision highp float;
#endif

varying vec4 vPosition;
varying vec2 vTextureCoord;

uniform sampler2D uDiffuseColorTexture;

void main(void) 
{
	vec4 diffuseColor = vec4(0.0,0.0,0.0,0.0);
	
	if(vTextureCoord.s >= 0.0 && vTextureCoord.t >= 0.0 && vTextureCoord.s <= 1.0 && vTextureCoord.t <= 1.0)
		diffuseColor = texture2D(uDiffuseColorTexture, vec2(vTextureCoord.s, vTextureCoord.t));
		
	gl_FragColor = diffuseColor;	
}