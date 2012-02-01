/******************************************************/
/* Helper.js
/*
/* Helper Functions that make using javascript easier
/******************************************************/


/******************************************************/
/* CanvasSupported
/*
/* This function checks if the html canvas elent is 
/* supported.
/******************************************************/
function CanvasSupported()
{
  return !document.createElement('TestCanvas').getContext;
}

/******************************************************/
/* LoadjsFile
/*
/* Load a seperate Javascript file to be used on the 
/* current page.
/*
/* i_FilePath - the location of the file to be loaded
/******************************************************/
function LoadjsFile(i_FilePath)
{
  var FileRef = document.createElement('script')
  FileRef.setAttribute("type","text/javascript")
  FileRef.setAttribute("src", i_FilePath)
  
  if (typeof FileRef!= "undefined")
    document.getElementsByTagName("head")[0].appendChild(FileRef)
}

/******************************************************/
/* getMousePosition
/*
/* Crossbrowser safe function that returns the current
/* location of the mouse. It also converts the mouse's 
/* absolute position in the page to a relative position
/* to the upper left corner of the canvas
/*
/* e - pass in the mouse even to be used to find mouse
/*     position
/******************************************************/
function getMousePosition(e) 
{
  var x;
  var y;
  if (e.pageX != undefined && e.pageY != undefined) 
  {
    x = e.pageX;
    y = e.pageY;
  }
  else 
  {
    x = e.clientX + document.body.scrollLeft +
          document.documentElement.scrollLeft;
    y = e.clientY + document.body.scrollTop +
          document.documentElement.scrollTop;
  }
  
  // Make the position in canvas space
  x -= Canvas.offsetLeft;
  y -= Canvas.offsetTop;
  
  return [x, y];
}
  
/******************************************************/
/* GetWindowSize
/*
/* Crossbrowser safe function that returns the current
/* windows size.
/******************************************************/
function GetWindowSize()
{
  var Size = [0,0];
  if (window.innerWidth && window.innerHeight) 
  {
    Size[0] = window.innerWidth;
    Size[1] = window.innerHeight;
  }
  else if (document.body && document.body.offsetWidth) 
  {
    Size[0] = document.body.offsetWidth;
    Size[1] = document.body.offsetHeight;
  }
  else if (document.compatMode=='CSS1Compat' &&
      document.documentElement &&
      document.documentElement.offsetWidth ) 
  {
    Size[0] = document.documentElement.offsetWidth;
    Size[1] = document.documentElement.offsetHeight;
  }
  
  return Size;
}

/******************************************************/
/* degToRad
/*
/* A function that converts an angle from degrees to 
/* radians.
/******************************************************/
function degToRad(degrees) 
{
  return degrees * Math.PI / 180;
}

/******************************************************/
/* checkGLError
/*
/* A function that checks for an error in gl
/******************************************************/
function checkGLError() 
{
 var error = gl.getError();
 if (error != gl.NO_ERROR && error != gl.CONTEXT_LOST_WEBGL)
 {
   var str = "GL Error: " + error;
   Debug.Trace(str);
 }
}
