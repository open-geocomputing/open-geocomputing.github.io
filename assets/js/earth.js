import * as THREE from 'https://unpkg.com/three@0.108.0/build/three.module.js';

function main() {
	var month=new Date().getMonth()+1;
	var month=String(month).padStart(2, '0');
	var width  = window.innerWidth;
	var height = window.innerHeight;

	// Earth params
	var radius   = 1;
	var segments = 64;
	var rotation = 6; 

	const canvas = document.querySelector('#earth-gl');
	const renderer = new THREE.WebGLRenderer({canvas});
	renderer.setSize(width, height);

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
	camera.position.z = radius*3;


	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

	renderer.render(scene, camera);

	scene.add(new THREE.AmbientLight(0x333333));

	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(5,3,5);
	// light.castShadow = true; // default false
	scene.add(light);

	// light.shadow.mapSize.width = 512; // default
	// light.shadow.mapSize.height = 512; // default
	// light.shadow.camera.near = 0.5; // default
	// light.shadow.camera.far = 500; // default

	var sphere = createSphere(radius, segments);
	sphere.rotation.y = rotation; 
	scene.add(sphere)

    var clouds = createClouds(radius, segments);
	clouds.rotation.y = rotation;
	scene.add(clouds)

	var stars = createStars(90, 64);
	scene.add(stars);

	// var controls = new THREE.TrackballControls(camera);

	// webglEl.appendChild(renderer.domElement);

	render();

	function render() {
		// controls.update();
		sphere.rotation.y += 0.0005;
		clouds.rotation.y += 0.0006;
		scroll=document.documentElement.scrollTop;
		var angleEarth= Math.sin(-scroll*0.001)
		sphere.rotation.x= angleEarth;
		clouds.rotation.x= angleEarth;
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	function createSphere(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/world.2004'+month+'.png'),
				bumpMap:     THREE.ImageUtils.loadTexture('images/elevation.png'),
				bumpScale:   0.005,
				specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
				specular:    0x444444							
			})
		);
	}

	function createClouds(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius + 0.01, segments, segments),			
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/cloud.png'),
				transparent: true
			})
		);		
	}

	function createStars(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments), 
			new THREE.MeshBasicMaterial({
				map:  THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'), 
				side: THREE.BackSide
			})
		);
	}

	window.addEventListener( 'resize', onWindowResize, false );

	function onWindowResize(){

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

}



// window.onscroll = function(){
// 	console.log(document.body.scrollTop)
// 	console.log(document.documentElement.scrollTop)

// }

main();

