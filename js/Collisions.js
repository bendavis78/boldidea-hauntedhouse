/* global THREE */

(function() {
    
    function getBoundingBox(obj) {
        var min = obj.position.clone();
        var max = obj.position.clone();
        
        if (obj.geometry) {
            if (!obj.geometry.boundingBox) {
                obj.geometry.computeBoundingBox();
            }
            min.add(obj.geometry.boundingBox.min);
            max.add(obj.geometry.boundingBox.max);
        }
        
        return new THREE.Box3(min, max);
    }
    
    /**
     * Takes a single object or an array of objects and returns true if 
     * this object intersects with the given object(s).
     * 
     * @param {(Object3D|Object3D[])} An `Object3D` instance or array
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
    }
})();