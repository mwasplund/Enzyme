#ifdef GL_ES
precision highp float;
#endif

varying float vAmbientOcclusion;
varying vec4 vPosition;

uniform sampler2D uSampler;

void main(void) 
{
  // Apply the Light Weight to the fragment color
  gl_FragColor = vec4(vAmbientOcclusion, vAmbientOcclusion, vAmbientOcclusion, 1.1);
}