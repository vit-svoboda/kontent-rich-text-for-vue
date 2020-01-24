import {Parser} from 'htmlparser2';

class JsonHandler {
  constructor() {
    this.blocks = [];
    this.tagStack = [];
  }

  onerror(error) {
    throw error;
  }

  onclosetag() {
    this.tagStack.pop();
  }

  onopentag(name, attributes) {
    const element = {
      type: name.toUpperCase(),
      data: attributes,
      children: []
    };
    this.addNode(element);
    this.tagStack.push(element);
  }

  ontext(data) {
    const node = {
      type: '#text',
      value: data,
      children: [],
    };

    this.addNode(node);
  }

  addNode(node) {
    const parent = this.tagStack[this.tagStack.length - 1];

    const siblings = parent ? parent.children : this.blocks;
    siblings.push(node);
  }
}

export const parseHtml = (htmlString) => {
  const handler = new JsonHandler();
  const parser = new Parser(handler);

  parser.write(htmlString);
  parser.end();

  return handler.blocks;
};

