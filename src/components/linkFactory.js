const getLinkType = (data) => {
  if (data['data-item-id']) {
    return 'content-item';
  }
  if (data['data-asset-id']) {
    return 'asset';
  }
  if (data['data-email-address']) {
    return 'email';
  }
  return 'web-url';
}

export default ({getLinkComponent, getItemLinkUrl}) => ({
  name: 'rich-text-link',
  functional: true,
  props: ['block'],
  render: (createElement, context) => {
    const {data} = context.props.block;

    const itemId = data['data-item-id'];
    if (getItemLinkUrl && itemId) {
      data.href = getItemLinkUrl(itemId);
    }

    if (getLinkComponent) {
      const linkType = getLinkType(data);
      const component = getLinkComponent(linkType);
      if (component) {
        return createElement(component, {props: {link: {...data}}}, context.children);
      }
    }

    return createElement('a', {domProps: {...data}}, context.children);
  }
});
