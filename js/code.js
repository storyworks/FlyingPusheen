function getTimeOfDay() {
  const date = parseInt(new Date().toLocaleTimeString().slice(0, 2));
  if (date > 19 || date < 5) {
    return 'night';
  } else if (date > 4 && date <= 7) {
    return 'sunrise';
  } else if (date > 7 && date <= 10) {
    return 'morning';
  } else if (date > 10 && date <= 13) {
    return 'midday';
  } else if (date > 13 && date <= 16) {
    return 'afternoon';
  } else if (date > 16 && date <= 19) {
    return 'sunset';
  }
}

const timeOfDay = getTimeOfDay();

//COLORS
var Colors = {
  waveBlue: 0x3763cc,
  waveLightBlue: 0x3788cc,
  grey: 0xb2b2b2,
  darkgrey: 0x515151,
  blue: 0xa3cffe,
  yellow: 0xfeda79,
  coral: 0xfe99b7,
  purple: 0xe39dff,
  aqua: 0xa3ffea,
  pink: 0xfaa2df,

  white: 0xffffff,
  darkblue: 0x3763cc,
  black: 0x000000,
};

function getLightColour() {
  switch (timeOfDay) {
    case 'night':
      return Colors.darkgrey;
    case 'sunrise':
      return Colors.yellow;
    case 'morning':
      return Colors.blue;
    case 'midday':
      return Colors.white;
    case 'afternoon':
      return Colors.yellow;
    case 'sunset':
      return Colors.coral;
    default:
      return Colors.darkgrey;
  }
}

// THREEJS RELATED VARIABLES
var scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPusheen,
  farPusheen,
  renderer,
  container;

//SCREEN VARIABLES
var HEIGHT, WIDTH;

//INIT THREE JS, SCREEN AND MOUSE EVENTS
function createScene() {
  // Get the width and the height of the screen,
  // use them to set up the aspect ratio of the camera
  // and the size of the renderer.
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // Create the scene
  scene = new THREE.Scene();

  // Create the camera
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPusheen = 1;
  farPusheen = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPusheen,
    farPusheen
  );

  // Add a fog effect to the scene; same color as the
  // background color used in the style sheet
  scene.fog = new THREE.Fog(getLightColour(), 100, 950);

  // Set the position of the camera
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;

  renderer = new THREE.WebGLRenderer({
    // Allow transparency to show the gradient background defined in CSS
    alpha: true,
    // Activate the anti-aliasing; this is less performant,
    antialias: true,
  });

  renderer.setSize(WIDTH, HEIGHT);

  // Enable shadow rendering
  renderer.shadowMap.enabled = true;

  // Add the DOM element of the renderer to the
  // container we created in the HTML
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  // Listen to the screen: if the user resizes it
  // we have to update the camera and the renderer size
  window.addEventListener('resize', handleWindowResize, false);
}

// HANDLE SCREEN EVENTS

