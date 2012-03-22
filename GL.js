var ClearColor = [1.0, 1.0, 1.0];
var CameraOffset = [0, 200, 120];

/******************************************************/
/* InitializeWebGL
/*
/* Initialize Web GL
/******************************************************/
function safeGetContext(i_Canvas, i_Context) {
	try 
	{ 
	  return i_Canvas.getContext(i_Context); 
	}
	catch (e) 
	{ 
		Debug.Trace(i_Context);
		Debug.Trace(e);
		return null;
	}
}

/******************************************************/
/* InitializeWebGL
/*
/* Initialize Web GL 
/* RETURN: 0 if successful, negative number if error
/******************************************************/
function InitializeWebGL(i_Canvas)
{
  // Initialize
  Debug.Trace("Initializing WebGL...");
  
  var gl = safeGetContext(i_Canvas, "webgl"); // Completed Webgl
  if(!gl)
    gl = safeGetContext(i_Canvas, "experimental-webgl"); // Development
  if(!gl)
    gl = safeGetContext(i_Canvas, "moz-webgl"); // Firefox
  if(!gl)
    gl = safeGetContext(i_Canvas, "webkit-3d"); // Safari or Chrome
    
  if(!gl)
  {
    Debug.Error("ERROR: Could Not Initialize WebGL!");
    return null;
  }
  
  // Set the viewport to the same size as the Canvas
  gl.canvas = i_Canvas;
  gl.viewportWidth  = i_Canvas.width;
  gl.viewportHeight = i_Canvas.height;
  
  gl.clearColor(ClearColor[0], ClearColor[1], ClearColor[2] , 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.POLYGON_OFFSET_FILL);
  gl.depthFunc(gl.LESS);
  //gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE); 

  // Attach the Model View and Projection Matricies to the GL Reference for easy access
  gl.mvMatrix = mat4.create();
  gl.pMatrix  = mat4.create();
  gl.vMatrix  = mat4.create();
  gl.mvMatrixStack = [];

  gl.shaders = [];
  gl.loadShaders = GL_LoadShaders;
  gl.getShader = GL_GetShader;
  
  return gl;
}

/******************************************************/
/* InitializeModels
/*
/* This function Loads all the models that will be used 
/*
/******************************************************/
function GL_LoadModels(i_ModelList, i_Path) 
{  
  // Add each model to the list to be loaded
  for(var i = 0; i < i_ModelList.length; i++)
    this.modelLoader.load(i_ModelList[i], i_Path);
   
  this.modelLoader.StartLoading();
}


/******************************************************/
/* AreModelsLoaded
/*
/* This function checks if all the models are loaded
/******************************************************/
function GL_AreModelsLoaded(i_GL) 
{
	PercentLoaded = this.modelLoader.getPercentLoaded();
	$("#PercentLoaded").val("Loaded: " + PercentLoaded + "%");
	
	if(PercentLoaded == 100)
	{
    Debug.Trace("Done Loading Models");
    this.modelLoader.StopLoading();
	  return true;
	}
	return false;
}
	
/******************************************************/
/* LoadShaders
/*
/* This function Loads all the shaders that will be used 
/* during the time of the game.
/******************************************************/
function GL_LoadShaders(i_ShaderList, i_Path) 
{
  for(var i = 0; i < i_ShaderList.length; i++)
    this.shaders.push(LoadShader(i_ShaderList[i], i_Path + i_ShaderList[i] + ".vs", i_Path + i_ShaderList[i] + ".fs"));
}

/******************************************************/
/* GetShader
/*
/* This function finds one of the preloaded shaders.
/******************************************************/
function GL_GetShader(i_ShaderName)
{
	for(var i = 0; i < Shaders.length; i++)
	{
		if(Shaders[i].Name == i_ShaderName)
			return Shaders[i];
	}

	// Could not find the shader
	return null;
}


/******************************************************/
/* GetShader
/*
/* This function finds one of the preloaded shaders.
/******************************************************/
function GL_GetShader(i_ShaderName)
{
	for(var i = 0; i < this.shaders.length; i++)
	{
		if(this.shaders[i].Name == i_ShaderName)
			return this.shaders[i];
	}

	// Could not find the shader
	return null;
}

/******************************************************/
/* setMatrixUniforms
/*
/* This function binds the Matrixs used by the shader 
/* programs.
/******************************************************/
function setMatrixUniforms(program) 
{
	var program = program || CurrentShader.Program;
  gl.uniformMatrix4fv(program.pMatrixUniform, false, gl.pMatrix);
  gl.uniformMatrix4fv(program.vMatrixUniform, false, gl.vMatrix);

}

function setmvMatrixUniform(i_mvMatrix)
{
	gl.uniformMatrix4fv(CurrentShader.Program.mvMatrixUniform, false, i_mvMatrix);
}

/******************************************************/
/* mvPushMatrix
/*
/* Save the current model view matrix.
/******************************************************/
function mvPushMatrix() 
{
  var copy = mat4.create();
  mat4.set(gl.mvMatrix, copy);
  gl.mvMatrixStack.push(copy);
}

/******************************************************/
/* mvPopMatrix
/*
/* load the previously saved model view matrix.
/******************************************************/
function mvPopMatrix() 
{
  if (gl.mvMatrixStack.length == 0) 
    throw "Invalid popMatrix!";
    
  gl.mvMatrix = gl.mvMatrixStack.pop();
}
