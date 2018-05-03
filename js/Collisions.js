/* global THREE */

(function() {

  function getWorldPosition(obj) {
    // update matrix of all parents
    var parent = obj.parent;
    while (parent) {
      parent.updateMatrixWorld();
      parent = parent.parent;
    }
    var pos = new THREE.Vector3();
    pos.setFromMatrixPosition(obj.matrixWorld);
    return pos;
  }

  function getBoundingBox(obj) {
    var position = getWorldPosition(obj);
    var min = position.clone();
    var max = position.clone();
    
    if (obj.geometry) {
      if (!obj.geometry.boundingBox) {
        obj.geometry.computeBoundingBox();
      }
      min.add(obj.geometry.boundingBox.min);
      max.add(obj.geometry.boundingBox.max);
    }
    
    return new THREE.Box3(min, max);
  }
  window.getBoundingBox = getBoundingBox;

  /**
   * Takes a single object or an array of objects and returns true if 
   * this object intersects with the given object(s).
   * 
   * @param {(Object3D|Object3D[])} object `Object3D` instance or array
   * @returns {boolean} True if the given object or objects intersect 
   */
  THREE.Object3D.prototype.intersects = function(object) {
    if (object instanceof Array) {
      // If we passed an array, loop through it and call the same function
      // on each item, returning true on the first intersecting item.
      var intersects = [];
      for (var i=0; i<object.length; i++) {
        var obj = object[i];
        if (this.intersects(obj)) {
          return true;
        }
      }
      return false;
    }

    // ignore objects that haven't been added to anything
    if (!this.parent || !object.parent) return false;
    
    var a = getBoundingBox(this);
    var b = getBoundingBox(object);
    
    /**
     * This is where we actually figure out if the two 3D objects are 
     * touching. This is a boolean expression that returns true if the 
     * bounding box of "A" intersects with the bounding box of "B".
     */
    
    return (a.min.x <= b.max.x && a.max.x >= b.min.x) &&
           (a.min.y <= b.max.y && a.max.y >= b.min.y) &&
           (a.min.z <= b.max.z && a.max.z >= b.min.z);
  };

  /**
   * Takes a single object or an array of objects and returns true if 
   * the given object is fully contained within this without exceeding its
   * bounds.
   * 
   * @param {(Object3D|Object3D[])} object An `Object3D` instance or array
   * @returns {boolean} True if the given object or objects contains this 
   */
  THREE.Object3D.prototype.contains = function(object) {
    if (object instanceof Array) {
      // If we passed an array, loop through it and call the same function
      // on each item, returning true on the first item that contains this item.
      var contains = [];
      for (var i=0; i<object.length; i++) {
        var obj = object[i];
        if (this.contains(obj)) {
          return true;
        }
      }
      return false;
    }

    // ignore objects that haven't been added to anything
    if (!this.parent || !object.parent) return false;

    var a = getBoundingBox(this);
    var b = getBoundingBox(object);

    return (a.min.x <= b.min.x && a.max.x >= b.max.x) &&
           (a.min.y <= b.min.y && a.max.y >= b.max.y) &&
           (a.min.z <= b.min.z && a.max.z >= b.max.z);
  };

  /**
   * Same is .contains(), just the other way around
   *
   * @param {(Object3D|Object3D[])} object An `Object3D` instance or array
   * @returns True if the given object or objects are contained by this
   */
  THREE.Object3D.prototype.isContainedBy = function(object) {
    if (object instanceof Array) {
      var contains = [];
      for (var i=0; i<object.length; i++) {
        var obj = object[i];
        if (obj.contains(this)) {
          return true;
        }
      }
      return false;
    }
    return object.contains(this);
  }
})();
