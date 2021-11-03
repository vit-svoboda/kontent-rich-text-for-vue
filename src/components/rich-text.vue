<script>
  import RichTextBlock from './rich-text-block';
  import {parseHtml} from "../utils/parseHtml";

  export default {
    name: 'rich-text',
    functional: true,
    props: ['content', 'linkedItemComponent', 'linkComponent'],
    render: (createElement, context) => {
      const {content, linkedItemComponent, linkComponent} = context.props;

      // A temporary measure until the delivery API returns JSON
      const blocks = parseHtml(content);

      return blocks.map(block =>
        createElement(RichTextBlock, {
          props: {
            block,
            linkedItemComponent,
            linkComponent,
            blockComponent: RichTextBlock
          }
        }));
    }
  }
</script>
