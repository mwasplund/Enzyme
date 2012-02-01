function surfacedata(i_Path, i_Filename, i_Callback)
{
	this.path = i_Path;
	this.filename = i_Filename;
	this.callback = i_Callback;

	var xhr = new XMLHttpRequest();
	var file = this;
	xhr.onreadystatechange = function () 
	{
		if (xhr.readyState == xhr.DONE) 
		{
			if ((xhr.status == 200 || xhr.status == 0) && xhr.responseXML) // MWA - for some reason local tests return 0 on ready 
			{
				file.parseFile(xhr.responseXML); // MWA - should seperate
				if(file.callback != null)
					file.callback();
			} 
			else 
			{
				throw 1;
			}
		}
	}
	
	// Open the request for the provided url
	xhr.open("GET", i_Path + i_Filename, true);	
	xhr.send();
	
	this.parseFile = function(xml)
	{
		for(var i = 0; i < xml.childNodes.length; i++)
		{
			var node = xml.childNodes[i];
			if(node instanceof Element && node.nodeName == "surfacedata")
			{
				this.parseSurfaceData(node);
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
						cs.abstract_surfacefile = new ply.file(this.path, cs.abstract_surfacefilename, cs.abstract_ambient_occlusion, cs.decallists);
					
					if(cs.orig_surfacefilename != "")
						cs.orig_surfacefile = new ply.file(this.path, cs.orig_surfacefilename, cs.orig_ambient_occlusion, cs.decallists);
					
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