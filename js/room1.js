// Add variables that are defined in other libraries below to avoid warnings:
/* global THREE, TWEEN, makeDoor, openDoor, setUpControls,updateControls */
/* global setContainerObject setRigidObject, setPassageObject */
/* global unsetContainerObject unsetRigidObject, unsetPassageObject, player, room1 */
var door1, door2, key, passage;

function makeRoomOne (x, y, z) {
  var floor = new THREE.MeshPhongMaterial({
   map: new THREE.TextureLoader().load('images/carpet.jpg'),
   side: THREE.BackSide
  });
  var wallpaper = new THREE.MeshPhongMaterial({
   map: new THREE.TextureLoader().load('images/wallpapaer.jpg'),
   side: THREE.BackSide  
  });
  
  var roomShape = new THREE.CubeGeometry(50, 50, 50);
  var roomMaterial = [wallpaper, wallpaper, wallpaper, floor, wallpaper, wallpaper];
  var room = new THREE.Mesh(roomShape, roomMaterial);
  setContainerObject(room);
  
  
  var loader = new THREE.ObjectLoader();
  loader.load("models/arm-chair/arm-chair.json", function(obj) {
   room.add(obj);
   obj.position.set(0, -25, 22);
   obj.scale.set(3.25, 3.25, 3.25);
   //addRigidObject(obj);
  });

  var loader = new THREE.ObjectLoader();
  loader.load("models/stairs/wooden-stairs.json", function(obj) {
   room.add(obj);
   obj.position.set(-5, -20, -10);
   obj.scale.set(.025, .025, .025);
  });
  
  var loader = new THREE.ObjectLoader();
  loader.load("models/key/sg-golden-key.json", function(obj) {
   room.add(obj);
   key = obj;
   obj.position.set(15, -20, -22);
   obj.scale.set(.196, .196, .196);
  });
  
  var instructions = new THREE.PlaneGeometry (20,20,20)
  var material = new THREE.MeshBasicMaterial ({
   map: new THREE.TextureLoader().load('images/instructions.png'),
   transparent:true
  });
  
  var instructions = new THREE.Mesh (instructions,material)
  instructions.position.set(0,-5,-23)
  room.add(instructions);
  
  	var flashLight = new THREE.FlashLight();
		 //camera.add(flashLight); 
			
  var light = new THREE.PointLight(0xf7f59e, 3, 50, 1.5);
  light.position.set(0, 0, 0);
  room.add(light);

  /*
  var light2 = new THREE.PointLight(0xf7f59e, 1, 30, 1.5);
  light2.position.set(0, -20, -5);
  room.add(light2);
  
  
  var light3 = new THREE.PointLight(0xf7f59e, 3, 50, 1.5);
  light3.position.set(0, 0, 50);
  room.add(light3);
  */
  
   door1 = makeDoor(10, -15, 24);
   door2 = makeDoor(-10, -15, 24);
  
  passage = new THREE.Mesh (
      new THREE.CubeGeometry (10,20,2),
      new THREE.MeshBasicMaterial({color:0x000000})
  );
  passage.position.set (10,-15,25)
 setPassageObject (passage)
      
  var paper= new THREE.Mesh(
   new THREE.PlaneGeometry (2,4),
   new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('images/instructions.png'),
    transparent: true
   })
  );
  setContainerObject(room);
  return room
}

function CheckCollisions() {
    if (key) {
        if (player.intersects(key)){
            openDoor(door1);
            room.add(passage);
        }
    }
}