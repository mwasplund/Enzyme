function GLSL_Shader(i_ShaderName)
{
	this.Name = i_ShaderName;
	
  this.Program        = gl.createProgram();
  this.FragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  this.VertexShader   = gl.createShader(gl.VERTEX_SHADER);
  
  this.FragmentShader_Loaded = false;
  this.VertexShader_Loaded   = false;
  this.Loaded                = false;
}

function LoadShader(i_ShaderName, i_VertexShader, i_FragmentShader)
{
  var Shader = new GLSL_Shader(i_ShaderName);
      
    //////////////////////////////////////
	// Get the VertexShader
	//////////////////////////////////////
	var vs_xhr = new XMLHttpRequest();
	vs_xhr.onreadystatechange = function () 
	{
		if (vs_xhr.readyState == vs_xhr.DONE) 
		{
			if ((vs_xhr.status == 200 || vs_xhr.status == 0) && vs_xhr.response) // MWA - for some reason local tests return 0 on ready 
			{
				var Data = vs_xhr.response;
				//Debug.Trace(Data);
				
				gl.shaderSource(Shader.VertexShader, Data);
				gl.compileShader(Shader.VertexShader);
				if (gl.getShaderParameter(Shader.VertexShader, gl.COMPILE_STATUS)) 
					Shader.VertexShader_Loaded = true;
				else
					Debug.Error(gl.getShaderInfoLog(Shader.VertexShader));

				if(Shader.VertexShader_Loaded && Shader.FragmentShader_Loaded)
				{
					GLSL_AttachShaderProgram(Shader);
					Shader.Loaded = true;
				}
			} 
			else 
			{
				Debug.Error("ERROR: Failed to load " + i_VertexShader);
			}
		}
	}
	
	// Open the request for the provided url
	vs_xhr.open("GET", i_VertexShader, true);
	vs_xhr.send();
    
    //////////////////////////////////////
	// Get the Fragment Shader
	//////////////////////////////////////
	var fs_xhr = new XMLHttpRequest();
	fs_xhr.onreadystatechange = function () 
	{
		if (fs_xhr.readyState == fs_xhr.DONE) 
		{
			if ((fs_xhr.status == 200 || fs_xhr.status == 0) && fs_xhr.response) // MWA - for some reason local tests return 0 on ready 
			{
				var Data = fs_xhr.response;
				//Debug.Trace(Data);
				
				gl.shaderSource(Shader.FragmentShader, Data);
				gl.compileShader(Shader.FragmentShader);
				if (gl.getShaderParameter(Shader.FragmentShader, gl.COMPILE_STATUS)) 
					Shader.FragmentShader_Loaded = true;
				else
					Debug.Error(gl.getShaderInfoLog(Shader.FragmentShader));

				if(Shader.VertexShader_Loaded && Shader.FragmentShader_Loaded)
				{
					GLSL_AttachShaderProgram(Shader);
					Shader.Loaded = true;
				}
			} 
			else 
			{
				Debug.Error("ERROR: Failed to load " + i_FragmentShader);
			}
		}
	}
	
	// Open the request for the provided url
	fs_xhr.open("GET", i_FragmentShader, true);
	fs_xhr.send();
  
	return Shader;

}

function GLSL_AttachShaderProgram(i_Shader)
{
    gl.attachShader(i_Shader.Program, i_Shader.VertexShader);
    gl.attachShader(i_Shader.Program, i_Shader.FragmentShader);
    gl.linkProgram(i_Shader.Program);

    if (!gl.getProgramParameter(i_Shader.Program, gl.LINK_STATUS)) 
    {
        alert("Could not initialise shaders " + i_Shader.Name);
    }

    i_Shader.Program.vertexPositionAttribute = gl.getAttribLocation(i_Shader.Program, "aVertexPosition");
    gl.enableVertexAttribArray(i_Shader.Program.vertexPositionAttribute);

    i_Shader.Program.vertexNormalAttribute = gl.getAttribLocation(i_Shader.Program, "aVertexNormal");
    gl.enableVertexAttribArray(i_Shader.Program.vertexNormalAttribute);
    
    i_Shader.Program.textureCoordAttribute = gl.getAttribLocation(i_Shader.Program, "aTextureCoord");
    gl.enableVertexAttribArray(i_Shader.Program.textureCoordAttribute);

    i_Shader.Program.ambientOcclusionAttribute = gl.getAttribLocation(i_Shader.Program, "aAmbientOcclusion");
    gl.enableVertexAttribArray(i_Shader.Program.ambientOcclusionAttribute);

	i_Shader.Program.Decal_Uniform   = gl.getUniformLocation(i_Shader.Program, "uDecal");
	i_Shader.Program.Decal2_Uniform   = gl.getUniformLocation(i_Shader.Program, "uDecal2");
	
    i_Shader.Program.pMatrixUniform  = gl.getUniformLocation(i_Shader.Program, "uPMatrix");
    i_Shader.Program.mvMatrixUniform = gl.getUniformLocation(i_Shader.Program, "uMVMatrix");
    i_Shader.Program.nMatrixUniform  = gl.getUniformLocation(i_Shader.Program, "uNMatrix");
    i_Shader.Program.vMatrixUniform  = gl.getUniformLocation(i_Shader.Program, "uVMatrix");

    i_Shader.Program.Time_Uniform    = gl.getUniformLocation(i_Shader.Program, "uTime");
    
    i_Shader.Program.TransparentColorTexture_Uniform         = gl.getUniformLocation(i_Shader.Program, "uTransparentColorTexture"); 
    i_Shader.Program.TransparentColorTexture_Enabled_Uniform = gl.getUniformLocation(i_Shader.Program, "uTransparentColorTexture_Enabled");
    i_Shader.Program.DiffuseColorTexture_Uniform             = gl.getUniformLocation(i_Shader.Program, "uDiffuseColorTexture");         
    i_Shader.Program.DiffuseColorTexture_Enabled_Uniform     = gl.getUniformLocation(i_Shader.Program, "uDiffuseColorTexture_Enabled");
    
    // Lighting Variables
    i_Shader.Program.Light0_Enabled_Uniform   = gl.getUniformLocation(i_Shader.Program, "uLight0_Enabled");  
    i_Shader.Program.Light0_Position_Uniform  = gl.getUniformLocation(i_Shader.Program, "uLight0_Position");
    i_Shader.Program.Light0_Color_Uniform     = gl.getUniformLocation(i_Shader.Program, "uLight0_Color");
    
    i_Shader.Program.Light1_Enabled_Uniform   = gl.getUniformLocation(i_Shader.Program, "uLight1_Enabled");  
    i_Shader.Program.Light1_Position_Uniform  = gl.getUniformLocation(i_Shader.Program, "uLight1_Position");
    i_Shader.Program.Light1_Color_Uniform     = gl.getUniformLocation(i_Shader.Program, "uLight1_Color");

    i_Shader.Program.Camera_Position_Uniform  = gl.getUniformLocation(i_Shader.Program, "uCameraPosition");
    i_Shader.Program.AmbientColor_Uniform     = gl.getUniformLocation(i_Shader.Program, "uAmbientColor");
    i_Shader.Program.DiffuseColor_Uniform     = gl.getUniformLocation(i_Shader.Program, "uDiffuseColor");
    i_Shader.Program.SpecularColor_Uniform    = gl.getUniformLocation(i_Shader.Program, "uSpecularColor");
    i_Shader.Program.Shininess_Uniform        = gl.getUniformLocation(i_Shader.Program, "uShininess");
}



