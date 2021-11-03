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

test('Replaces <object> with given component in provided content', () => {
  const componentsByItemType = {
    'test-child': {
      functional: true,
      props: ['item'],
      render: (createElement, context) => createElement('strong', context.props.item.element_name.value)
    }
  };
  const itemsByCodeName = {
    'child1': {
      system: {
        type: 'test-child'
      },
      element_name: {
        value: 'Charlie'
      }
    }
  };
  const linkedItemComponent = linkedItemFactory(
    itemType => componentsByItemType[itemType],
    itemCodeName => itemsByCodeName[itemCodeName]
  );

  const wrapper = mount(RichText, {
    propsData: {
      content: '<p>before<object type="application/kenticocloud" data-type="item" data-rel="component" data-codename="child1"></object>after</p>',
      linkedItemComponent
    }
  });

  expect(wrapper.html()).toEqual('<p>before<strong>Charlie</strong>after</p>');
});