function handleWindowResize() {
  // update height and width of the renderer and the camera
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function getSkyColour() {
  switch (timeOfDay) {
    case 'night':
      return 'linear-gradient(#000, #114271)';
    case 'sunrise':
      return `linear-gradient(#99e4f7, #f7e7b4)`;
    case 'morning':
      return `linear-gradient(#4f96ff, #8df2ff)`;
    case 'midday':
      return `linear-gradient(#4f96ff, #8df2ff)`;
    case 'afternoon':
      return `linear-gradient(#22a7ff, #ffd04f)`;
    case 'sunset':
      return `linear-gradient(#9a1abf, #ff6600)`;
    default:
      return `linear-gradient(#4f96ff, #8df2ff)`;
  }
}

function getHemisphereLight() {
  // the first parameter is the ground color, the second parameter is the sky color,
  // the third parameter is the intensity of the light
  console.log(timeOfDay);
  switch (timeOfDay) {
    case 'night':
      return new THREE.HemisphereLight(Colors.blue, Colors.black, 0.9);
    case 'sunrise':
      return new THREE.HemisphereLight(Colors.white, Colors.blue, 0.9);
    case 'morning':
      return new THREE.HemisphereLight(Colors.white, Colors.white, 0.9);
    case 'midday':
      return new THREE.HemisphereLight(Colors.white, Colors.blue, 0.9);
    case 'afternoon':
      return new THREE.HemisphereLight(Colors.yellow, Colors.pink, 0.9);
    case 'sunset':
      return new THREE.HemisphereLight(Colors.purple, Colors.pink, 0.9);
    default:
      return new THREE.HemisphereLight(Colors.white, Colors.white, 0.9);
  }
}

function getAmbientLight() {
  switch (timeOfDay) {
    case 'night':
      return new THREE.AmbientLight(getLightColour(), 0.9);
    default:
      return new THREE.AmbientLight(getLightColour(), 0.2);
  }
}

// LIGHTS
var ambientLight, hemisphereLight, shadowLight;

function createLights() {
  // A hemisphere light is a gradient colored light;
  hemisphereLight = getHemisphereLight();

  // an ambient light modifies the global color of a scene and makes the shadows softer
  ambientLight = getAmbientLight();

  // A directional light shines from a specific direction.
  // It acts like the sun, that means that all the rays produced are parallel.
  shadowLight = new THREE.DirectionalLight(getLightColour(), 0.2);

  // Set the direction of the light
  shadowLight.position.set(150, 350, 350);

  // Allow shadow casting
  shadowLight.castShadow = true;

  // define the visible area of the projected shadow
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  // define the resolution of the shadow; the higher the better,
  // but also the more expensive and less performant
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  // to activate the lights, just add them to the scene
  scene.add(hemisphereLight);
  scene.add(shadowLight);
  scene.add(ambientLight);
}

var Pusheen = function() {
  this.mesh = new THREE.Object3D();
  this.mesh.name = 'pusheen';

  // angleHairs is a property used to animate the hair later
  this.angleHairs = 0;

  // Hair element
  var hair1Geom = new THREE.BoxGeometry(30, 6, 8);
  var hair1Mat = new THREE.MeshLambertMaterial({ color: Colors.coral });
  var hair1 = new THREE.Mesh(hair1Geom, hair1Mat);
  hair1.castShadow = true;
  // Align the shape of the hair to its bottom boundary, that will make it easier to scale.
  hair1.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, 0));
  // create a container for the hair
  var hairs1 = new THREE.Object3D();

  // create a container for the hairs at the top
  // of the head (the ones that will be animated)
  this.hairsBelow = new THREE.Object3D();

  // create the hairs at the top of the head
  // and position them on a 3 x 4 grid
  for (var i = 0; i < 24; i++) {
    var h = hair1.clone();
    var col = i % 3;
    var row = Math.floor(i / 3);
    var startPosZ = -4;
    var startPosX = -8;
    h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
    this.hairsBelow.add(h);
  }
  hairs1.add(this.hairsBelow);
  this.mesh.add(hairs1);

  // Hair element
  var hair2Geom = new THREE.BoxGeometry(30, 5, 8);
  var hair2Mat = new THREE.MeshLambertMaterial({ color: Colors.yellow });
  var hair2 = new THREE.Mesh(hair2Geom, hair2Mat);
  // Align the shape of the hair to its bottom boundary, that will make it easier to scale.
  hair2.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-4, 7, 0));
  // create a container for the hair
  var hairs2 = new THREE.Object3D();

  // create a container for the hairs at the top
  // of the head (the ones that will be animated)
  this.hairsMid = new THREE.Object3D();

  // create the hairs at the top of the head
  // and position them on a 3 x 4 grid
  for (var i = 0; i < 24; i++) {
    var h = hair2.clone();
    var col = i % 3;
    var row = Math.floor(i / 3);
    var startPosZ = -4;
    var startPosX = -8;
    h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
    this.hairsMid.add(h);
  }
  hairs2.add(this.hairsMid);
  this.mesh.add(hairs2);

  // Hair element
  var hair3Geom = new THREE.BoxGeometry(30, 3, 8);
  var hair3Mat = new THREE.MeshLambertMaterial({ color: Colors.blue });
  var hair3 = new THREE.Mesh(hair3Geom, hair3Mat);
  // Align the shape of the hair to its bottom boundary, that will make it easier to scale.
  hair3.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-6, 11, 0));
  // create a container for the hair
  var hairs3 = new THREE.Object3D();

  // create a container for the hairs at the top
  // of the head (the ones that will be animated)
  this.hairsTop = new THREE.Object3D();

  // create the hairs at the top of the head
  // and position them on a 3 x 4 grid
  for (var i = 0; i < 24; i++) {
    var h = hair3.clone();
    var col = i % 3;
    var row = Math.floor(i / 3);
    var startPosZ = -4;
    var startPosX = -8;
    h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
    this.hairsTop.add(h);
  }
  hairs3.add(this.hairsTop);
  this.mesh.add(hairs3);
};

