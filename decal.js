var ply_decal = function(raw_decal, vertices, path)
{
	
	this.UV = new Array(raw_decal.length * 2);
	this.TriangleStrip = new Array(raw_decal.length * 3);
	this.texfilename = raw_decal.texfilename;
	
	for(var l = 0; l < raw_decal.length; l++)
	{
		this.UV[l*2+0] = raw_decal[l].tx;
		this.UV[l*2+0] = raw_decal[l].ty;
		
		this.TriangleStrip[l*3+0] = vertices[raw_decal[l].vertnum*3+0];
		this.TriangleStrip[l*3+1] = vertices[raw_decal[l].vertnum*3+1];
		this.TriangleStrip[l*3+2] = vertices[raw_decal[l].vertnum*3+2];
	}

	// Create the GL buffers
	this.VertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.TriangleStrip), gl.STATIC_DRAW);
	this.VertexBuffer.itemSize = 3;
	this.VertexBuffer.numItems = this.TriangleStrip.length/3;

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
		//gl.activeTexture(gl.TEXTURE0);
		//gl.bindTexture(gl.TEXTURE_2D, this.Texture);
		//gl.uniform1i(i_ShaderProgram.DiffuseColorTexture_Uniform, 0);

		//gl.bindBuffer(gl.ARRAY_BUFFER, this.UVBuffer);
		//gl.vertexAttribPointer(i_ShaderProgram.textureCoordAttribute, this.UVBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
		gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexBuffer);
		gl.vertexAttribPointer(i_ShaderProgram.vertexPositionAttribute, this.VertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.VertexBuffer.numItems);
	}
}


