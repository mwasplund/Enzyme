var ply = {};
ply.file = function(i_Path, i_Filename, i_AmbientOcclusion, i_DecalLists)
{
	this.path =  i_Path;
	this.filename = i_Filename;
	this.ambientocclusion = i_AmbientOcclusion;
	this.decallists = i_DecalLists;
	
	var xhr = new XMLHttpRequest();
	var file = this;
	file.response = null;
	xhr.onreadystatechange = function () 
	{
		if (xhr.readyState == xhr.DONE) 
		{
			if ((xhr.status == 200 || xhr.status == 0) && xhr.response) // MWA - for some reason local tests return 0 on ready 
			{
				// The 'response' property returns an ArrayBuffer
				file.file = new ply.FileContainer(xhr.response);
				file.parseFile(); // MWA - should seperate
			} 
			else 
			{
				throw 1;
			}
		}
	}
	
	// Open the request for the provided url
	xhr.open("GET", i_Path + i_Filename, true);
	
	// Set the responseType to 'arraybuffer' for ArrayBuffer response
	xhr.responseType = "arraybuffer";
	
	xhr.send();
  
	file.parseFile = function()
	{
		var l = this.file.nextLabel();
		
		while(l != "end_header")
		{
			if(l.startsWith("element vertex "))
			{
				this.size = parseInt(l.substr(15), 10);
			}
			l = this.file.nextLabel();
		}
			
		this.vertices = [];
		while(this.vertices.length / 3 < this.size)
			this.vertices.push(this.file.nextFloat32());
			
		var indicesLength = this.file.nextInt32()
		this.indices = [];
		for(var i = 0; i < indicesLength; i++)
			this.indices.push(this.file.nextInt32());
		
		// Consturct the textures
		this.UVs = [];
		for(var i = 0; i < this.decallists.length; i++)
		{
			var decallist = this.decallists[i];
			for(var k = 0; k < decallist.length; k++)
			{
				var decal = decallist[k];
				var UV = new Array(this.size * 2);
				for(var l = 0; l < UV.length; l++)
					UV[l] = 0;
					
				for(var l = 0; l < decal.length; l++)
				{
					UV[decal[l].vertnum * 2 + 0] = decal[l].tx;
					UV[decal[l].vertnum * 2 + 1] = decal[l].ty;
				}
				this.UVs.push(UV);
				
				// MWA test
				if(decal.texfilename == "013.png")
					this.UV = UV;
			}
		}
		
		//013.png
		this.Texture = gl.createTexture();
		this.Texture.image = new Image();
		var Texture = this.Texture;
		this.Texture.image.onload = function()
		{
			gl.bindTexture(gl.TEXTURE_2D, Texture);
 			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
 			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Texture.image);
 			//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 			// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
 			checkGLError();
 			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
 			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
 			gl.generateMipmap(gl.TEXTURE_2D);
 			checkGLError();
 			gl.bindTexture(gl.TEXTURE_2D, null);
 			Debug.Trace("Image Loaded: " + Texture.image.src);
 			checkGLError();		
 		}
  		this.Texture.image.src = this.path + "013.png";
  		
  		this.meshes = [];
		var i = 0;
		for(var i = 0; i < this.indices.length; i++)
		{
			var mesh = new ply.Mesh();
			while(i < this.indices.length && this.indices[i] > 0)
			{
				if(this.UV != null)
				{
					mesh.UV.push(this.UV[this.indices[i]*2+0]);
					mesh.UV.push(this.UV[this.indices[i]*2+1]);
				}
				else
				{
					mesh.UV.push(-999999);
					mesh.UV.push(-999999);
				}
				
				mesh.AmbientOcclusion.push(this.ambientocclusion[this.indices[i]]);
			
				mesh.TriangleStrip.push(this.vertices[this.indices[i]*3+0]);
				mesh.TriangleStrip.push(this.vertices[this.indices[i]*3+1]);
				mesh.TriangleStrip.push(this.vertices[this.indices[i]*3+2]);
				i++;
			}
			
			this.meshes.push(mesh);
		}
		
		for(var i = 0; i < this.meshes.length; i++)
		{
			var mesh = this.meshes[i];
			
			mesh.VertexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.VertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.TriangleStrip), gl.STATIC_DRAW);
			mesh.VertexBuffer.itemSize = 3;
			mesh.VertexBuffer.numItems = mesh.TriangleStrip.length/3;
		
			mesh.UVBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.UVBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.UV), gl.STATIC_DRAW);
			mesh.UVBuffer.itemSize = 2;
			mesh.UVBuffer.numItems = mesh.UV.length/2;
		
			mesh.AmbientOcclusionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.AmbientOcclusionBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.AmbientOcclusion), gl.STATIC_DRAW);
			mesh.AmbientOcclusionBuffer.itemSize = 1;
			mesh.AmbientOcclusionBuffer.numItems = mesh.AmbientOcclusion.length;
		}
	}
	
	file.draw = function(i_ShaderProgram)
	{
		setmvMatrixUniform(mat4.identity());
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.Texture);
		gl.uniform1i(i_ShaderProgram.DiffuseColorTexture_Uniform, 0);
		
		for(var i = 0; i < this.meshes.length; i++)
		{
			var mesh = this.meshes[i];
			
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.AmbientOcclusionBuffer);
			gl.vertexAttribPointer(i_ShaderProgram.ambientOcclusionAttribute, mesh.AmbientOcclusionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.UVBuffer);
			gl.vertexAttribPointer(i_ShaderProgram.textureCoordAttribute, mesh.UVBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.VertexBuffer);
			gl.vertexAttribPointer(i_ShaderProgram.vertexPositionAttribute, mesh.VertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, mesh.VertexBuffer.numItems);
		}
	}
	
	return file;
}

