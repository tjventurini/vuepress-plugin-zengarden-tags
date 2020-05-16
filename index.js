const pathlib = require('path')

module.exports = (options, context) => {

    let config = {...{
        key: 'tags',
        path: '/tags/',
        title: 'Tags',
        tag: 'Layout',
        tags: 'Layout'
    }, ...options}

    let tags_collection = {}

    return {

        name: 'vuepress-plugin-zengarden-tags',

        /**
         * extend page data
         * 
         * Note: we use this method to get all tags available and to
         *       create an index that we can store as dynamic module.
         */
        async extendPageData($page) {

            const {
                _filePath,           // file's absolute path
                _computed,           // access the client global computed mixins at build time, e.g _computed.$localePath.
                _content,            // file's raw content string
                _strippedContent,    // file's content string without frontmatter
                key,                 // page's unique hash key
                frontmatter,         // page's frontmatter object
                regularPath,         // current page's default link (follow the file hierarchy)
                path,                // current page's real link (use regularPath when permalink does not exist)
            } = $page

            // skip if the page is not published
            if (! frontmatter.publish) return

            // get tags from page
            let tags = frontmatter[config.key]

            // if there are no tags, we can skip
            if (! tags) return

            // loop through the tags and push them
            // to the tags collection if not available.
            // also make sure that we keep a reference
            // to the page so we can resolve it later
            tags.forEach(function(tag) {
                if (!tags_collection[tag]) {
                    tags_collection[tag] = []
                }

                tags_collection[tag].push(key)
            })
        },

        /**
         * additional pages
         * 
         * Note: We use this method to create the pages needed to
         *       display the tags list and individual tags.
         */
        async additionalPages() {
            let pages = []

            // add tags list page
            pages.push({
                title: config.title,
                path: config.path,
                frontmatter: {
                    layout: config.tags
                }
            })

            // add page for each tag
            for (let tag in tags_collection) {
                pages.push({
                    title: tag,
                    path: config.path + tag + '/',
                    frontmatter: {
                        layout: config.tag,
                        page_tag: tag
                    }
                })
            }

            return pages
        },

        /**
         * generate dynamic modules
         */
        clientDynamicModules() {
            // prefix to be used as the folder name in @vuepress/core/.temp/dynamic
            const DIRECTORY_PREFIX = 'zengarden-tags'

            // stringify the options of the plugin
            let options_json_string = JSON.stringify(config)

            // stringify the tags_collection
            let tags_json_string = JSON.stringify(tags_collection)

            // actually create the dynamic modules
            return [
                {
                    name: `${DIRECTORY_PREFIX}/options.js`,
                    content: `export default ${options_json_string}`
                },
                {
                    name: `${DIRECTORY_PREFIX}/tags.js`,
                    content: `export default ${tags_json_string}`
                }
            ]
        },

        /**
         * enhance app files
         */
        enhanceAppFiles() {
            
            // add the $posts object to the vue root element
            return [
                pathlib.resolve(__dirname, 'tags.js')
            ]
        },

    }

}