var mousePos = [0,0];
var mouseDown = false;
function MouseMoved(e)
{
	if(window.event)
        e = window.event; //IE
	
	if(mouseDown)
	{
		var delta = [mousePos[0] - e.clientX, mousePos[1] - e.clientY];
	
		// update camera pos
		var rot = mat4.identity();
	  	mat4.rotateY(rot, delta[0] * 0.01);
	  	mat4.rotateX(rot, delta[1] * 0.01);
	  	mat4.multiplyVec3(rot, CameraPos, CameraPos);
	}
	
	// Update mouse pos
    mousePos[0] = e.clientX;
    mousePos[1] = e.clientY;
}