// move the hair
Pusheen.prototype.updateHairs = function() {
  // get the hair
  var hairs1 = this.hairsBelow.children;
  var hairs2 = this.hairsMid.children;
  var hairs3 = this.hairsTop.children;

  // update them according to the angle angleHairs
  var l = hairs1.length;
  for (var i = 0; i < l; i++) {
    var h1 = hairs1[i];
    var h2 = hairs2[i];
    var h3 = hairs3[i];
    // each hair element will scale on cyclical basis between 75% and 100% of its original size
    h1.scale.y = 0.75 + Math.cos(this.angleHairs + i / 8) * 0.25;
    h2.scale.y = 0.75 + Math.cos(this.angleHairs + i / 8) * 0.25;
    h3.scale.y = 0.75 + Math.cos(this.angleHairs + i / 8) * 0.25;
  }
  // increment the angle for the next frame
  this.angleHairs += 0.12;
};

//TAIL
var Tail = function() {
  this.mesh = new THREE.Object3D();
  this.mesh.name = 'tail';

  // angleHairs is a property used to animate the hair later
  this.angleHairs = 0;

  // Hair element
  var hair1Geom = new THREE.BoxGeometry(15, 6, 8);
  var hair1Mat = new THREE.MeshLambertMaterial({ color: Colors.pink });
  var hair1 = new THREE.Mesh(hair1Geom, hair1Mat);
  hair1.castShadow = true;
  // Align the shape of the hair to its bottom boundary, that will make it easier to scale.
  hair1.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-2, 8, 0));
  // create a container for the hair
  var hairs1 = new THREE.Object3D();

  // create a container for the hairs at the top
  // of the head (the ones that will be animated)
  this.hairsBelow = new THREE.Object3D();

  // create the hairs at the top of the head
  // and position them on a 3 x 4 grid
  for (var i = 0; i < 24; i++) {
    var h = hair1.clone();
    var col = i % 3;
    var row = Math.floor(i / 3);
    var startPosZ = -4;
    var startPosX = -8;
    h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
    this.hairsBelow.add(h);
  }
  hairs1.add(this.hairsBelow);
  this.mesh.add(hairs1);

  // Hair element
  var hair2Geom = new THREE.BoxGeometry(18, 6, 8);
  var hair2Mat = new THREE.MeshLambertMaterial({ color: Colors.aqua });
  var hair2 = new THREE.Mesh(hair2Geom, hair2Mat);
  // Align the shape of the hair to its bottom boundary, that will make it easier to scale.
  hair2.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 14, 0));
  // create a container for the hair
  var hairs2 = new THREE.Object3D();

  // create a container for the hairs at the top
  // of the head (the ones that will be animated)
  this.hairsMid = new THREE.Object3D();

  // create the hairs at the top of the head
  // and position them on a 3 x 4 grid
  for (var i = 0; i < 24; i++) {
    var h = hair2.clone();
    var col = i % 3;
    var row = Math.floor(i / 3);
    var startPosZ = -4;
    var startPosX = -8;
    h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
    this.hairsMid.add(h);
  }
  hairs2.add(this.hairsMid);
  this.mesh.add(hairs2);

  // Hair element
  var hair3Geom = new THREE.BoxGeometry(15, 4, 8);
  var hair3Mat = new THREE.MeshLambertMaterial({ color: Colors.purple });
  var hair3 = new THREE.Mesh(hair3Geom, hair3Mat);
  // Align the shape of the hair to its bottom boundary, that will make it easier to scale.
  hair3.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-1, 20, 0));
  // create a container for the hair
  var hairs3 = new THREE.Object3D();

  // create a container for the hairs at the top
  // of the head (the ones that will be animated)
  this.hairsTop = new THREE.Object3D();

  // create the hairs at the top of the head
  // and position them on a 3 x 4 grid
  for (var i = 0; i < 24; i++) {
    var h = hair3.clone();
    var col = i % 3;
    var row = Math.floor(i / 3);
    var startPosZ = -4;
    var startPosX = -8;
    h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
    this.hairsTop.add(h);
  }
  hairs3.add(this.hairsTop);
  this.mesh.add(hairs3);
};

