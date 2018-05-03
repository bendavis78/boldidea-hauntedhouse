/* global THREE, performance, scene */

/**
 * To use this, add the following line after you create your camera:
 * 
 * setUpControls(camera);
 *
 * Then, in your animate function, call the following function:
 * 
 * updateControls();
 */

var collisionsEnabled = true;
var controlsEnabled = false;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var controls;

var rigidObjects = [];
var containerObjects = [];
var passageObjects = [];

function setRigidObject(obj) {
    // player cannot pass through rigid objects
    rigidObjects.push(obj);
}

function setContainerObject(obj) {
    // player cannot move outside of box constraint object
    containerObjects.push(obj);
}

function setPassageObject(obj) {
    // box constraints are ignored if colliding with a passage object
    passageObjects.push(obj);
}

function unsetRigidObject(obj) {
    var i = rigidObjects.indexOf(obj);
    if (i > -1) {
        rigidObjects.splice(i, 1);
    }
}

function unsetContainerObject(obj) {
    var i = containerObjects.indexOf(obj);
    if (i > -1) {
        containerObjects.splice(i, 1);
    }
}

function unsetPassageObject(obj) {
    var i = passageObjects.indexOf(obj);
    if (i > -1) {
        passageObjects.splice(i, 1);
    }
}

function getCollisions(objects) {
    var intersects = [];
    var player = controls.getObject();
    for (var i=0; i<objects.length; i++) {
        var obj = objects[i];
        if (player.intersects(obj)) {
            intersects.push(obj);
        }
    }
    return intersects;
}

function setUpControls(camera, player) {
    controls = new THREE.PointerLockControls(camera);
    controlObj = controls.getObject();
    scene.add(controlObj);
    controlObj.add(player);
    var blocker = document.getElementById('blocker');
    var instructions = document.getElementById('instructions');
    // http://www.html5rocks.com/en/tutorials/pointerlock/intro/
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    if (havePointerLock) {
        var element = document.body;
        var pointerlockchange = function(event) {
            if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                controlsEnabled = true;
                controls.enabled = true;
                blocker.style.display = 'none';
            }
            else {
                controlsEnabled = false;
                controls.enabled = false;
                blocker.style.display = 'block';
                instructions.style.display = '';
            }
        };
        var pointerlockerror = function(event) {
            instructions.style.display = '';
        };
        // Hook pointer lock state change events
        document.addEventListener('pointerlockchange', pointerlockchange, false);
        document.addEventListener('mozpointerlockchange', pointerlockchange, false);
        document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
        document.addEventListener('pointerlockerror', pointerlockerror, false);
        document.addEventListener('mozpointerlockerror', pointerlockerror, false);
        document.addEventListener('webkitpointerlockerror', pointerlockerror, false);
        instructions.addEventListener('click', function(event) {
            instructions.style.display = 'none';
            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            element.requestPointerLock();
        }, false);
    }
    else {
        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
    }
    var onKeyDown = function(event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
            case 37: // left
            case 65: // a
                moveLeft = true;
                break;
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
            case 32: // space
                if (canJump === true && controlsEnabled) velocity.y += 150;
                canJump = false;
                break;
        }
    };
    
    var onKeyUp = function(event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;
            case 37: // left
            case 65: // a
                moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
        }
    };
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
}

function updateControls() {
    if (controlsEnabled === true) {
        var time = performance.now();
        var delta = (time - prevTime) / 1000;
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 500.0 * delta;
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveLeft) - Number(moveRight);
        direction.normalize(); // this ensures consistent movements in all directions
        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        var controlObj = controls.getObject();
        
        var prevPosition = controlObj.position.clone();
        
        controlObj.translateX(velocity.x * delta);
        controlObj.translateY(velocity.y * delta);
        controlObj.translateZ(velocity.z * delta);
        
        var Ymin = -15;
        if (controlObj.position.y < Ymin) {    
            velocity.y = 0;
            controlObj.position.y = Ymin;
            canJump = true;
        }
        
        var canMove = true;
        
        // constrain movement within containers
        if (containerObjects.length > 0 && !player.isContainedBy(containerObjects)) {
            canMove = false;
        }
        
        // we can't move through rigid objects
        if (player.intersects(rigidObjects)) {
            canMove = false;
        }
        
        // passage objects override and allow us to move through anything
        if (player.intersects(passageObjects)) {
            canMove = true;
        }
        
        if (!canMove && collisionsEnabled) {
            controlObj.position.x = prevPosition.x;
            controlObj.position.y = prevPosition.y;
            controlObj.position.z = prevPosition.z;
        }
        
        prevTime = time;
    }
}
