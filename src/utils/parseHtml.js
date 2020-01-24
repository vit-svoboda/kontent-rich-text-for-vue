// htmlparser2 has stupid exports and thus can't be imported normally
const htmlparser2 = require('htmlparser2');

const createJsonHandler = () => {
  const blocks = [];
  const tagStack = [];

  const addNode = (node) => {
    const parent = tagStack[tagStack.length - 1];

    const siblings = parent ? parent.children : blocks;
    siblings.push(node);
  };

  const onerror = (error) => {
    throw error;
  };

  const onclosetag = () => {
    tagStack.pop();
  };

  const onopentag = (name, attributes) => {
    const element = {
      type: name.toUpperCase(),
      data: attributes,
      children: []
    };
    addNode(element);
    tagStack.push(element);
  };

  const ontext = (data) => {
    const node = {
      type: '#text',
      value: data,
      children: [],
    };

    addNode(node);
  };

  return {
    onerror,
    onopentag,
    onclosetag,
    ontext,
    getResult: () => blocks,
  }
};

export const parseHtml = (htmlString) => {
  const handler = createJsonHandler();
  const parser = new htmlparser2.Parser(handler);

  parser.write(htmlString);
  parser.end();

  return handler.getResult();
};

