/**
 * @author ascension
 */
/* global THREE */

THREE.FlashLight = function() {
    var flashLight = this;
    flashLight = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 7, 20),
        new THREE.MeshPhongMaterial({ color: 0x000000 }));

    flashLight.rotateX(Math.PI / 2);

    
    var spotLight = new THREE.SpotLight(0xffffff, 0.5, 150);
    spotLight.power = 500;
    spotLight.angle = 0.3;
    spotLight.decay = 2;
    spotLight.penumbra = 1;
    spotLight.distance = 100;
    spotLight.castShadow = true;
    spotLight.rotateX(Math.PI / 2);
    flashLight.add(spotLight);
    flashLight.add(spotLight.target);
    
// make a button to turn on and off the flashlight
    var spotLight2 = new THREE.SpotLight(0xCCCCCC, 0.5, 150);
    spotLight2.power = 250;
    spotLight2.angle = 0.35;
    spotLight2.decay = 1;
    spotLight2.penumbra = 1;
    spotLight2.distance = 125;
    spotLight2.castShadow = true;
    spotLight2.rotateX(Math.PI / 2);

    var spotLight3 = new THREE.SpotLight(0xFFFFFF, 0.5, 150);
    spotLight3.power = 500;
    spotLight3.angle = 0.4;
    spotLight3.decay = 2;
    spotLight3.penumbra = 1;
    spotLight3.distance = 50;
    spotLight3.castShadow = true;
    spotLight3.rotateX(Math.PI / 2);
    
    flashLight.add(spotLight2);
    flashLight.add(spotLight2.target);
    flashLight.add(spotLight3);
    flashLight.add(spotLight3.target);
  
};
