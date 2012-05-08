/******************************************************/
/* FileContainer
/******************************************************/
/*
/* A Container for parsing out the needed data from
/* the binary file.
/******************************************************/
BinaryReader = function(i_File)
{
	if(i_File instanceof DataView)
		this.reader = i_File;
	else if(i_File instanceof ArrayBuffer)
		this.reader  = new DataView(i_File);
	else
		throw "Unknown file formate passed to binary reader";
		
	this.length = this.reader.byteLength;
	this.index = 0;
	
	
	/******************************************************/
	/* ReadInt32 
	/*
	/* calulates and returns the next four bytes as a little
	/* endian 32 bit signed integer.
	/******************************************************/
	this.ReadInt32 = function()
	{
		var i = this.reader.getInt32(this.index, true);
		this.index += 4;
		return i;
	}

	/******************************************************/
	/* ReadInt16 
	/*
	/* calulates and returns the next four bytes as a little
	/* endian 32 bit signed integer.
	/******************************************************/
	this.ReadInt16 = function(little)
	{
		var i = this.reader.getInt16(this.index, true);
		this.index += 2;
		return i;
	}

	/******************************************************/
	/* ReadChar
	/*
	/* return the next byte as an char representation
	/******************************************************/
	this.ReadChar = function()
	{
		return String.fromCharCode(this.ReadByte());
	}

	/******************************************************/
	/* ReadChars
	/*
	/* return the next n chars 
	/******************************************************/
	this.ReadChars = function(count)
	{
		var chars = new Array(count);
		for(var i = 0; i < count; i++)
			chars[i] = this.ReadChar();
		return chars;
	}


	/******************************************************/
	/* ReadByte
	/*
	/* return the next byte as an integer representation
	/******************************************************/
	this.ReadByte = function()
	{
		return this.reader.getInt8(this.index++);
	}

	/******************************************************/
	/* ReadBytes
	/*
	/* return the next n bytes 
	/******************************************************/
	this.ReadBytes = function(count)
	{
		var bytes = new Array(count);
		for(var i = 0; i < count; i++)
			bytes[i] = this.ReadByte();
		return bytes;
	}


	/******************************************************/
	/* ReadSingle
	/*
	/* calulates and returns the next four bytes as a little
	/* endian 32 bit float 
	/******************************************************/
	this.ReadSingle = function()
	{
		var f = this.reader.getFloat32(this.index, true);
		this.index += 4;
		return f;
	}
}