ply.Mesh = function()
{
	this.TriangleStrip = [];
	this.AmbientOcclusion = [];
	this.UV = [];
}

/******************************************************/
/* FileContainer
/******************************************************/
/*
/* A Container for parsing out the needed data from
/* the binary file.
/******************************************************/
ply.FileContainer = function(i_File)
{
	if(typeof DataView != "undefined")
	{
		return new ply.TypedArrays_FileContainer(i_File);
	}
	else if(typeof ArrayBuffer != "undefined")
	{
		return new ply.TypedArrays_FileContainer(i_File);
	}
	else
	{
		Debug.Error("DataView Objects are not supported by your browser... sorry.");
		throw -1;
	}
}

ply.DataView_FileContainer = function(i_File)
{
	this.reader  = new DataView(i_File);
	this.length = this.reader.byteLength;
	this.index = 0;
	
	/******************************************************/
	/* nextLabel.
	/*
	/* return the next label
	/******************************************************/
	this.nextLabel = function()
	{
		var l = "";
		var c = String.fromCharCode(this.nextInt8());
		while(this.index < this.length && c != "\n")
		{
			l += c;
			c = String.fromCharCode(this.nextInt8());
		}
			
		return l;
	}
	
	/******************************************************/
	/* nextInt32
	/*
	/* calulates and returns the next four bytes as a little
	/* endian 32 bit signed integer.
	/******************************************************/
	this.nextInt32 = function()
	{
		var i = this.reader.getInt32(this.index, true);
		this.index += 4;
		return i;
	}

	
	/******************************************************/
	/* nextInt8.
	/*
	/* return the next byte as an integer representation
	/******************************************************/
	this.nextInt8 = function()
	{
		return this.reader.getInt8(this.index++);
	}


	/******************************************************/
	/* nextFloat32
	/*
	/* calulates and returns the next four bytes as a little
	/* endian 32 bit double 
	/******************************************************/
	this.nextFloat32 = function()
	{
		var f = this.reader.getFloat32(this.index, true);
		this.index += 4;
		return f;
	}
}

ply.TypedArrays_FileContainer = function(i_File)
{
	this.buffer  = i_File;
	this.int8View = new Int8Array(this.buffer); 
	this.int32View = null; 
	this.float32View = null;
	this.headerIndex = 0; // byte offset
	this.dataIndex = 0;
	
	this.init32Views = function()
	{
		try{
		// Split off the header data so we can create a word aligned arrays
     		var sub = this.int8View.subarray(this.headerIndex);
     		this.int32View = new Int32Array(sub);
         	this.float32View = new Float32Array(sub);
		}
		catch(e)
		{
			Debug.Error(e.message);
			throw 2;
		}
	}
	
	/******************************************************/
	/* nextLabel.
	/*
	/* return the next label
	/******************************************************/
	this.nextLabel = function()
	{
		var l = "";
		var c = String.fromCharCode(this.nextInt8());
		while(this.headerIndex < this.int8View.length && c != "\n")
		{
			l += c;
			c = String.fromCharCode(this.nextInt8());
		}
			
		// MWA - hack. we have to know the bytes offset before we can initialize the 32 bit arrays (they have to 
		// be properly alligned). so wait until we see the end header
		if(l == "end_header")
			this.init32Views();
		
		return l;
	}
	
	/******************************************************/
	/* nextInt32
	/*
	/* calulates and returns the next four bytes as a little
	/* endian 32 bit signed integer.
	/******************************************************/
	this.nextInt32 = function()
	{
		return this.int32View[this.dataIndex++];
	}

	
	/******************************************************/
	/* nextInt8.
	/*
	/* return the next byte as an integer representation
	/******************************************************/
	this.nextInt8 = function()
	{
		return this.int8View[this.headerIndex++];
	}


	/******************************************************/
	/* nextFloat32
	/*
	/* calulates and returns the next four bytes as a little
	/* endian 32 bit double 
	/******************************************************/
	this.nextFloat32 = function()
	{
		return this.float32View[this.dataIndex++];
	}
}
