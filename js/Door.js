/* global THREE, TWEEN, scene */

function makeDoor (x, y, z) {
    var material = new THREE.MeshPhongMaterial({
     map: new THREE.TextureLoader().load('images/door.jpg'),
    });
    
    var door = new THREE.Mesh(
      new THREE.CubeGeometry(10, 20, 1),
     material
    );
    var hinge = new THREE.Object3D();
    hinge.add(door);
    scene.add (hinge);
    hinge.position.set (x, y, z);
    hinge.position.x = x+5
    door.position.x = -5
    return hinge;
}

function openDoor (door){
    //door.rotation.y = -Math.PI/2
    
	new TWEEN.
	Tween({ y: door.rotation.y }).
	to({ y: -Math.PI /2 }, 500).
	onUpdate(function() {
		door.rotation.y = this.y;
	}).
	start();
	
}