 /**
  * @author ascension
  */
 /* global THREE */

 THREE.Room = function(h, w, d) {
  // creating the floor material 
  var floor = new THREE.MeshPhongMaterial({
   map: new THREE.TextureLoader().load('images/carpet.jpg'),
   side: THREE.BackSide
  });
  // creating the wall material
  var wallpaper = new THREE.MeshPhongMaterial({
   map: new THREE.TextureLoader().load('images/wallpapaer.jpg'),
   side: THREE.BackSide
  });
  
  // defining the room material and shape
  var roomShape = new THREE.CubeGeometry(h, w, d);
  var roomMaterial = new THREE.MeshFaceMaterial([wallpaper, wallpaper, wallpaper, floor, wallpaper, wallpaper]);
  // combining the room material and shape
  var room = new THREE.Mesh(roomShape, roomMaterial);

  //creating a new loader
  var loader = new THREE.ObjectLoader();
  // load the model and define the object callback function
  loader.load("/models/stairs/wooden-stairs.json", function(obj) {
   // adding the object to the scene
   room.add(obj);
   obj.position.set(-5, -20, -10);
   //obj.position.set(0, 0, 0);
   obj.scale.set(.025, .025, .025);
  });
  
  var loader = new THREE.ObjectLoader();
  loader.load("/models/arm-chair/arm-chair.json", function(obj) {
   room.add(obj);
   obj.position.set(0, -25, 22);
   //obj.position.set(0, 0, 0);
   obj.scale.set(3.25, 3.25, 3.25);
  });

  return room;
 };
 