import { parseHtml } from './parseHtml';

test('Parses delivery rich text HTML into arbitrary JSON', () => {
  const expectedJson = [
    {
      type: 'P',
      data: {},
      children: [
        {
          type: '#text',
          value: 'rich text ',
          children: [],
        },
        {
          type: 'STRONG',
          data: {},
          children: [
            {
              type: '#text',
              value: 'contents',
              children: []
            }
          ]
        },
        {
          type: "#text",
          value: ' ',
          children: [],
        },
        {
          type: 'A',
          data: {
            href: 'https://link.url'
          },
          children: [
            {
              type: '#text',
              value: 'here',
              children: []
            }
          ]
        }
      ]
    }
  ];
  const actualJson = parseHtml('<p>rich text <strong>contents</strong> <a href="https://link.url">here</a></p>');

  expect(actualJson).toEqual(expectedJson);
});
