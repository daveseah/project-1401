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
	
/** OBJECT DECLARATION *******************************************************/

	/* constructor */
	/* extends THREE.PointCloud */
	function StarField ( threeColor, width, height ) {

		var geo = m_GeneratePointCloudGeometry( threeColor, width, height );
		var mat = new THREE.PointCloudMaterial( { size: POINTSIZE, vertexColors: THREE.VertexColors } );

		// pass up constructor
		THREE.PointCloud.call( this, geo, mat );
	}
	/* inheritence */
	StarField.inheritsFrom(THREE.PointCloud);


/** SUPPORT FUNCTIONS ********************************************************/

/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/*/	returns a THREE.BufferGeometry object in a unit space
	scale it up to make it shine
/*/	function m_GeneratePointCloudGeometry( color, width, height ){

		var geometry = new THREE.BufferGeometry();
		var numPoints = width*height;

		var positions = new Float32Array( numPoints*3 );
		var colors = new Float32Array( numPoints*3 );

		var k = 0;
		var dx = 1/width;
		var dy = 1/height;

		for( var i = 0; i < width; i++ ) {

			for( var j = 0; j < height; j++ ) {

				var u = i / width;
				var v = j / height;
				var x = (u - 0.5) + ((Math.random()-0.5)*dx);
				var y = (v - 0.5) + ((Math.random()-0.5)*dy);
//				var x = (u - 0.5);
//				var y = (v - 0.5);
				var z = 0;

				positions[ 3 * k ] = x;
				positions[ 3 * k + 1 ] = y;
				positions[ 3 * k + 2 ] = z;

				var intensity = 0.25 + Math.random();
				colors[ 3 * k ] = color.r * intensity;
				colors[ 3 * k + 1 ] = color.g * intensity;
				colors[ 3 * k + 2 ] = color.b * intensity;

				k++;

			}

		}

		geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
		geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
		geometry.computeBoundingBox();

		return geometry;

	}


/** RETURN CONSTRUCTOR *******************************************************/

	return StarField;

});