// move the hair
Tail.prototype.updateHairs = function() {
  // get the hair
  var hairs1 = this.hairsBelow.children;
  var hairs2 = this.hairsMid.children;
  var hairs3 = this.hairsTop.children;

  // update them according to the angle angleHairs
  var l = hairs1.length;
  for (var i = 0; i < l; i++) {
    var h1 = hairs1[i];
    var h2 = hairs2[i];
    var h3 = hairs3[i];
    // each hair element will scale on cyclical basis between 75% and 100% of its original size
    h1.scale.y = 0.6 + Math.cos(this.angleHairs + i / 8) * 0.25;
    h2.scale.y = 0.6 + Math.cos(this.angleHairs + i / 8) * 0.25;
    h3.scale.y = 0.6 + Math.cos(this.angleHairs + i / 8) * 0.25;
  }
  // increment the angle for the next frame
  this.angleHairs += 0.12;
};

//BODY
var Body = function() {
  this.mesh = new THREE.Object3D();
  this.mesh.name = 'body';

  // Cockpit

  this.pusheen = new Pusheen();
  this.pusheen.mesh.position.set(-6, 27, 20);
  this.mesh.add(this.pusheen.mesh);

  this.tail = new Tail();
  this.tail.mesh.position.set(-70, -10, 20);
  this.mesh.add(this.tail.mesh);

  this.mesh.castShadow = true;
  this.mesh.receiveShadow = true;

  var starPoints = [];

  starPoints.push(new THREE.Vector2(-36, -36));
  starPoints.push(new THREE.Vector2(-48, -16));
  starPoints.push(new THREE.Vector2(-48, 8));
  starPoints.push(new THREE.Vector2(-40, 20));
  starPoints.push(new THREE.Vector2(-24, 28));
  starPoints.push(new THREE.Vector2(-8, 28));
  starPoints.push(new THREE.Vector2(4, 26));
  starPoints.push(new THREE.Vector2(10, 36));
  starPoints.push(new THREE.Vector2(16, 28));
  starPoints.push(new THREE.Vector2(28, 28));
  starPoints.push(new THREE.Vector2(34, 36));
  starPoints.push(new THREE.Vector2(40, 24));
  starPoints.push(new THREE.Vector2(48, -4));
  starPoints.push(new THREE.Vector2(46, -24));

  starPoints.push(new THREE.Vector2(36, -36));
  starPoints.push(new THREE.Vector2(36, -40));
  starPoints.push(new THREE.Vector2(32, -40));
  starPoints.push(new THREE.Vector2(32, -36));

  starPoints.push(new THREE.Vector2(14, -36));
  starPoints.push(new THREE.Vector2(14, -40));
  starPoints.push(new THREE.Vector2(10, -40));
  starPoints.push(new THREE.Vector2(10, -36));

  starPoints.push(new THREE.Vector2(-10, -36));
  starPoints.push(new THREE.Vector2(-10, -40));
  starPoints.push(new THREE.Vector2(-14, -40));
  starPoints.push(new THREE.Vector2(-14, -36));

  starPoints.push(new THREE.Vector2(-32, -36));
  starPoints.push(new THREE.Vector2(-32, -40));
  starPoints.push(new THREE.Vector2(-36, -40));

  var starShape = new THREE.Shape(starPoints);

  var geomCockpit = new THREE.ExtrudeGeometry(starShape, {
    amount: 30,
    bevelEnabled: false,
  });
  var matCockpit = new THREE.MeshPhongMaterial({
    color: Colors.grey,
    shading: THREE.FlatShading,
  });
  geomCockpit.vertices[7].z += 20;
  geomCockpit.vertices[10].z += 20;

  var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
  cockpit.castShadow = true;
  cockpit.receiveShadow = true;
  this.mesh.add(cockpit);

  // radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
  var geomHorn = new THREE.CylinderGeometry(0, 3, 16, 16, 4);
  var matHorn = new THREE.MeshPhongMaterial({
    color: Colors.white,
    shading: THREE.FlatShading,
  });
  var horn = new THREE.Mesh(geomHorn, matHorn);
  horn.position.set(24, 33, 30);
  horn.rotateX(0.4);
  horn.rotateZ(-0.2);
  //horn.castShadow = true;
  this.mesh.add(horn);

  var geomEye = new THREE.CircleGeometry(2, 32);
  var matEye = new THREE.MeshPhongMaterial({
    color: Colors.darkgrey,
    shading: THREE.FlatShading,
  });
  var eyeL = new THREE.Mesh(geomEye, matEye);
  eyeL.position.set(11, 15, 31);
  var eyeR = new THREE.Mesh(geomEye, matEye);
  eyeR.position.set(31, 15, 31);
  this.mesh.add(eyeL);
  this.mesh.add(eyeR);

  var geomWhisker = new THREE.BoxGeometry(9, 1.5, 1);
  var matWhisker = new THREE.MeshPhongMaterial({
    color: Colors.darkgrey,
    shading: THREE.FlatShading,
  });
  var WL1 = new THREE.Mesh(geomWhisker, matWhisker);
  var WL2 = new THREE.Mesh(geomWhisker, matWhisker);
  var WR1 = new THREE.Mesh(geomWhisker, matWhisker);
  var WR2 = new THREE.Mesh(geomWhisker, matWhisker);
  WL1.position.set(0, 18, 31);
  WL2.position.set(0, 13, 31);
  WR1.position.set(46, 18, 28);
  WR2.position.set(47, 13, 28);
  WL1.rotateZ(-0.2);
  WL2.rotateZ(0.1);
  WR1.rotateZ(0.2);
  WR2.rotateZ(-0.1);
  this.mesh.add(WL1);
  this.mesh.add(WL2);
  this.mesh.add(WR1);
  this.mesh.add(WR2);

  //mouth

  var mouthPoints = [];
  mouthPoints.push(new THREE.Vector2(0, 0));
  mouthPoints.push(new THREE.Vector2(-1.5, -1));
  mouthPoints.push(new THREE.Vector2(-3.5, 0));
  mouthPoints.push(new THREE.Vector2(-2.5, 1.25));
  mouthPoints.push(new THREE.Vector2(-1.5, 0.75));
  mouthPoints.push(new THREE.Vector2(-0.9, 1.5));
  mouthPoints.push(new THREE.Vector2(-0.9, 3));

  mouthPoints.push(new THREE.Vector2(0.9, 3));
  mouthPoints.push(new THREE.Vector2(0.9, 1.5));
  mouthPoints.push(new THREE.Vector2(1.5, 0.75));
  mouthPoints.push(new THREE.Vector2(2.5, 1.25));
  mouthPoints.push(new THREE.Vector2(3.5, 0));
  mouthPoints.push(new THREE.Vector2(1.5, -1));

  var mouthShape = new THREE.Shape(mouthPoints);

  var geomMouth = new THREE.ExtrudeGeometry(mouthShape, {
    amount: 1,
    bevelEnabled: false,
  });
  var matMouth = new THREE.MeshPhongMaterial({
    color: Colors.darkgrey,
    shading: THREE.FlatShading,
  });
  var mouth = new THREE.Mesh(geomMouth, matMouth);
  mouth.position.set(21, 13, 30);
  this.mesh.add(mouth);
};

