/* starfield */
define ([
	'three'
], function (
	THREE
) {

	var DBGOUT = true;

/**	STARFIELD ****************************************************************\

	Code based on example:
	http://threejs.org/examples/webgl_interactive_raycasting_pointcloud.html


/** PRIVATE DECLARATIONS *****************************************************/

	var POINTSIZE = 0.0001;
	var NUMLAYERS = 3;
	var STARSCALE = 2048;
	var STARWRAP = STARSCALE / 2;
	var STARBOUND = STARWRAP / 2;
	
/** OBJECT DECLARATION *******************************************************/

	/* constructor */
	/* extends THREE.PointCloud */
	function StarField ( threeColor ) {

		this.speed = 1;

		var geo = m_GeneratePointCloudGeometry( threeColor );
		var mat = new THREE.PointCloudMaterial( { size: POINTSIZE, vertexColors: THREE.VertexColors } );

		// pass up constructor
		THREE.PointCloud.call( this, geo, mat );

		this.scale.set(STARSCALE,STARSCALE,1);
	}
	/* inheritence */
	StarField.inheritsFrom(THREE.PointCloud);


///	PROPERTIES ///////////////////////////////////////////////////////////////
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	StarField.method('SetSpeed', function ( val ) {
		this.speed = val;
	});	


///	POSITION ACCESS METHODS //////////////////////////////////////////////////
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	StarField.method('TrackXYZ', function ( x, y, z ) {
		var xx = m_WrapCoordinates (-x * this.speed);
		var yy = m_WrapCoordinates (-y * this.speed);
		this.position.x = xx;
		this.position.y = yy;
		this.position.z = z * this.speed;
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	StarField.method('Track', function ( vector3 ) {
		this.TrackXYZ(vector3.x, vector3.y, vector3.z);
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	StarField.method('TrackXY', function ( x, y ) {
		this.TrackXYZ( x,y,this.position.z );
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	StarField.method('TrackX', function ( x ) {
		this.TrackXYZ( x, this.position.y, this.position.z );
	});
///	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	StarField.method('TrackY', function ( y ) {
		this.TrackXYZ( this.position.x, y, this.position.z );
	});


/** SUPPORT FUNCTIONS ********************************************************/

/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	Returns a THREE.BufferGeometry object, spaced by 1 point per unit.
	The actual position is randomized. The buffer object has four identical
	repeating quadrants.
/*/	function m_GeneratePointCloudGeometry( color ) {

		var pointsWide = 20; 
		var pointsHigh = 20;
		var geometry = new THREE.BufferGeometry();
		var numPoints = pointsWide*pointsHigh;
		var off = numPoints/4;
		if (Math.floor(off)!==off) console.error("point cloud needs to have pointnum divisible by 4");

		var positions = new Float32Array( numPoints*3 );
		var colors = new Float32Array( numPoints*3 );

		var k = 0;
		var dx = 1/pointsWide;
		var dy = 1/pointsHigh;

		for( var i = 0; i < pointsWide / 2; i++ ) {

			for( var j = 0; j < pointsHigh / 2; j++ ) {

				var u = i / pointsWide;
				var v = j / pointsHigh;
				var x = (u - 0.5) + ((Math.random()-0.5)*dx);
				var y = (v - 0.5) + ((Math.random()-0.5)*dy);
				var z = 0;

				// console.log(3*k,3*(k+off),3*(k+off*2),3*(k+off*3));
				positions[ 3 * k ] = x;
				positions[ 3 * k + 1 ] = y;
				positions[ 3 * k + 2 ] = z;

				positions[ 3 * (k+off) ] = x + 0.5;
				positions[ 3 * (k+off) + 1 ] = y;
				positions[ 3 * (k+off) + 2 ] = z;

				positions[ 3 * (k+off*2) ] = x;
				positions[ 3 * (k+off*2) + 1 ] = y + 0.5;
				positions[ 3 * (k+off*2) + 2 ] = z;

				positions[ 3 * (k+off*3) ] = x + 0.5;
				positions[ 3 * (k+off*3) + 1 ] = y + 0.5;
				positions[ 3 * (k+off*3) + 2 ] = z;

				var intensity = 0.25 + Math.random();

				colors[ 3 * k ] = color.r * intensity;
				colors[ 3 * k + 1 ] = color.g * intensity;
				colors[ 3 * k + 2 ] = color.b * intensity;

				colors[ 3 * (k+off) ] = color.r * intensity;
				colors[ 3 * (k+off) + 1 ] = color.g * intensity;
				colors[ 3 * (k+off) + 2 ] = color.b * intensity;

				colors[ 3 * (k+off*2) ] = color.r * intensity;
				colors[ 3 * (k+off*2) + 1 ] = color.g * intensity;
				colors[ 3 * (k+off*2) + 2 ] = color.b * intensity;

				colors[ 3 * (k+off*3) ] = color.r * intensity;
				colors[ 3 * (k+off*3) + 1 ] = color.g * intensity;
				colors[ 3 * (k+off*3) + 2 ] = color.b * intensity;

				k++;

			}

		}

		geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
		geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
		geometry.computeBoundingBox();

		return geometry;

	}

	function m_WrapCoordinates ( c ) {
		c = c % STARWRAP;
		if (c > +STARBOUND) c = c - STARWRAP;
		if (c < -STARBOUND) c = c + STARWRAP;
		return c;
	}


/** RETURN CONSTRUCTOR *******************************************************/

	return StarField;

});
