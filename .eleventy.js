
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = (function(eleventyConfig) {
    eleventyConfig.setWatchJavaScriptDependencies(false);
    // add support for syntax highlighting
    eleventyConfig.addPlugin(syntaxHighlight);


    eleventyConfig.addPassthroughCopy("img");
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("samples");
    eleventyConfig.addPassthroughCopy("pdf");
    eleventyConfig.addPassthroughCopy("out");

});
