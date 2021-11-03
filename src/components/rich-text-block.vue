<script>
  import RichTextElement from "./rich-text-element";

  export default {
    functional: true,
    name: 'rich-text-block',
    props: ['block', 'linkedItemComponent', 'linkComponent', 'blockComponent'],
    render: (createElement, context) => {
      const {block, linkedItemComponent, linkComponent, blockComponent} = context.props;

      return createElement(RichTextElement, {props: {block, linkedItemComponent, linkComponent}}, block.children.map(child =>
        createElement(blockComponent, {props: {block: child, linkedItemComponent, linkComponent, blockComponent}})));
    }
  }
</script>
