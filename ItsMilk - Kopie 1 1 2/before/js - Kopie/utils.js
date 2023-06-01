// This is extending the Array object prototype with a custom method named `parse2D` which will return an array of rows.
Array.prototype.parse2D = function () {
    const rows = []
    // Iterating over the array, grouping elements into sub-arrays of 16 items (1 row).
    for (let i = 0; i < this.length; i += 16) {
      rows.push(this.slice(i, i + 16))
    }
  
    return rows // Returning the 2D array
  }

// This is also extending the Array object prototype with a custom method named `createObjectsFrom2D`.
Array.prototype.createObjectsFrom2D = function () {
    const objects = [] // Initialising an empty array for objects
    this.forEach((row, y) => { // Iterating over each row in the 2D array
      row.forEach((symbol, x) => { // Iterating over each item in the current row
        if (symbol === 292 || symbol === 250) { // Checking for specific values
          // If the value matches one of the specified values, a new CollisionBlock object is created with a specified position and added to the objects array
          objects.push(
            new CollisionBlock({
              position: {
                x: x * 64,
                y: y * 64,
              },
            })
          )
        }
      })
    })
  
    return objects // Returning the final array of created objects.
  }


  function collision({ 
    object1, 
    object2,
 }) {
  return (
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.y <= object2.position.y + object2.height &&
    object1.position.x <= object2.position.x + object2.width &&
    object1.position.x + object1.width >= object2.position.x
  )
}
