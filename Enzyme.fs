#ifdef GL_ES
precision highp float;
#endif

varying float vAmbientOcclusion;
varying vec4 vPosition;

void main(void) 
{
	gl_FragColor = vec4(vAmbientOcclusion, vAmbientOcclusion, vAmbientOcclusion, 1.0);
}