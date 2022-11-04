const {SimpleCircularArray} = require('../classes/SimpleCircularArray');
 
test('get method of empty array should throw error', () => {
    const array = new SimpleCircularArray();
    expect(() => array.get(1)).toThrow(new Error("Cannot access element of array length 0."));
});

test('findIndex method of empty array should return -1', () => {
    const array = new SimpleCircularArray();
    expect(array.findIndex(() => true)).toBe(-1);
});

test('get method of array length 1 should behave in circular manner with positive indices', () => {
    const array = new SimpleCircularArray([0]);
    for(let i = 0; i <= 30; i++) {
        expect(array.get(i)).toBe(0);
    }
});

test('get method of array length 1 should behave in circular manner with negative indices', () => {
    const array = new SimpleCircularArray([0]);
    for(let i = 0; i >= -30; i--) {
        expect(array.get(i)).toBe(0);
    }
});

test('findIndex method of array length 1 should return 0 for item that exists', () => {
    const array = new SimpleCircularArray([0]);
    expect(array.findIndex((elem) => elem === 0)).toBe(0);
});

test('findIndex method of array length 1 should return -1 for nonexistent item', () => {
    const array = new SimpleCircularArray([0]);
    expect(array.findIndex((elem) => elem !== 0)).toBe(-1);
});

test('get method of array length 10 should behave in circular manner with positive indices', () => {
    const array = new SimpleCircularArray([0,1,2,3,4,5,6,7,8,9]);
    let j = 0;
    for(let i = 0; i <= 30; i++) {
        expect(array.get(i)).toBe(array.get(j));
        j++;
        if(j >= array.size()) j = 0;
    }
});

test('get method of array length 10 should behave in circular manner with negative indices', () => {
    const array = new SimpleCircularArray([0,1,2,3,4,5,6,7,8,9]);
    let j = array.size() - 1;
    for(let i = -1; i >= -30; i--) {
        expect(array.get(i)).toBe(array.get(j));
        j--;
        if(j < 0) j = array.size() - 1;
    }
});

test('findIndex method of array length 10 should return index of existing item', () => {
    const array = new SimpleCircularArray([0,1,2,3,4,5,6,7,8,9]);
    expect(array.findIndex((elem) => elem === 8)).toBe(8);
});

test('findIndex method of array length 10 should return -1 for nonexistent item', () => {
    const array = new SimpleCircularArray([0,1,2,3,4,5,6,7,8,9]);
    expect(array.findIndex((elem) => elem === 10)).toBe(-1);
});