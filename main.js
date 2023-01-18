import './stylesheet.css'
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let scene, camera, renderer, starBox, stars, vertices;

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

//const axesHelper = new THREE.AxesHelper( 5 );

//const controls = new OrbitControls(camera, renderer.domElement)
//controls.enableDamping = true

renderer.setClearColor( 0x100c0c );

const objLoader = new OBJLoader()

starBox = new THREE.BufferGeometry();
vertices = {
    positions: [],
    accelerations: [],
    velocities: [],
};
for(let i = 0; i < 18000; i++) {
    vertices.positions.push(Math.random() * 600 - 300);
    if(i % 3 === 0) {
        vertices.accelerations.push(0);
        vertices.velocities.push(.2);
    }
}
starBox.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices.positions), 3));

let starImage = new THREE.TextureLoader().load('./images/Particle.png');
let starMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.7,
    map: starImage
});
stars = new THREE.Points(starBox, starMaterial);
scene.add(stars);

objLoader.load('./models/Skeleton.obj', function(object) {

  object.traverse(function(child) {

      if (child.isMesh) {

          var wireframeGeomtry = new THREE.WireframeGeometry(child.geometry);
          var wireframeMaterial = new THREE.LineBasicMaterial({
              color: 0xee5a24
          });
          var wireframe = new THREE.LineSegments(wireframeGeomtry, wireframeMaterial);

          // add to child so we get same orientation
          child.add(wireframe);
          // to parent of child. Using attach keeps our orietation
          child.parent.attach(wireframe);
          // remove child (we don't want child)
          child.parent.remove(child);

      }
  });

  var mouse = new THREE.Vector2();
					
					let plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -1);
					let raycaster = new THREE.Raycaster();
					let pointOfIntersection = new THREE.Vector3();
					
					window.addEventListener('mousemove', function(e) {
    
  					mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
					mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1
						
					raycaster.setFromCamera(mouse, camera);
					raycaster.ray.intersectPlane(plane, pointOfIntersection);
					object.lookAt(pointOfIntersection);
					}); 

  object.translateX(20);
 // object.translateY(-10);
  object.translateZ(-10);
  

  scene.add(object);

});


animate();

function animate() {
  for(let i = 0; i < vertices.velocities.length; i++) {
    vertices.velocities[i / 3 + i % 3] += vertices.accelerations[i];
    vertices.positions[i * 3 + 1] -= vertices.velocities[i];
    if(vertices.positions[i*3 +1] < -200) {
        vertices.positions[i * 3 + 1] = 400;
        vertices.velocities[i / 3 + i % 3] = 0;
    }
}
stars.rotation.y += 0.002;
starBox.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices.positions), 3));
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

}



const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry)
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }else{
      entry.target.classList.remove('show');
    }
  });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) =>observer.observe(el));

//scrolling 
const collection = document.getElementsByClassName("card");
const spitfireslide = document.getElementsByClassName("spitfireCards");
const websiteslide = document.getElementsByClassName("web");
const gymslide = document.getElementsByClassName("gym")
const gameslide = document.getElementsByClassName("game")
collection[0].addEventListener("click", ScrollSpitfire);
collection[1].addEventListener("click", ScrollGym);
collection[2].addEventListener("click", ScrollGame);
collection[3].addEventListener("click", ScrollWebsite);

function ScrollSpitfire(){
  const sslide = spitfireslide[0];
  const sy = sslide.getBoundingClientRect().top + window.pageYOffset;
 // element.scrollIntoView();
 window.scrollTo({top: sy, behavior: 'smooth'});
}
function ScrollGym(){
  const wslide = gymslide[0];
  const gy = wslide.getBoundingClientRect().top + window.pageYOffset;
 // element.scrollIntoView();
 window.scrollTo({top: gy, behavior: 'smooth'});
}
function ScrollGame(){
  const gaslide = gameslide[0];
  const gay = gaslide.getBoundingClientRect().top + window.pageYOffset;
 // element.scrollIntoView();
 window.scrollTo({top: gay, behavior: 'smooth'});
}
function ScrollWebsite(){
  const wslide = websiteslide[0];
  const wy = wslide.getBoundingClientRect().top + window.pageYOffset;
 // element.scrollIntoView();
 window.scrollTo({top: wy, behavior: 'smooth'});
}



