var Page = function(selector) {
    var node = d3.select(selector);

    this.show = function(content) {
        node.selectAll('div').html(content);
    }

    this.content = function(content) {
        var node = d3.select('#item-content').html('');
        if(content) {
            node.append('div').html(content);
        }
    }
}
