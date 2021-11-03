<script>
  const defaultLinkComponent = {
    name: 'default-link-component',
    functional: true,
    props: ['block'],
    render: (createElement, context) =>
      createElement('a', {domProps: {...context.props.block.data}}, context.children)
  };

  export default {
    name: 'rich-text-element',
    functional: true,
    props: ['block', 'linkedItemComponent', 'linkComponent'],
    render: (createElement, context) => {
      const {block, linkedItemComponent, linkComponent = defaultLinkComponent } = context.props;

      switch (block.type) {
        case 'OBJECT':
          return createElement(linkedItemComponent, {props: {block}});
        case 'A':
          return createElement(linkComponent, {props: {block}}, context.children);
        case '#text':
          return context._v(block.value);
        default:
          return createElement(block.type, {domProps: {...block.data}}, context.children);
      }
    }
  }
</script>
