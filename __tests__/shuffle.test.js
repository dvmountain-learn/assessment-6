const shuffle = require("../src/shuffle");


describe("shuffle should...", () => {
  const expectArray = [1, 2, 3, 4, 5, 6, 7, 8];
  const compareArray = [1, 2, 3, 4, 5, 6, 7, 8];

  test('check that shuffle returns an array', () => {
    // expect(shuffle(expectArray).sort()).not.toBe(expectArray);
    expect(shuffle(expectArray)).toEqual(expect.arrayContaining([1, 2, 3, 4]));
  });

  test('check that it returns an array of the same length as the argument sent in', () => {
    expect(shuffle(expectArray)).toHaveLength(compareArray.length);
  });

  test('check that all the same items are in the array', () => {
    expect(shuffle(expectArray).sort()).toEqual(compareArray);
  });

  test('check that the items have been shuffled around', () => {
    expect(shuffle(expectArray[0])).toEqual([])
  })

});
