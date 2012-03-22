attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

varying vec4 vPosition;
varying vec2 vTextureCoord;

void main(void) 
{
	vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
	gl_Position = uPMatrix * uVMatrix * vPosition;

	vTextureCoord = aTextureCoord;
}

