let gid = 1;

export function getId() {
  gid += 1;
  return Math.random().toString(36).substring(2, 10);
}

export const idAttributes = {
  id: {
    parseHTML: (element) => element.getAttribute("id"),
    renderHTML: (attributes) => {
      if (!attributes.id) {
        return { id: getId() };
      }
      return {
        id: attributes.id
      };
    }
  },
  extend: {
    default: false
  },
  group: {
    default: null,
    parseHTML: (element) => element.getAttribute("data-group"),
    renderHTML: (attributes) => {
      if (!attributes.group) {
        return {};
      }
      return {
        "data-group": attributes.group
      };
    }
  }
};
