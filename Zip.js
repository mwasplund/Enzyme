function ZipFile(reader)
{
	this.Valid = function()
	{
		return this.Header == 0x04034b50;
	}
	
	this.Header = reader.ReadInt32();
	if(!this.Valid())
		return;
		
	this.Version = reader.ReadInt16();
	this.Flags = reader.ReadInt16();
	this.CompressionMethod = reader.ReadInt16();
	this.LastModTime = reader.ReadInt16();
	this.LastModDate = reader.ReadInt16();
	this.CRC_32 = reader.ReadInt32();
	this.CompressedSize = reader.ReadInt32();
	this.UncompressedSize = reader.ReadInt32();
	this.FilenameLength = reader.ReadInt16();
	this.ExtraFieldLength = reader.ReadInt16();
	this.Filename = reader.ReadChars(this.FilenameLength).join("");
	this.Extra = reader.ReadBytes(this.ExtraFieldLength);
	this.Data = new DataView(reader.reader.buffer, reader.index + reader.reader.byteOffset, this.CompressedSize);
	reader.index += this.CompressedSize;
}

function Zip(path)
{
	this.path = path;
	this.files = [];
	this.data = null;
	
	this.load = function(success, failure)
	{
		var xhr = new XMLHttpRequest();
		var file = this;
		xhr.onreadystatechange = function () 
		{
			if (xhr.readyState == xhr.DONE) 
			{
				if ((xhr.status == 200 || xhr.status == 0) && xhr.response) // MWA - for some reason local tests return 0 on ready 
				{
					file.data = xhr.response;
					file.parseFiles(); // MWA - should seperate
					if(success!= null)
						success();
				} 
				else 
				{
					if(failure != null)
						failure();
				}
			}
		}
		
		// Open the request for the provided url
		xhr.open("GET", this.path, true);	
		// Set the responseType to 'arraybuffer' for ArrayBuffer response
		xhr.responseType = "arraybuffer";
		xhr.send();
	}

	this.parseFiles = function()
	{
		var reader = new BinaryReader(this.data);
		var file = new ZipFile(reader);
		while(file.Valid())
		{
			this.files.push(file);
			file = new ZipFile(reader);
		}
	}
	
	this.getFile = function(filename)
	{
		for(var i = 0; i < this.files.length; i++)
		{
			if(this.files[i].Filename == filename)
				return this.files[i];
		}
		
		return null;
	}
}