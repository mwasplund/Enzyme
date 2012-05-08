var ply = {};
ply.file = function(zip, filename, i_AmbientOcclusion, i_DecalLists)
{
	this.zip = zip;
	this.file = zip.getFile(filename).Data;
	this.filename = filename;
	this.ambientocclusion = i_AmbientOcclusion;
	if(i_DecalLists != null)
		this.raw_decallists = i_DecalLists;
	else
		this.raw_decallists = [];
		
		
	/******************************************************/
	/* nextLabel.
	/*
	/* return the next label
	/******************************************************/
	this.nextLabel = function(reader)
	{
		var l = "";
		var c = reader.ReadChar();
		while(reader.index < reader.length && c != "\n")
		{
			l += c;
			c = reader.ReadChar();
		}
			
		return l;
	}

	  
	this.parseFile = function()
	{
		var reader = new BinaryReader(this.file);
		var l = this.nextLabel(reader);
		
		while(l != "end_header")
		{
			if(l.startsWith("element vertex "))
			{
				this.size = parseInt(l.substr(15), 10);
			}
			l = this.nextLabel(reader);
		}
			
		this.vertices = [];
		while(this.vertices.length / 3 < this.size)
			this.vertices.push(reader.ReadSingle());
			
		var indicesLength = reader.ReadInt32()
		this.indices = [];
		for(var i = 0; i < indicesLength; i++)
			this.indices.push(reader.ReadInt32());
		
		// Consturct the textures
		this.decallists = [];
		for(var i = 0; i < this.raw_decallists.length; i++)
		{
			var raw_decallist = this.raw_decallists[i];
			var decallist = [];
			decallist.type = raw_decallist.type;
			
			for(var k = 0; k < raw_decallist.length; k++)
				decallist.push(new ply_decal(raw_decallist[k], this.vertices, this.indices, this.zip.getFile(raw_decallist[k].texfilename).Data, raw_decallist[k].texfilename));
						
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
	
	this.draw = function(i_EnzymeShaderProgram, i_DecalShaderProgram)
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
		var offset = 0.0;
		var offsetStep = 0.1;
		
		for(var i = 0; i < this.decallists.length; i++)
		{
			var decallist = this.decallists[i];
			if((decallist.type == "pocket" && DetectedPocketsStickersVisible) || 
				(decallist.type == "sanded" && PeakBowlStickersVisible) || 
				(decallist.type == "shadow" && InterfacesStickersVisible))
			{
				for(var k = 0; k < decallist.length; k++)
				{
					offset -= offsetStep;
					gl.polygonOffset(offset, offset);
					decallist[k].draw(i_DecalShaderProgram);
					
				}
			}
		}
		
		//if(this.test_decal != null)
		//	this.test_decal.draw(i_DecalShaderProgram);
			
		gl.disable(gl.POLYGON_OFFSET_FILL);
	}
	
	return this;
}

ply.Mesh = function()
{
	this.TriangleStrip = [];
	this.AmbientOcclusion = [];
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
		while(this.index < this.length && c != "\n")
		{
			l += c;
			c = String.fromCharCode(this.nextInt8());
		}
			
		return l;
	}

