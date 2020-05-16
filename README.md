# VuePress Plugin Zengarden Tags

Provides tags for your VuePress blog 🏷

## Installation

```bash
npm i --save-dev vuepress-plugin-zengarden-tags
# or
yarn add -D vuepress-plugin-zengarden-tags
```

## Usage

Add the following to your `config.js` or `index.js` file.

```javascript
['zengarden-tags']
```

You should now have `this.$tags` available.

## Configuration

```javascript
['zengarden-tags', {
    key: 'tags',        // the frontmatter key to look for
    path: '/tags/',     // the path to publish the generated pages under
    title: 'Tags',      // the title of the generated page
    tag: 'Layout',      // layout for single tag page
    tags: 'Layout'      // layout for the tags overview page
}]
```



