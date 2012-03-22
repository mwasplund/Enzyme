#ifdef GL_ES
precision highp float;
#endif

varying float vAmbientOcclusion;
varying vec4 vPosition;
varying vec2 vTextureCoord;

uniform bool uDecal;

uniform sampler2D uDiffuseColorTexture;

void main(void) 
{
	if(uDecal)
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); //texture2D(uDiffuseColorTexture, vec2(vTextureCoord.s, vTextureCoord.t));
	else
		gl_FragColor = vec4(1.0,1.0,1.0,1.0);//vAmbientOcclusion, vAmbientOcclusion, vAmbientOcclusion, 1.0);
	
}