function surfacedata(id, i_Callback)
{
	this.path = id + "/";
	this.id = id;
	this.filename = id + "_uncompressed.zip";
	this.zip = new Zip(this.path + this.filename);
	
	this.load = function(success, failure)
	{
		var sd = this;
		sd.zip.load(
		function()
		{
			var file = DataViewToString(sd.zip.getFile("decal-" + sd.id + ".xml").Data);
			var xml = StringtoXML(file);
			for(var i = 0; i < xml.childNodes.length; i++)
			{
				var node = xml.childNodes[i];
				if(node instanceof Element && node.nodeName == "surfacedata")
				{
					sd.parseSurfaceData(node);
				}
				else if(node instanceof Text)
				{
					// Ignore Text
				}
				else
				{
					throw 2;
				}
			}
			
			if(success != null)
				success();
		},
		failure
		);
	}
	

	this.chainsurfaces = [];
	this.parseSurfaceData = function(xml)
	{
		this.numchains = 0;
		for(var i = 0; i < xml.attributes.length; i++)
		{
			var attribute = xml.attributes[i];
			if(attribute.name == "numchains")
			{
				this.numchains = parseInt(attribute.value, 10);
			}
		}

	
		for(var i = 0; i < xml.childNodes.length; i++)
		{
			var node = xml.childNodes[i];
			if(node instanceof Element)
			{
				if(node.nodeName == "chainsurface")
				{
					var cs = new chainsurface(node);
					
					// load the mesh files
					if(cs.abstract_surfacefilename != "")
					{
						cs.abstract_surfacefile = new ply.file(
							this.zip, 
							cs.abstract_surfacefilename, 
							cs.abstract_ambient_occlusion, 
							cs.decallists
							);
						cs.abstract_surfacefile.parseFile();
					}
					if(cs.orig_surfacefilename != "")
					{
						cs.orig_surfacefile = new ply.file(
							this.zip, 
							cs.orig_surfacefilename, 
							cs.orig_ambient_occlusion
							);
						cs.orig_surfacefile.parseFile();
					}
					
					this.chainsurfaces.push(cs);
				}
				else
				{
					throw 4;
				}
			}
			else if(node instanceof Text)
			{
				// Ignore Text
			}
			else
			{
				throw 3;
			}
		}
	}
}