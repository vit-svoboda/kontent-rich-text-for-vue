import { mount } from '@vue/test-utils';
import RichText from './rich-text';
import linkedItemFactory from './linkedItemFactory';

test('Renders provided content', () => {
  const linkedItemComponent = linkedItemFactory(
    _itemType => null,
    _itemCodeName => null
  );

  const wrapper = mount(RichText, {
    propsData: {
      content: '<p>Delivery rich text HTML</p>',
      linkedItemComponent
    }
  });

  expect(wrapper.html()).toEqual('<p>Delivery rich text HTML</p>');
});
