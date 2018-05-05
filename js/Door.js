/* global THREE, TWEEN, scene */

function makeDoor(x, y, z) {
    var doorway = new THREE.Group();
    doorway.position.set(x, y, z);
    
    var doorMaterial = new THREE.MeshPhongMaterial({
     map: new THREE.TextureLoader().load('images/door.jpg'),
    });
    var door = new THREE.Mesh(
      new THREE.CubeGeometry(10, 20, 1),
      doorMaterial
    );
    door.position.x = -5;

    var hinge = new THREE.Object3D();
    hinge.position.x = 5;

    hinge.add(door);
    doorway.add(hinge);

    // door starts out closed
    doorway.opened = false;

    // This passage will allow us to move through the door once it's opened.
    var passage = new THREE.Mesh(
      new THREE.CubeGeometry(10,20,2),
      new THREE.MeshBasicMaterial({color:0x000000})
    );
    passage.position.z = 1;
    setPassageObject(passage)

    // open function
    doorway.open = function() {
      // don't do anything if already opened
      if (doorway.opened) return;

      new TWEEN.
        Tween({ y: hinge.rotation.y }).
        to({ y: -Math.PI /2 }, 500).
        onUpdate(function() {
          hinge.rotation.y = this.y;
        }).
        start();

      // add the passage
      doorway.add(passage);
      doorway.opened = true;
    }

    // return the hinge since everthing is attached to that.
    return doorway;
}

function openDoor(door){
  door.open();
}
