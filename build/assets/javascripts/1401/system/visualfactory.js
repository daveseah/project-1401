/* visualfactory.js */
define ([
	'three',
	'1401/objects/viewport',
	'1401/settings',
	'1401/system/loader',
	'1401/objects/sprite'
], function ( 
	THREE,
	VIEWPORT,
	SETTINGS,
	LOADER,
	InqSprite
) {

	var DBGOUT = true;

/**	VISUALFACTORY ************************************************************\

	ThreeJS-based rendering system

	Note InqSprite is a constructor for the InqSprite Sprite Class, loaded
	through requireJS above!


/** MODULE PRIVATE VARIABLES *************************************************/

	var DEFAULT_SPR_TEXTURE = null;

/** PUBLIC API ***************************************************************/

	var API = {};
	API.name = "visualfactory";

	// implement preloading of default texture
	API.LoadAssets = function ( callback ) {
		var path = SETTINGS.SystemPath('common/default-visual.png');
		DEFAULT_SPR_TEXTURE = THREE.ImageUtils.loadTexture (path,THREE.UVMAPPING,
			la_onload, la_onerr);
		function la_onload ( texture ) {
			console.log("VisualFactory.LoadAssets Complete");
			// signal we are done loading
			if (callback) callback(this);
		}
		function la_onerr ( err ) {
			console.log("LoadAssets",err);
		}

	}

/// OBJECT MAKERS ///////////////////////////////////////////////////////////

	API.MakeDefaultSprite = function () {
		var spr;
		if (DEFAULT_SPR_TEXTURE) {
			var mat = new THREE.SpriteMaterial({
				map: DEFAULT_SPR_TEXTURE,
				color: 0xffffff
			});
			console.assert(mat, "could not create THREE.SpriteMaterial");
			spr = new InqSprite(mat);
			console.assert(spr, "could not create THREE.Sprite");
			// this texture is valid after LoadAssets()
			var ww = DEFAULT_SPR_TEXTURE.image.width;
			var hh = DEFAULT_SPR_TEXTURE.image.height;
			spr.SetScaleXYZ(ww,hh,1);
		} else {
			console.error("DEFAULT_SPR_TEXTURE is undefined");
		}
		return spr;	
	};

/*/	Main Sprite Maker Method. 
/*/	API.MakeStaticSprite = function ( texturePath, onValid ) {
		if (typeof texturePath != 'string') throw "texturePath must be string";
		if (!texturePath) throw "texturePath can not be empty";
		if (!onValid) console.warn("MakeSprite: onValid callback for notification recommended!");

		var bm = THREE.ImageUtils.loadTexture( texturePath, THREE.UVMAPPING, mss_onload, mss_onerr );
		console.assert (bm, "could not retrieve bitmap from loader");

		var mat = new THREE.SpriteMaterial( {map:bm, color:0xffffff} );
		console.assert(mat, "could not create THREE.SpriteMaterial");

		var threeSprite = new InqSprite (mat);
		console.assert(threeSprite, "could not create THREE.Sprite");

		function mss_onload ( texture ) {
			var ww = texture.image.width;
			var hh = texture.image.height;
			threeSprite.SetScaleXYZ(ww,hh,1);
			console.log("MakeStaticSprite","setting scale",ww+'x'+hh);
			if (onValid) onValid(texture);
		}
		function mss_onerr ( err ) {
			console.log("MakeStaticSprite",err);
		}

		// return object3d
		return threeSprite;
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/ MakeGroundPlane() creates a obj3d at location 0,0,0 with
	width, depth, aligned to the default camera views.
/*/	API.MakeGroundPlane = function ( spec ) {
		spec = spec || {};
		spec.width = (spec.width===undefined) ? 1 : spec.width;
		spec.depth = (spec.depth===undefined) ? 1 : spec.depth;
		spec.color = (spec.color===undefined) ? 0x0000FF : spec.color;
		var geom = new THREE.PlaneGeometry(1, 1, 1, 1);
		var mat = new THREE.MeshBasicMaterial({ 
			color: spec.color, 
			side: THREE.DoubleSide 
		});
		mat.transparent = true;
		mat.opacity = 0.3;
		var mesh = new THREE.Mesh(geom,mat);
		mesh.position.z = -1;
		mesh.scale.x = spec.width;
		mesh.scale.y = spec.depth

		mesh.SetSize = function ( w, h ) {
			// size by scale
			this.scale.x = w;
			this.scale.y = h;
		};
		return mesh;
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.MakeTextSprite = function ( text, spec ) {
		/* very very raw */
		spec = m_ValidateTextSpec(spec);

		var canvas = document.createElement('canvas');

		m_RenderTextToCanvas(text,canvas,spec);

		var tex = new THREE.Texture(canvas);
			tex.needsUpdate = true;
	
		var mat = new THREE.SpriteMaterial({ 
			map: tex,
			useScreenCoordinates:false
		});

		var spr = new THREE.Sprite (mat);
		spr.textContext = {
			canvas: canvas,
			spec: spec
		};

		var fudgeScale = 0.01;	// fudge factor until coordinates are worked out.
		spr.scale.set(canvas.width * fudgeScale, canvas.height * fudgeScale, 1);

		// add some text functions
		spr.SetText = function (text) {
			// console.log('\n SetText:',text,this.textContext,'\n\n');
			m_RenderTextToCanvas(text,this.textContext.canvas,this.textContext.spec);
			this.material.map.needsUpdate = true;
			this.scale.set(canvas.width * fudgeScale, canvas.height * fudgeScale, 1);
		};
		spr.Hide = function () {
			this.visible=false;
		};
		spr.Show = function () {
			this.visible=true;
		};

		return spr;

	};

//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.MakeRectangle = function ( spec ) {
		spec = spec || {};
		spec.width = (spec.width===undefined) ? 1 : spec.width;
		spec.height = (spec.height===undefined) ? 1 : spec.height;
		spec.color = (spec.color===undefined) ? 0x0000FF : spec.color;
		var mat = new THREE.MeshBasicMaterial({ 
			color: spec.color, 
			side: THREE.DoubleSide 
		});
		// set geom to unit size, and adjust size by scale
		var geo = new THREE.PlaneGeometry(1, 1, 1, 1);
		var mesh = new THREE.Mesh(geo,mat);
		mesh.scale.set(spec.width,spec.height,1);

		// add some utilities
		mesh.SetPositionByTL = function (xt,yt) {
			// remember +y is top
			// size by scale
			var offx = this.scale.x/2;
			var offy = this.scale.y/2;
			this.position.x = xt+offx;
			this.position.y = yt-offy;
		};
		mesh.SetPositionByBL = function (xb,yb) {
			// remember +y is top
			// size by scale
			var offx = this.scale.x/2;
			var offy = this.scale.y/2;
			this.position.x = xb+offx;
			this.position.y = yb+offy;
		};
		mesh.SetHeightFromBottom = function ( h ) {
			// size by scale
			var sy = this.scale.y;
			var by = this.position.y-(sy/2);
			this.scale.y = h;
			this.position.y = by+h/2;
		};

		// return visual
		return mesh;
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.MakeCircle = function ( spec ) {
		spec = spec || {};
		spec.radius = spec.radius || 10;
		spec.segments = spec.segments || 10;
		spec.color = (spec.color===undefined) ? 0x0000FF : spec.color;
		var mat = new THREE.MeshBasicMaterial({ 
			color: spec.color, 
			side: THREE.DoubleSide 
		});
		var geo = new THREE.CircleGeometry( spec.radius, spec.segments );
		var mesh = new THREE.Mesh( geo, mat );
		return mesh;
	};
//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	API.MakeLine = function ( spec ) {
	//	spec.color, spec.linewidth (does not work >1 on windows client)
		spec = spec || {};
		spec.color = (spec.color===undefined) ? 0x000000 : spec.color;
		spec.linewidth = spec.linewidth || 1;
		var geo = new THREE.Geometry();
		var mat = new THREE.LineBasicMaterial(spec);
		// these vertices can be changed and then set to update
		// later for moving the lines around
		geo.vertices.push(new THREE.Vector3(-200,-100,0));
		geo.vertices.push(new THREE.Vector3(-100,50,0));
		geo.verticesNeedUpdate = true;
		var line = new THREE.Line(geo,mat);
		return line;
	};


/** PRIVATE SUPPORT FUNCTIONS ************************************************/


///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Validates a TextSpriteSpec, which is used by MakeTextSprite() to create
	a special THREE.Sprite (not based on InqSprite)
/*/	function m_ValidateTextSpec ( spec ) {
		spec = spec || {};
		spec.size = spec.size || 24;
		spec.style = spec.style || 'normal';
		spec.family = spec.family || 'Arial';
		spec.color = spec.color || '#ffffff';
		return spec;
	}

///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Given a string of text, a html5 canvas, and a TextSpriteSpec, size and
	render into its context2d. Set sprite.map.needsUpdate=true to see changes
	appear after modifying.
/*/	function m_RenderTextToCanvas ( text, canvas, spec ) {
		spec = m_ValidateTextSpec(spec);
		var fontString = spec.style+' '+spec.size+'px '+'"'+spec.family+'"';

		var context = canvas.getContext('2d');
		context.font = fontString;
		var width = Math.ceil(context.measureText(text).width);
		var height = Math.ceil(spec.size);

		// console.log('\n DBG:',width,height,fontString,'\n\n');

		// this resets the context parameters
		canvas.width = width;
		canvas.height = height;

		context.font = fontString;
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillStyle = spec.color;
		context.fillText(text, width/2, height/2);
	}

/** RETURN MODULE DEFINITION FOR REQUIREJS ***********************************/

	return API;

});