function shuffle(arr) {
  const count = arr.length;
  const copy = arr.map(val => val);
  const res = [];
  for (let i = 0; i < count; i++) {
    const index = Math.floor(copy.length * Math.random());
    res.push(copy.splice(index, 1)[0]);
  }
  return res;
}

module.exports = {
  shuffle,
};
