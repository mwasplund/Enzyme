function StringtoXML(text)
{
    if (window.ActiveXObject){
      var doc=new ActiveXObject('Microsoft.XMLDOM');
      doc.async='false';
      doc.loadXML(text);
    } else {
      var parser=new DOMParser();
      var doc=parser.parseFromString(text,'text/xml');
    }
    return doc;
}

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() 
{
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, 
    function(m,key,value) 
    {
        vars[key] = value;
    });
    return vars;
}


function DataViewToString(view)
{
	var string = "";
	for(var i = 0; i < view.byteLength; i++)
		string += String.fromCharCode(view.getUint8(i));
		
	return string;
}

function base64Encode(view)
{

    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var cur, prev, byteNum;
    var result = "";      

    for(var i = 0; i < view.byteLength; i++)
    {
        cur = view.getUint8(i);
        byteNum = i % 3;

        switch(byteNum)
        {
            case 0: //first byte
                result += digits.charAt(cur >> 2);
                break;

            case 1: //second byte
                result += digits.charAt((prev & 3) << 4 | (cur >> 4));
                break;

            case 2: //third byte
                result += digits.charAt((prev & 0x0f) << 2 | (cur >> 6));
                result += digits.charAt(cur & 0x3f);
                break;
        }

        prev = cur;
    }

    if (byteNum == 0)
    {
        result += digits.charAt((prev & 3) << 4);
        result += "==";
    } 
    else if (byteNum == 1)
    {
        result += digits.charAt((prev & 0x0f) << 2);
        result += "=";
    }

    return result;
}