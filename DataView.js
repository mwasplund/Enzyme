// Allow older browers to think they have a data view class
if(typeof DataView == "undefined")
{
	/////////////////////////////////////////////
	// Constructor
	/////////////////////////////////////////////
	// Returns a new DataView object using the 
	// passed ArrayBuffer for its storage.
	//
	// DataView DataView(
	//   ArrayBuffer buffer,
	//   optional unsigned long byteOffset,
	//   optional unsigned long byteLength
	// );
	/////////////////////////////////////////////
	
	DataView = function(buffer, byteOffset, byteLength)
	{
		if(byteOffset == null)
			byteOffset = 0;
	
		// Check if we were provoded a length, otherwise initialize it
		if(byteLength == null)
			this.byteLength = buffer.byteLength - byteOffset;
		else 
			this.byteLength = byteLength;
			
		// Verify that we have enough data
		if(this.byteLength + byteOffset > buffer.byteLength)
			throw INDEX_SIZE_ERR;
		
		// MWA - to improve space usage could only initiate the arrays when the user requests the data
		// MWA - writing back is going to be a bitch, its going to have to know which bytes changed and then update 
		// the original to the new values
		// The offset arrays are not acutally using the real data...
		
		// Initialize the byte arrays
		this.int8 = new Int8Array(buffer, byteOffset, this.byteLength);
		this.Uint8 = new Uint8Array(buffer, byteOffset, this.byteLength);
		
		// Create the offset buffers
		var buffer_0 = buffer;
		var buffer_1 = new ArrayBuffer(this.byteLength - 1);
		var buffer_2 = new ArrayBuffer(this.byteLength - 2);
		var buffer_3 = new ArrayBuffer(this.byteLength - 3);
		
		var int8_1 = new Int8Array(buffer_1);
		var int8_2 = new Int8Array(buffer_2);
		var int8_3 = new Int8Array(buffer_3);
		
		int8_1[0] = this.int8[1];
		int8_1[1] = int8_2[0] = this.int8[2];
		for(var i = 3 ; i < this.int8.length; i++)
			int8_1[i-1] = int8_2[i-2] = int8_3[i-3] = this.int8[i];
		
		// Initialize two buffers for each 16bit ints (even and odd)
		var halfLength_0 = Math.floor(this.byteLength/2);
		var halfLength_1 = Math.floor((this.byteLength-1)/2);
		
		this.int16_0 = new Int16Array(buffer_0, 0, halfLength_0);
		this.int16_1 = new Int16Array(buffer_1, 0, halfLength_1);
		
		this.Uint16_0 = new Uint16Array(buffer_0, 0, halfLength_0);
		this.Uint16_1 = new Uint16Array(buffer_1, 0, halfLength_1);


		// Initialize four buffers for each 32bit ints and floats
		var wordLength_0 = Math.floor(this.byteLength/4);
		var wordLength_1 = Math.floor((this.byteLength-1)/4);
		var wordLength_2 = Math.floor((this.byteLength-2)/4);
		var wordLength_3 = Math.floor((this.byteLength-3)/4);

		this.int32_0 = new Int32Array(buffer_0, 0, wordLength_0);
		this.int32_1 = new Int32Array(buffer_1, 0, wordLength_1);
		this.int32_2 = new Int32Array(buffer_2, 0, wordLength_2);
		this.int32_3 = new Int32Array(buffer_3, 0, wordLength_3);

		this.Uint32_0 = new Uint32Array(buffer_0, 0, wordLength_0);
		this.Uint32_1 = new Uint32Array(buffer_1, 0, wordLength_1);
		this.Uint32_2 = new Uint32Array(buffer_2, 0, wordLength_2);
		this.Uint32_3 = new Uint32Array(buffer_3, 0, wordLength_3);

		this.float32_0 = new Float32Array(buffer_0, 0, wordLength_0);
		this.float32_1 = new Float32Array(buffer_1, 0, wordLength_1);
		this.float32_2 = new Float32Array(buffer_2, 0, wordLength_2);
		this.float32_3 = new Float32Array(buffer_3, 0, wordLength_3);


		/////////////////////////////////////////////
 		// Read
 		/////////////////////////////////////////////
 		
 		/////////////////////////////////////////////
 		// byte getInt8(
 		//   unsigned long byteOffset
 		// );
 		/////////////////////////////////////////////
		this.getInt8 = function(byteOffset)
		{
			return this.int8[byteOffset];
		}
		
		/////////////////////////////////////////////
 		// unsigned byte getUint8(
 		//   unsigned long byteOffset
 		// );
  		/////////////////////////////////////////////
		this.getUint8 = function(byteOffset)
		{
			return this.Uint8[byteOffset];
		}

		/////////////////////////////////////////////
 		// short getInt16(
 		//   unsigned long byteOffset, 
 		//   optional boolean littleEndian
 		// );
 		/////////////////////////////////////////////
		this.getInt16 = function(byteOffset, littleEndian)
		{
			var halfOffset = Math.floor(byteOffset/2);
			switch(byteOffset % 2)
			{
				case 0:
					return this.int16_0[halfOffset];
				case 1:
					return this.int16_1[halfOffset];
			}
		}

		/////////////////////////////////////////////
 		// unsigned short getUint16(
 		//   unsigned long byteOffset, 
 		//   optional boolean littleEndian
 		// );
  		/////////////////////////////////////////////
		this.getUint16 = function(byteOffset, littleEndian)
		{
			var halfOffset = Math.floor(byteOffset/2);
			switch(byteOffset % 2)
			{
				case 0:
					return this.Uint16_0[halfOffset];
				case 1:
					return this.Uint16_1[halfOffset];
			}
		}

		/////////////////////////////////////////////
 		// long getInt32(
 		//   unsigned long byteOffset, 
 		//   optional boolean littleEndian
 		// );
  		/////////////////////////////////////////////
		this.getInt32 = function(byteOffset, littleEndian)
		{
			var wordOffset = Math.floor(byteOffset/4);
			switch(byteOffset % 4)
			{
				case 0:
					return this.int32_0[wordOffset];
				case 1:
					return this.int32_1[wordOffset];
				case 2:
					return this.int32_2[wordOffset];
				case 3:
					return this.int32_3[wordOffset];
			}
		}

		/////////////////////////////////////////////
 		// unsigned long getUint32(
 		//   unsigned long byteOffset, 
 		//   optional boolean littleEndian
 		// );
  		/////////////////////////////////////////////
		this.getUint32 = function(byteOffset, littleEndian)
		{
			var wordOffset = Math.floor(byteOffset/4);
			switch(byteOffset % 4)
			{
				case 0:
					return this.Uint32_0[wordOffset];
				case 1:
					return this.Uint32_1[wordOffset];
				case 2:
					return this.Uint32_2[wordOffset];
				case 3:
					return this.Uint32_3[wordOffset];
			}
		}

		/////////////////////////////////////////////
 		// float getFloat32(
 		//   unsigned long byteOffset, 
 		//   optional boolean littleEndian
 		// );
  		/////////////////////////////////////////////
		this.getFloat32 = function(byteOffset, littleEndian)
		{
			var wordOffset = Math.floor(byteOffset/4);
			switch(byteOffset % 4)
			{
				case 0:
					return this.float32_0[wordOffset];
				case 1:
					return this.float32_1[wordOffset];
				case 2:
					return this.float32_2[wordOffset];
				case 3:
					return this.float32_3[wordOffset];
			}
		}

		/////////////////////////////////////////////
 		// double getFloat64(
 		//   unsigned long byteOffset, 
 		//   optional boolean littleEndian
 		// );
  		/////////////////////////////////////////////
		this.getFloat64 = function(byteOffset, littleEndian)
		{
			throw -1;
		}

		/////////////////////////////////////////////
 		// Write
 		/////////////////////////////////////////////

		/////////////////////////////////////////////
 		// void setInt8(
 		//   unsigned long byteOffset, 
 		//   byte value
		// );
  		/////////////////////////////////////////////
		this.setInt8 = function(byteOffset, value)
		{
			this.int8[byteOffset] = value;
		}

		/////////////////////////////////////////////
 		// void setUint8(
 		//   unsigned long byteOffset, 
 		//   unsigned byte value
		// );
  		/////////////////////////////////////////////
		this.setUint8 = function(byteOffset, value)
		{
			this.Uint8[byteOffset] = value;
		}

		/////////////////////////////////////////////
 		// void setInt16(
 		//   unsigned long byteOffset, 
 		//   short value,
 		//   optional boolean littleEndian
		// );
  		/////////////////////////////////////////////
		this.setInt16 = function(byteOffset, value, littleEndian)
		{
			throw -1;
		}

		/////////////////////////////////////////////
 		// void setUint16(
 		//   unsigned long byteOffset, 
 		//   unsigned short value,
 		//   optional boolean littleEndian
		// );
  		/////////////////////////////////////////////
		this.setUint16 = function(byteOffset, value, littleEndian)
		{
			throw -1;
		}
		
		/////////////////////////////////////////////
 		// void setInt32(
 		//   unsigned long byteOffset, 
 		//   long value,
 		//   optional boolean littleEndian
		// );
  		/////////////////////////////////////////////
		this.setInt32 = function(byteOffset, value, littleEndian)
		{
			throw -1;
		}

		/////////////////////////////////////////////
 		// void setUint32(
 		//   unsigned long byteOffset, 
 		//   unsigned long value,
 		//   optional boolean littleEndian
		// );
  		/////////////////////////////////////////////
		this.setUint32 = function(byteOffset, value, littleEndian)
		{
			throw -1;
		}

		/////////////////////////////////////////////
 		// void setFloat32(
 		//   unsigned long byteOffset, 
 		//   float value,
 		//   optional boolean littleEndian
		// );
  		/////////////////////////////////////////////
		this.setFloat32 = function(byteOffset, value, littleEndian)
		{
			throw -1;
		}

		/////////////////////////////////////////////
 		// void setFloat64(
 		//   unsigned long byteOffset, 
 		//   double value,
 		//   optional boolean littleEndian
		// );
  		/////////////////////////////////////////////
		this.setFloat64 = function(byteOffset, value, littleEndian)
		{
			throw -1;
		}
	}
}