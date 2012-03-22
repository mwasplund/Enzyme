function ContainsIndex(raw_decal, index)
{
	for(var j = 0; j < raw_decal.length; j++)
	{
		if(raw_decal[j].vertnum == index)
			return raw_decal[j];
	}
	
	return null;
}


var ply_decal = function(raw_decal, vertices, indices, path)
{
	
	this.TriangleIndices = [];
	this.texfilename = raw_decal.texfilename;
	
	var Index_1 = -1;
	var Index_2 = -1;
	var Index_3 = -1;
	for(var i = 0; i < indices.length; i++)
	{
		// Start of a new triangle strip
		Index_1 = -1;
		Index_2 = -1;
		Index_3 = -1;

		while(i < indices.length && indices[i] > 0)
		{
			Index_1 = Index_2;
			Index_2 = Index_3;
			
			if(ContainsIndex(raw_decal, indices[i]) != null)
			{
				// Shift in the new index
				Index_3 = indices[i];
				
				// We found a triangle in our decal
				if(Index_1 > 0 && Index_2 > 0)
				{
					this.TriangleIndices.push(Index_1);
					this.TriangleIndices.push(Index_2);
					this.TriangleIndices.push(Index_3);
				}
			}
			else
			{
				// We do not want this triagle
				Index_3 = -1;
			}
			
			i++;
		}
	}
	
	this.UV = new Array(this.TriangleIndices.length * 2);
	this.Triangles = new Array(this.TriangleIndices.length * 3);;
	
	
	for(var l = 0; l < this.TriangleIndices.length; l++)
	{
		this.Triangles[l*3+0] = vertices[this.TriangleIndices[l]*3+0];
		this.Triangles[l*3+1] = vertices[this.TriangleIndices[l]*3+1];
		this.Triangles[l*3+2] = vertices[this.TriangleIndices[l]*3+2];
		
		// Get the corresponding UV texture coordinates
		var textCoord = ContainsIndex(raw_decal, this.TriangleIndices[l]);
		this.UV[l*2+0] = textCoord.tx;
		this.UV[l*2+1] = textCoord.ty;
	}

	// Create the GL buffers
	this.VertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.Triangles), gl.STATIC_DRAW);
	this.VertexBuffer.itemSize = 3;
	this.VertexBuffer.numItems = this.Triangles.length/3;

	this.UVBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.UVBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.UV), gl.STATIC_DRAW);
	this.UVBuffer.itemSize = 2;
	this.UVBuffer.numItems = this.UV.length/2;


	// Download the texture image
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
	this.Texture.image.src = path + raw_decal.texfilename;
	
	
	
	this.draw = function(i_ShaderProgram)
	{		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.Texture);
		gl.uniform1i(i_ShaderProgram.DiffuseColorTexture_Uniform, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.UVBuffer);
		gl.vertexAttribPointer(i_ShaderProgram.textureCoordAttribute, this.UVBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
		gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexBuffer);
		gl.vertexAttribPointer(i_ShaderProgram.vertexPositionAttribute, this.VertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, this.VertexBuffer.numItems);
	}
}


