/**
 * @author ascension
 */
/* global THREE */

function makeFlashlight() {
  var flashlight = new THREE.Object3D();
  flashlight.rotateX(Math.PI / 2);
  
  var spotLight = new THREE.SpotLight(0xf7f59e);
  spotLight.rotateX(Math.PI / 2);
  spotLight.intensity = 0;
  spotLight.angle = Math.PI / 6;
  spotLight.decay = 1;
  spotLight.penumbra = 1;
  spotLight.distance = 100;
  spotLight.castShadow = true;

  flashlight.add(spotLight);
  flashlight.add(spotLight.target);

  flashlight.helper = new THREE.SpotLightHelper(spotLight);
  flashlight.spotLight = spotLight;

  flashlight.turnOn = function() {
    spotLight.intensity = 1;
  }

  flashlight.turnOff = function() {
    spotlight.intensity = 0;
  }

  return flashlight;
};
