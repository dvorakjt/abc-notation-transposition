class SimpleCircularArray {
  _array;

  constructor(array = []) {
    this._array = array;
  }

  get(index) {
    if (this._array.length === 0)
      throw new Error("Cannot access element of array length 0.");

    if (index < 0) {
      index = (index % this._array.length) + this._array.length;
    }
    if (index >= this._array.length) {
      index = index % this._array.length;
    }
    return this._array[index];
  }

  size() {
    return this._array.length;
  }

  findIndex(testingFunction) {
    for (let i = 0; i < this._array.length; i++) {
      if (testingFunction(this._array[i])) return i;
    }
    return -1;
  }

  find(testingFunction) {
    for (let elem of this._array) {
      if (testingFunction(elem)) return elem;
    }
    return undefined;
  }
}

module.exports.SimpleCircularArray = SimpleCircularArray;
