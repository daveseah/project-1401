/* Renderer-Background */
define ([
	'three',
	'1401/system/resources'
], function ( 
	THREE,
	RES 
){

/*/	ThreeJS Renderer Background

	This module handles background elements

/*/


/** private module declarations *********************************************/

this.name = 'RendererBGInternal';
var _this_renderer_bg = this;


/** MODULE UTILITY FUNCTIONS *************************************************/	

var bg_sprite;

// param textureName, param.viewport.width/height
function m_ShowBackgroundStill ( threeScene, param ) {
//	var bgMap = THREE.ImageUtils.loadTexture("/images/bg.png");

	var bgMap = RES.LoadTexture(param.textureName,mi_SaveHeight);
	var bgMat = new THREE.SpriteMaterial( {map:bgMap} );
	bg_sprite = new THREE.Sprite(bgMat);
	bg_sprite.scale.set(param.viewport.width, param.viewport.height,1);
	bg_sprite.position.set(0,0,-100);
	threeScene.add(bg_sprite);
	function mi_SaveHeight(texture) {
		bg_sprite.inqSrcWidth = texture.image.width;
		bg_sprite.inqSrcHeight = texture.image.height;
		if (param.callee && param.onSuccess) success.call(param.callee, texture);
	}

}

//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var cam_stream;
var cam_image;
var cam_image_context;
var cam_texture;
var cam_material;
var cam_geometry;
var cam_screen;

function m_ShowWebcamScreen ( threeScene, param ) {

	if (cam_stream) {
		cam_screen.visible = true;
		return;
	}

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	window.URL = window.URL || window.webkitURL;
	cam_stream = document.createElement('video');

	INQBUG.log("*** Requesting WEBCAM ACCESS...");
	navigator.getUserMedia({video: true}, gotStream, noStream);	

	function gotStream( stream ) {
		cam_stream.src = window.URL.createObjectURL(stream);
		cam_stream.play();
		cam_stream.onerror = function (e) { cam_stream.stop(); };
		cam_stream.onended = noStream;
		INQBUG.log("*** WEBCAM stream is captured!");

		cam_image = document.createElement('canvas');
		cam_image.width = 640;
		cam_image.height = 480;

		cam_image_context = cam_image.getContext('2d');

		cam_image_context.fillStyle = '#0000FF';
		cam_image_context.fillRect (0,0,cam_image.width,cam_image.height);
		INQBUG.log(cam_image.width+" width");

		cam_texture = new THREE.Texture ( cam_image );
		cam_texture.minFilter = THREE.LinearFilter;
		cam_texture.magFilter = THREE.LinearFilter;
		cam_texture.format = THREE.RGBFormat;
		cam_texture.generateMipmaps = false;
		var camSpec = {
			map: cam_texture,
			overdraw: true,
			side: THREE.DoubleSide
		};
		cam_material = new THREE.MeshBasicMaterial( camSpec );
		var scalefit =( param.viewport.width / cam_image.width ); 
		cam_geometry = new THREE.PlaneGeometry(
			cam_image.width * scalefit, cam_image.height * scalefit
		);
		cam_screen = new THREE.Mesh( cam_geometry, cam_material );
		cam_screen.rotation.y = (param.flipped) ? Math.PI : 0;
		cam_screen.position.set(0,0,-85);
//		scenes.background[0].scene.add(cam_screen);
		threeScene.add(cam_screen);
	}

	function noStream( error ) {
		if (error.code==1) INQBUG.log('RENDERER.enableWebCam','user denied access');
	}
}

//	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


var video_stream;
var video_image;
var video_image_context;

var video_sprite;
var video_texture;
var video_material;
var video_screen;
var video_geometry;

function m_ShowBackgroundVideo ( threeScene, param ) {

	if (video_stream) {
		video_screen.visible=true;
		return;
	}

	var url = param.url || 'video/video.mp4';

    // create unattached video element
    video_stream = document.createElement('video');
    video_stream.loop = true;
    video_stream.addEventListener('loadedmetadata', function( event ){
		param.videoWidth = this.videoWidth;
		param.videoHeight = this.videoHeight;
		completeLoad.call(_this_renderer_bg,threeScene,param);
    });
    video_stream.src = url;
    video_stream.load();
    video_stream.play();

    function completeLoad ( threeScene, param ) {

		console.log('VideoDimensions:'+param.videoWidth +'x'+ param.videoHeight);

		var vport = param.viewport;

		video_image = document.createElement('canvas');
		// this is the native size of the video
		video_image.width = param.videoWidth || 854;
		video_image.height = param.videoHeight || 480;

		video_image_context = video_image.getContext('2d');
		video_image_context.fillStyle = '#00FFFF';
		video_image_context.fillRect (0, 0, video_image.width, video_image.height);

		video_texture = new THREE.Texture ( video_image );
		video_texture.minFilter = THREE.LinearFilter;
		video_texture.magFilter = THREE.LinearFilter;
		video_texture.format = THREE.RGBFormat;
		video_texture.generateMipmaps = false;
		var movieSpec = {
			map: video_texture,
			overdraw: true,
			side: THREE.DoubleSide
		};
		video_material = new THREE.MeshBasicMaterial( movieSpec );
		var scalefit = ( vport.width / video_image.width ); 
		video_geometry = new THREE.PlaneGeometry(
			video_image.width * scalefit, video_image.height * scalefit,
			4,4
		);
		video_screen = new THREE.Mesh( video_geometry, video_material);
		video_screen.position.set(0,0,-90);
		// scenes.background[0].scene.add(video_screen);
		threeScene.add(video_screen);
	}

}


function m_UpdateVideoBackground () {
	if (video_stream) {
		if (video_stream.readyState === video_stream.HAVE_ENOUGH_DATA)
		{
			video_image_context.drawImage (video_stream, 0, 0);
			if (video_texture) video_texture.needsUpdate = true;
		}
	}
	if (cam_stream) {
		if (cam_stream.readyState === cam_stream.HAVE_ENOUGH_DATA) 
		{
			cam_image_context.drawImage(cam_stream,0,0);
			if (cam_texture) cam_texture.needsUpdate = true;
		}
	}
}

/** MODULE DEFINITION ********************************************************/	

	var module = {};
	module.name = "RenderBgAPI";

	module.GetBackgroundStillSprite = function () {
		return bg_sprite;
	};

	module.ShowBackgroundStill = function ( threeScene, param ) {
		if (param && param.textureName && param.viewport) {
			m_ShowBackgroundStill(threeScene, param);
		} else {
			INQBUG.error(this,'ShowBackgroundStill requires param.textureName, viewport');
		}
	};

	module.ShowWebcamScreen = function ( threeScene, param ) {
		m_ShowWebcamScreen(threeScene, param);
	};

	module.ShowVideoBackground = function ( threeScene, param ) {
		if (param && param.url) {
			m_ShowBackgroundVideo (threeScene, param);
		} else {
			INQBUG.error(this,'ShowVideoBackground requires param.url');

		}
	};

	module.Update = function () {
		m_UpdateVideoBackground();
	};

	return module;


});

