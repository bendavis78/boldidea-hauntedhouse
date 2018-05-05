// Add variables that are defined in other libraries below to avoid warnings:
/* global THREE, TWEEN, makeDoor, openDoor, setUpControls,updateControls */
/* global setContainerObject setRigidObject, setPassageObject */
/* global unsetContainerObject unsetRigidObject, unsetPassageObject, player, room1 */

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
  room.receiveShadow = true;
  setContainerObject(room);
 
  var loader = new THREE.ObjectLoader();
  loader.load("models/arm-chair/arm-chair.json", function(obj) {
   room.add(obj);
   obj.position.set(0, -25, 22);
   obj.scale.set(3.25, 3.25, 3.25);
   //addRigidObject(obj);
  });

  // Staircase
  var loader = new THREE.ObjectLoader();
  loader.load("models/stairs/wooden-stairs.json", function(obj) {
   room.add(obj);
   obj.position.set(-10, -20, -10);
   var scale = .018
   obj.scale.set(scale, scale, scale);
   window.stairs = obj;
  });
  
  // Key
  var mtlLoader = new THREE.MTLLoader();
  var loader = new THREE.OBJLoader();
  room.key = null;
  mtlLoader
    .setPath("models/key3/")
    .load("Key_B_02.mtl", function(materials) {
      materials.preload();
      loader.setMaterials(materials)
        .load("models/key3/Key_B_02.obj", function(obj) {
          room.add(obj);
          room.key = obj;
          obj.castShadow = true;
          obj.position.set(15, -20, -22);
          obj.scale.set(.25, .25, .25);
        });
    });
  
  var instructions = new THREE.PlaneGeometry(20,20)
  var material = new THREE.MeshPhongMaterial({
   map: new THREE.TextureLoader().load('images/instructions.png'),
   transparent:true
  });
  
  var instructions = new THREE.Mesh(instructions,material)
  instructions.position.set(0,-5,-23)
  room.add(instructions);
  
  // This light is intentionally dim so that the player can still vaguely see surroundings
  var light = new THREE.PointLight(0xf7f59e, .25, 50, 1.5);
  light.position.set(0, 0, 0);
  room.add(light);

  var door1 = makeDoor(10, -15, 24);
  room.add(door1);
  room.door1 = door1;

  var door2 = makeDoor(-10, -15, 24);
  room.add(door2);
  room.door2 = door2;

  setContainerObject(room);

  room.update = function() {
    // this gets called from the main animate() function
    if (room.key) {
      if (player.intersects(room.key)){
        console.log('You found the key!');
        // TODO: Remove the key (remove from room object, and set room.key to null)
        // TODO: play a sound to let the player know they got the key
      }
    }

    // TODO: if player is close to the door and has the key, open the door using openDoor(door1)
    //console.log(player.distanceTo(door1));
  }

  return room
}
