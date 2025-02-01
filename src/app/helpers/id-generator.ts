
function createIdGenerator(start = 0) {
  let id = start;
  return function () {
    return id++;
  };
}

export const generateID = createIdGenerator();
