import {mount} from '@vue/test-utils';
import RichText from './rich-text';
import linkedItemFactory from './linkedItemFactory';
import linkFactory from './linkFactory';

test('Renders provided simple content', () => {
  const wrapper = mount(RichText, {
    propsData: {
      content: '<p>Delivery rich text HTML</p>'
    }
  });

  expect(wrapper.html()).toEqual('<p>Delivery rich text HTML</p>');
});

test('Replaces <object> with given component in provided content', () => {
  const componentsByItemType = {
    'test-child': {
      functional: true,
      props: ['item'],
      render: (createElement, context) =>
        createElement('strong', context.props.item.element_name.value)
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

test('Renders provided content with web link', () => {
  const wrapper = mount(RichText, {
    propsData: {
      content: '<p><a href="https://www.google.com" title="Google home page">google.com</a></p>'
    }
  });

  expect(wrapper.html()).toEqual('<p><a href="https://www.google.com" title="Google home page">google.com</a></p>');
});

test('Replaces link component in provided content with web link', () => {
  const linkComponent = linkFactory({
    getLinkComponent: _linkType => ({
      functional: true,
      props: ['link'],
      render: (createElement, context) =>
        createElement('a', {domProps: {...context.props.link}}, 'replaced')
    })
  });

  const wrapper = mount(RichText, {
    propsData: {
      content: '<p><a href="https://www.google.com" title="Google home page">google.com</a></p>',
      linkComponent
    }
  });

  expect(wrapper.html()).toEqual('<p><a href="https://www.google.com" title="Google home page">replaced</a></p>');
});

test('Replaces link url in provided content with content item link', () => {
  const linkComponent = linkFactory({
    getItemLinkUrl: itemId => `https://mywebsite.com/pages/${itemId}`
  });

  const wrapper = mount(RichText, {
    propsData: {
      content: '<p><a data-item-id="c902d745-44f0-427b-9042-44b1dffcff65" href="">item link</a></p>',
      linkComponent
    }
  });

  expect(wrapper.html()).toEqual('<p><a href="https://mywebsite.com/pages/c902d745-44f0-427b-9042-44b1dffcff65">item link</a></p>');
});

test('Replaces link component and url with in provided content with content item link', () => {
  const linkComponent = linkFactory({
    getLinkComponent: _linkType => ({
      functional: true,
      props: ['link'],
      render: (createElement, context) =>
        createElement('a', {domProps: {target: '_blank', ...context.props.link}}, context.children)
    }),
    getItemLinkUrl: itemId => `https://mywebsite.com/pages/${itemId}`
  });

  const wrapper = mount(RichText, {
    propsData: {
      content: '<p><a data-item-id="c902d745-44f0-427b-9042-44b1dffcff65" href="">item link</a></p>',
      linkComponent
    }
  });

  expect(wrapper.html()).toEqual('<p><a target="_blank" href="https://mywebsite.com/pages/c902d745-44f0-427b-9042-44b1dffcff65">item link</a></p>');
});
