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

function MouseWheel(e)
{
  e = e ? e : window.event;
  var wheelData = e.detail ? e.detail * -1 : e.wheelDelta / 40;
  //do something
  
  var distance = vec3.length(CameraPos);
  if(wheelData > 0)
  	distance *= 0.9;
  else
  	distance *= 1.1;

  vec3.normalize(CameraPos);
  vec3.scale(CameraPos, distance);
}