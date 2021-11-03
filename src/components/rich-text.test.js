import {mount} from '@vue/test-utils';
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

test('Renders provided content with web link and no given component', () => {
  const linkedItemComponent = linkedItemFactory(
    _itemType => null,
    _itemCodeName => null
  );

  const wrapper = mount(RichText, {
    propsData: {
      content: '<p><a href="https://www.google.com" title="Google home page">google.com</a></p>',
      linkedItemComponent
    }
  });

  expect(wrapper.html()).toEqual('<p><a href="https://www.google.com" title="Google home page">google.com</a></p>');
});

test('Renders provided content with web link', () => {
  const linkedItemComponent = linkedItemFactory(
    _itemType => null,
    _itemCodeName => null
  );

  const linkComponent = {
    functional: true,
    props: ['block'],
    render: (createElement, context) => createElement('a', {domProps: {...context.props.block.data}}, 'replaced')
  };

  const wrapper = mount(RichText, {
    propsData: {
      content: '<p><a href="https://www.google.com" title="Google home page">google.com</a></p>',
      linkedItemComponent,
      linkComponent
    }
  });

  expect(wrapper.html()).toEqual('<p><a href="https://www.google.com" title="Google home page">replaced</a></p>');
});

test('Replaces item link with given component in provided content', () => {
  const linkedItemComponent = linkedItemFactory(
    _itemType => null,
    _itemCodeName => null
  );

  const linkComponent = {
    functional: true,
    props: ['block'],
    render: (createElement, context) => createElement('a', {domProps: {...context.props.block.data}}, context.children)
  };

  const wrapper = mount(RichText, {
    propsData: {
      content: '<p><a data-item-id="c902d745-44f0-427b-9042-44b1dffcff65" href="">item link</a></p>',
      linkedItemComponent,
      linkComponent
    }
  });

  // TODO: The empty href is not a good expectation, obviously, but what is the linkComponent expected to do actually?
  expect(wrapper.html()).toEqual('<p><a href="">item link</a></p>');
});
