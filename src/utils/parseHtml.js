import { parseFragment } from 'parse5';

const parseAttributes = (node) => {
  if (node.attrs) {
    return [...node.attrs].reduce((attributes, property) => {
      attributes[property.name] = property.value;
      return attributes;
    }, {});
  }
};

const parseChildren = (parent) =>
  parent.childNodes
    ? [...parent.childNodes].reduce((blocks, node) => {
      blocks.push({
        type: node.nodeName === '#text' ? node.nodeName : node.nodeName.toUpperCase(), // Let's not make a breaking change here
        value: node.value,
        children: parseChildren(node),
        data: parseAttributes(node),
      });
      return blocks;
    }, [])
    : [];

export const parseHtml = (htmlString) => {
  const documentFragment = parseFragment(htmlString);

  return parseChildren(documentFragment);
};

