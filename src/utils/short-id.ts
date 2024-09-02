export default (length = 8) =>
  Math.random()
    .toString(36)
    .substring(2, length + 2)
