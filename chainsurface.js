function chainsurface(xml)
{
	this.decallists = [];
	this.abstract_surfacefilename = "";
	this.abstract_surfacefile = null;
	this.orig_surfacefilename = "";
	this.orig_surfacefile = null;

	this.abstract_charge = [];
	this.abstract_ambient_occlusion = [];
	this.abstract_hydropathy = [];
	this.vertmap = [];
	this.orig_charge = [];
	this.orig_ambient_occlusion = [];
	this.orig_hydropathy = [];

	for(var i = 0; i < xml.attributes.length; i++)
	{
		var attribute = xml.attributes[i];
		if(attribute.name == "abstract_surfacefile")
		{
			this.abstract_surfacefilename = attribute.value;
		}
		else if(attribute.name == "orig_surfacefile")
		{
			this.orig_surfacefilename = attribute.value;
		}
	}

	for(var i = 0; i < xml.childNodes.length; i++)
	{
		var node = xml.childNodes[i];
		if(node instanceof Element)
		{
			if(node.nodeName == "decallist")
			{
				this.decallists.push(new decallist(node));
			}
			else if(node.nodeName == "fielddense")
			{
				var fd = new fielddense(node);
				if(fd.name == "abstract_charge")
					for(var k = 0; k < fd.length; k++)
						this.abstract_charge.push(parseFloat(fd[k]));
    			else if(fd.name == "abstract_ambient_occlusion")
    				for(var k = 0; k < fd.length; k++)
    					this.abstract_ambient_occlusion.push(parseFloat(fd[k]));
    			else if(fd.name == "abstract_hydropathy")
    				for(var k = 0; k < fd.length; k++)
    					this.abstract_hydropathy.push(parseFloat(fd[k]));
    			else if(fd.name == "vertmap")
    				for(var k = 0; k < fd.length; k++)
    					this.vertmap.push(parseFloat(fd[k]));
    			else if(fd.name == "orig_charge")
    				for(var k = 0; k < fd.length; k++)
    					this.orig_charge.push(parseFloat(fd[k]));
    			else if(fd.name == "orig_ambient_occlusion")
    				for(var k = 0; k < fd.length; k++)
						this.orig_ambient_occlusion.push(parseFloat(fd[k]));
    			else if(fd.name == "orig_hydropathy")
    				for(var k = 0; k < fd.length; k++)
    					this.orig_hydropathy.push(parseFloat(fd[k]));
			}
			else
			{
				throw 6;
			}
		}
		else if(node instanceof Text)
		{
			// Ignore Text
		}
		else
		{
			throw 5;
		}
	}
}

function decallist(xml)
{
	var list = [];
	list.type = "";

	for(var i = 0; i < xml.attributes.length; i++)
	{
		var attribute = xml.attributes[i];
		if(attribute.name == "type")
		{
			list.type = attribute.value;
		}
	}

	for(var i = 0; i < xml.childNodes.length; i++)
	{
		var node = xml.childNodes[i];
		if(node instanceof Element)
		{
			if(node.nodeName == "decal")
			{
				list.push(new decal(node));
			}
			else
			{
				throw 8;
			}
		}
		else if(node instanceof Text)
		{
			// Ignore Text
		}
		else
		{
			throw 7;
		}
	}

	return list;
}

function decal(xml)
{
	var list = [];
	list.texfilename = "";
	list.id = -1;
	list.chartnum = -1;

	for(var i = 0; i < xml.attributes.length; i++)
	{
		var attribute = xml.attributes[i];
		if(attribute.name == "texfilename")
		{
			list.texfilename = attribute.value;
		}
		else if(attribute.name == "id")
		{
			list.id = parseInt(attribute.value, 10);
		}
		else if(attribute.name == "chartnum")
		{
			list.chartnum = parseInt(attribute.value, 10);
		}
	}

	for(var i = 0; i < xml.childNodes.length; i++)
	{
		var node = xml.childNodes[i];
		if(node instanceof Element)
		{
			if(node.nodeName == "textcoord")
			{
				list.push(new textcoord(node));
			}
			else
			{
				throw 10;
			}
		}
		else if(node instanceof Text)
		{
			// Ignore Text
		}
		else
		{
			throw 9;
		}
	}

	return list;
}

function textcoord(xml)
{
	this.vertnum = -1;
	this.tx = -1;
	this.ty = -1;

	for(var i = 0; i < xml.attributes.length; i++)
	{
		var attribute = xml.attributes[i];
		if(attribute.name == "vertnum")
		{
			this.vertnum = parseInt(attribute.value, 10);
		}
		else if(attribute.name == "tx")
		{
			this.tx  = parseInt(attribute.value, 10) / 1000.0;
		}
		else if(attribute.name == "ty")
		{
			this.ty = parseInt(attribute.value, 10) / 1000.0;
		}
	}
}

function fielddense(xml)
{
	var list = [];
	list.name = "";

	for(var i = 0; i < xml.attributes.length; i++)
	{
		var attribute = xml.attributes[i];
		if(attribute.name == "name")
		{
			list.name = attribute.value;
		}
	}

	for(var i = 0; i < xml.childNodes.length; i++)
	{
		var node = xml.childNodes[i];
		if(node instanceof Element)
		{
			// should not have any children
			throw 12;
		}
		else if(node instanceof Text)
		{
			// Parse the comma seperated list
			var data = node.data
			for(var k = 0; k < data.length; k++)
			{
				var v = "";
				while(k < data.length && data[k] != ",")
				{
					if(data[k] != " " && data[k] != "\n")
						v += data[k];
					k++;
				}
				list.push(v)
			}
		}
		else
		{
			throw 11;
		}
	}

	return list;
}