//SKY
Sky = function() {
  // Create an empty container
  this.mesh = new THREE.Object3D();

  // choose a number of clouds to be scattered in the sky
  this.nClouds = 20;
  this.clouds = [];

  // To distribute the clouds consistently,
  // we need to place them according to a uniform angle
  var stepAngle = (Math.PI * 2) / this.nClouds;

  // create the clouds
  for (var i = 0; i < this.nClouds; i++) {
    var c = new Cloud();
    this.clouds.push(c);

    // set the rotation and the position of each cloud;
    // for that we use a bit of trigonometry
    var a = stepAngle * i;
    var h = 750 + Math.random() * 200;

    // Trigonometry!!! I hope you remember what you've learned in Math :)
    // in case you don't:
    // we are simply converting polar coordinates (angle, distance) into Cartesian coordinates (x, y)
    c.mesh.position.y = Math.sin(a) * h;
    c.mesh.position.x = Math.cos(a) * h;

    // for a better result, we position the clouds
    // at random depths inside of the scene
    c.mesh.position.z = -400 - Math.random() * 400;

    // rotate the cloud according to its position
    c.mesh.rotation.z = a + Math.PI / 2;

    // we also set a random scale for each cloud
    var s = 1 + Math.random() * 2;
    c.mesh.scale.set(s, s, s);

    // do not forget to add the mesh of each cloud in the scene
    this.mesh.add(c.mesh);
  }
};

