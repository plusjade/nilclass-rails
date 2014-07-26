var Page = function(selector) {
    var node = d3.select(selector);

    this.show = function(content) {
        node.selectAll('div').html(content);
    }
}
