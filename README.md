# Renderer for Rich Text from Kentico Kontent for Vue
This package replaces the linked item resolution provided by the [Kontent Delivery SDK](https://github.com/Kentico/kontent-delivery-sdk-js/blob/master/DOCS.md#resolving-content-items-and-components-in-rich-text-elements).

[Kentico Kontent](https://kontent.ai) allows you to write content in [rich text](https://docs.kontent.ai/tutorials/write-and-collaborate/write-content/composing-content-in-the-rich-text-editor) elements,
where you can do all sorts of formatting.
What's more interesting, you can also compose your content from inline or reusable bits of content, referred to as [components and linked items](https://docs.kontent.ai/tutorials/write-and-collaborate/structure-your-content/structuring-editorial-articles-with-components) respectively.

## When you _don't_ need this package
* You're not using these, you can stop reading and go on with your life.
* You're using components or linked items and happy with the way the [Kontent Delivery SDK](https://www.npmjs.com/package/@kentico/kontent-delivery) [handles rendering linked items](https://github.com/Kentico/kontent-delivery-sdk-js/blob/master/DOCS.md#resolving-content-items-and-components-in-rich-text-elements).
* You're not using Kentico Kontent with Vue.
* You're not using Kentico Kontent at all.

## When you want components to be _components_, though...
The `richTextResolver` extension point of the SDK does decent job, but I wanted my components to be proper components in the framework I was using.
That happened to be Vue.js at the moment. So I wrote this tiny component that makes some of my dreams come true.

## Installation
Pick the package up form npm:
```
npm install vue-kontent-rich-text --save
```

## Basic usage
This package contains a component that accepts the raw rich text value from Kentico Kontent delivery API and your component that will replace each linked item or component found in the text.
Let's say we have content in items of content type _blog_post_ where there are 2 elements:
* _title_ is a regular text that can be rendered as-is
* _content_ is a rich text and needs a bit more love

```vue
<template lang="pug">
  h1 {{blogPost.title.value}}
  div
    rich-text(:content='blogPost.content.value' :linkedItemComponent='linkedItemComponent')
</template>
<script>
  import { RichText } from 'vue-kontent-rich-text';
  import LinkedItem from './components/linked-item.vue';

  export default {
    components: { RichText },
    computed: {
      blogPost: () => blogPost, // Pick it up from a vuex store or wherever you happen to keep it
      linkedItemComponent: () => LinkedItem
    }
  }
</script>
```
Now, my `linked-item` component will need to decide how various linked items and components appearing in the text should look like.
To make pairing of linked item components with linked item data easier, one more thing is exported from this package.
```vue
<script>
  import { linkedItemFactory } from 'vue-kontent-rich-text';
  import YoutubeVideo from './youtube-video.vue';
  import Quote from './quote.vue';
  
  const selectComponent = (contentTypeCodeName) => {
    switch (contentTypeCodeName) {
      case 'youtube_video':
        return YoutubeVideo;
      case 'quote':
        return Quote;
    }
  };

  export default {
    functional: true,
    render: (createElement, context) => {
      const {props} = context;

      const selectLinkedItemData = (itemCodeName) => {
        // Again, pick the blogPost from a vuex store or wherever.
        // I ended up having page 'provide' the blogPost  and then injected it here.
        return blogPost.linkedItems[itemCodeName]; 
      };      

      const component = linkedItemFactory(selectComponent, selectLinkedItemData);
      return createElement(component, {props})
    }
  }
</script>
```
With this rather complicated setup out of the way, we can start writing components for individual linked item types.
The rich-text component passes to the linked items one prop and that is the `item` containing all the linked item data.
In the case of our YouTube video, it contains a video ID and a short description.

```vue
<template lang="pug">
  figure
    iframe(:src='`https://youtube.com/embed/${item.id.value}?rel=0`')
    figcaption {{item.description.value}}
</template>
<script>
  export default {
    props: ['item']
  }
</script>
```

## Rich text in a rich text
Another content type used as a component or linked item in our example also contains a rich text element.
We'll wrap the value in the same `rich-text` component we used on the parent page.
And in case this text contains nested linked items, we'll also pass the linked-item component.

```vue
<template lang="pug">
  blockquote
    rich-text(:content='item.pull_quote.value' :linkedItemComponent='linkedItemComponent')
</template>
<script>
  import { RichText } from 'vue-kontent-rich-text';
  import LinkedItem from './linked-item.vue';

  export default {
    props: ['item'],
    components: {RichText},
    computed: {
      linkedItemComponent: () => LinkedItem
    }
  }
</script>
```
These example components are extremely small and could be easily handled by the out-of-the-box `richTextResolver`,
but as the components grew to render more and more of markup, messing with string interpolation became rather obnoxious.

## Feedback & Contributions
The provided component is quite bare-bones, but does everything I need. I'm interested if your use case differs and thus my implementation lacks.
Furthermore, I'm no Vue expert, so I'd love to hear if there are nicer or more elegant ways of doing things.