// SEA
Sea = function() {
  // create the geometry (shape) of the cylinder;
  // the parameters are:
  // radius top, radius bottom, height, number of segments on the radius, number of segments vertically
  var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

  // rotate the geometry on the x axis
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

  // important: by merging vertices we ensure the continuity of the waves
  geom.mergeVertices();

  // get the vertices
  var l = geom.vertices.length;

  // create an array to store new data associated to each vertex
  this.waves = [];

  for (var i = 0; i < l; i++) {
    // get each vertex
    var v = geom.vertices[i];
    // store some data associated to it
    this.waves.push({
      y: v.y,
      x: v.x,
      z: v.z,
      // a random angle
      ang: Math.random() * Math.PI * 2,
      // a random distance
      amp: 5 + Math.random() * 15,
      // a random speed between 0.016 and 0.048 radians / frame
      speed: 0.016 + Math.random() * 0.032,
    });
  }

  // create the material
  var mat = new THREE.MeshPhongMaterial({
    color: getSeaColour(),
    transparent: true,
    opacity: 0.8,
    shading: THREE.FlatShading,
  });

  // To create an object in Three.js, we have to create a mesh
  // which is a combination of a geometry and some material
  this.mesh = new THREE.Mesh(geom, mat);

  // Allow the sea to receive shadows
  this.mesh.receiveShadow = true;
  this.mesh.castShadow = false;
};

function getSeaColour() {
  if (timeOfDay == 'midday' || timeOfDay == 'afternoon') {
    return Colors.waveLightBlue;
  } else {
    return Colors.waveBlue;
  }
}

Sea.prototype.moveWaves = function() {
  // get the vertices
  var verts = this.mesh.geometry.vertices;
  var l = verts.length;
  for (var i = 0; i < l; i++) {
    var v = verts[i];

    // get the data associated to it
    var vprops = this.waves[i];

    // update the position of the vertex
    v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
    v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;

    // increment the angle for the next frame
    vprops.ang += vprops.speed;
  }
  this.mesh.geometry.verticesNeedUpdate = true;
  sea.mesh.rotation.z += 0.005;
};

