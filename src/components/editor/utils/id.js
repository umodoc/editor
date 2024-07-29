let gid = 1;

export function getId() {
  gid += 1;
  return Math.random().toString(36).substring(2, 10);
}
