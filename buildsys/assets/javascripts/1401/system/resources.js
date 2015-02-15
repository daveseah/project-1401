define ( ['three'], function ( three ) {

/*/	ThreeJS Resource Manager

	Manages assets that should be loaded once and shared multiple times.

/*/

/** MODULE PRIVATE DECLARATIONS **********************************************/

var m_threeMaps = [];	// ThreeJS.Texture

/** MODULE PRIVATE FUNCTIONS *************************************************/

/// UTILITY METHODS ///////////////////////////////////////////////////////////

/*/	loads a texture map, returns Three.Texture
	caches texture in m_tree_maps
/*/	function m_LoadTexture ( textureName, onLoad, onError ) {
		try {
			if (typeof textureName != 'string') throw "Name must be string";
			if (!textureName) throw "textureName can not be empty";

			if (textureName.charAt(0)!='/') {
				textureName = textureName;
			}

			if (m_threeMaps[textureName]) {
				if (onLoad !== undefined) onLoad(m_threeMaps[textureName]);
				return m_threeMaps[textureName];
			} else {
				var map = THREE.ImageUtils.loadTexture( textureName, THREE.UVMapping, 
					function ( event ) { if (onLoad !== undefined) onLoad(event); },
					function ( event ) { if (onError !== undefined) onError(event); } 
				);
				if (!map) throw "could not load map "+textureName;
				m_threeMaps[textureName]=map;
				return map;
			}
		} catch (err) {
			console.log(this.name,"mLoadTexture "+err);
		}
	}

/*/	loads a UNIQUE texture map, returns Three.Texture
	copies texture in m_tree_maps into new instance
/*/	function m_LoadUniqueTexture ( textureName, onLoad, onError ) {
		try {
			if (typeof textureName != 'string') throw "Name must be string";
			if (!textureName) throw "textureName can not be empty";

			if (textureName.charAt(0)!='/') {
				textureName = '/javascripts/app/inqsim/activities/'+textureName;
			}
			var map = THREE.ImageUtils.loadTexture( textureName, THREE.UVMapping, 
				function ( event ) { if (onLoad !== undefined) onLoad(event); },
				function ( event ) { if (onError !== undefined) onError(event); } 
			);
			return map;
		} catch (err) {
			console.log(this.name,"mLoadTexture "+err);
		}
	}



/** MODULE DEFINITION ********************************************************/	

var API = {};
	API.name = "sys.resources";

	API.LoadTexture = function ( textureName, onLoad, onError ) {
		return m_LoadTexture(textureName, onLoad, onError);
	};

	API.LoadUniqueTexture = function ( textureName, onLoad, onError ) {
		return m_LoadUniqueTexture ( textureName, onLoad, onError );
	};

	return API;

});

