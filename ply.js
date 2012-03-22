var ply = {};
ply.file = function(i_Path, i_Filename, i_AmbientOcclusion, i_DecalLists)
{
	this.path =  i_Path;
	this.filename = i_Filename;
	this.ambientocclusion = i_AmbientOcclusion;
	if(i_DecalLists != null)
		this.raw_decallists = i_DecalLists;
	else
		this.raw_decallists = [];
		
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
		this.decallists = [];
		this.test_decal = null;
		for(var i = 0; i < this.raw_decallists.length; i++)
		{
			var raw_decallist = this.raw_decallists[i];
			var decallist = [];
			decallist.type = raw_decallist.type;
			
			for(var k = 0; k < raw_decallist.length; k++)
				decallist.push(new ply_decal(raw_decallist[k], this.vertices, this.indices, this.path));
			
			// MWA - test
			for(var k = 0; k < decallist.length; k++)
				if(decallist[k].texfilename == "013.png")
					this.test_decal = decallist[k]
			
			this.decallists.push(decallist);
		}

  		this.meshes = [];
		var i = 0;
		for(var i = 0; i < this.indices.length; i++)
		{
			var mesh = new ply.Mesh();
			while(i < this.indices.length && this.indices[i] > 0)
			{
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

			mesh.AmbientOcclusionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.AmbientOcclusionBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.AmbientOcclusion), gl.STATIC_DRAW);
			mesh.AmbientOcclusionBuffer.itemSize = 1;
			mesh.AmbientOcclusionBuffer.numItems = mesh.AmbientOcclusion.length;
		}
	}
	
	file.draw = function(i_EnzymeShaderProgram, i_DecalShaderProgram)
	{
		gl.useProgram(i_EnzymeShaderProgram);
		setMatrixUniforms(i_EnzymeShaderProgram);
		setmvMatrixUniform(i_EnzymeShaderProgram, mat4.identity());

		
		for(var i = 0; i < this.meshes.length; i++)
		{
			var mesh = this.meshes[i];
			
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.AmbientOcclusionBuffer);
			gl.vertexAttribPointer(i_EnzymeShaderProgram.ambientOcclusionAttribute, mesh.AmbientOcclusionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
			//gl.bindBuffer(gl.ARRAY_BUFFER, mesh.UVBuffer);
			//gl.vertexAttribPointer(i_EnzymeShaderProgram.textureCoordAttribute, mesh.UVBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.VertexBuffer);
			gl.vertexAttribPointer(i_EnzymeShaderProgram.vertexPositionAttribute, mesh.VertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, mesh.VertexBuffer.numItems);
		}
		
		
		// Draw the decals
		gl.useProgram(i_DecalShaderProgram);
		setMatrixUniforms(i_DecalShaderProgram);
		setmvMatrixUniform(i_DecalShaderProgram, mat4.identity());
		gl.enable(gl.POLYGON_OFFSET_FILL);
		var offset = -1.0;
		
		
		if(StickersVisible)
		{
			for(var i = 0; i < this.decallists.length; i++)
			{
				if(this.decallists[i].type == "sanded")
				{
					var sanded = this.decallists[i];
					for(var k = 0; k < sanded.length; k++)
					{
						gl.polygonOffset(offset, offset);
						sanded[k].draw(i_DecalShaderProgram);
						offset -= 1.0;
					}
				}
			}
		}
		
		//if(this.test_decal != null)
		//	this.test_decal.draw(i_DecalShaderProgram);
			
		gl.disable(gl.POLYGON_OFFSET_FILL);
	}
	
	return file;
}

ply.Mesh = function()
{
	this.TriangleStrip = [];
	this.AmbientOcclusion = [];
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