//CLOUD
Cloud = function() {
  // Create an empty container that will hold the different parts of the cloud
  this.mesh = new THREE.Object3D();
  this.mesh.name = 'cloud';

  // create a cube geometry;
  // this shape will be duplicated to create the cloud
  var geom = new THREE.CubeGeometry(20, 20, 20);

  // create a material; a simple white material will do the trick
  var mat = new THREE.MeshPhongMaterial({
    color: Colors.white,
  });

  // duplicate the geometry a random number of times
  var nBlocs = 3 + Math.floor(Math.random() * 3);
  for (var i = 0; i < nBlocs; i++) {
    // create the mesh by cloning the geometry
    var m = new THREE.Mesh(geom.clone(), mat);

    // set the position and the rotation of each cube randomly
    m.position.x = i * 15;
    m.position.y = Math.random() * 10;
    m.position.z = Math.random() * 10;
    m.rotation.z = Math.random() * Math.PI * 2;
    m.rotation.y = Math.random() * Math.PI * 2;

    // set the size of the cube randomly
    var s = 0.1 + Math.random() * 0.9;
    m.scale.set(s, s, s);

    // allow each cube to cast and to receive shadows
    m.castShadow = false;
    m.receiveShadow = true;

    // add the cube to the container we first created
    this.mesh.add(m);
  }
};

// 3D Models

// Instantiate the sea, pusheen & sky and add it to the scene:
var sea;
var body;
var sky;

function createPusheen() {
  body = new Body();
  body.mesh.scale.set(0.4, 0.4, 0.4);
  body.mesh.position.y = 100;
  scene.add(body.mesh);
}

function createSea() {
  sea = new Sea();
  // push it a little bit at the bottom of the scene
  sea.mesh.position.y = -600;
  // add the mesh of the sea to the scene
  scene.add(sea.mesh);
}

// push the sky's center a bit towards the bottom of the screen
function createSky() {
  sky = new Sky();
  sky.mesh.position.y = -600;
  scene.add(sky.mesh);
}

function loop() {
  // update pusheen on each frame
  updatePusheen();
  body.pusheen.updateHairs();
  body.tail.updateHairs();
  updateCameraFov();
  sea.moveWaves();

  // Rotate the the sea and the sky
  sky.mesh.rotation.z += 0.01;
  renderer.render(scene, camera);

  // call the loop function again
  requestAnimationFrame(loop);
}

function updatePusheen() {
  // depending on the mouse position which ranges between -1 and 1 on both axes;
  // to achieve that we use a normalize function (see below)
  var targetY = normalize(mousePos.y, -0.75, 0.75, 25, 175);
  var targetX = normalize(mousePos.x, -0.75, 0.75, -100, 100);

  // update Pusheens's position
  //currentPosition += (finalPosition - currentPosition)*fraction;

  // Move pusheen at each frame by adding a fraction of the remaining distance
  body.mesh.position.y += (targetY - body.mesh.position.y) * 0.1;

  // Rotate pusheen proportionally to the remaining distance
  body.mesh.rotation.z = (targetY - body.mesh.position.y) * 0.0128;
  body.mesh.rotation.x = (body.mesh.position.y - targetY) * 0.0064;
}

function updateCameraFov() {
  camera.fov = normalize(mousePos.x, -1, 1, 40, 80);
  camera.updateProjectionMatrix();
}

function normalize(v, vmin, vmax, tmin, tmax) {
  var nv = Math.max(Math.min(v, vmax), vmin);
  var dv = vmax - vmin;
  var pc = (nv - vmin) / dv;
  var dt = tmax - tmin;
  var tv = tmin + pc * dt;
  return tv;
}

function init(event) {
  document.addEventListener('mousemove', handleMouseMove, false);
  document.getElementById('gameHolder').style.background = getSkyColour();
  createScene();
  createLights();
  createPusheen();
  createSea();
  createSky();

  loop();
}

// HANDLE MOUSE EVENTS

var mousePos = { x: 0, y: 0 };

function handleMouseMove(event) {
  // here we are converting the mouse position value received
  // to a normalized value varying between -1 and 1;
  // this is the formula for the horizontal axis:
  var tx = -1 + (event.clientX / WIDTH) * 2;

  // for the vertical axis, we need to inverse the formula
  // because the 2D y-axis goes the opposite direction of the 3D y-axis
  var ty = 1 - (event.clientY / HEIGHT) * 2;
  mousePos = { x: tx, y: ty };
}

window.addEventListener('load', init, false);
