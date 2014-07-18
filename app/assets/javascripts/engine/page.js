var Page = function(selector) {
    var node = d3.select(selector);

    this.show = function(graph) {
        node.selectAll('div').html(graph.meta('content'))
        node.selectAll('a').on('click', function(d) {
                d3.event.preventDefault();

                var linkData = Plot.diagonalPathLinks(graph.findAll(['User', "ORM", "orm.create", "CREATE", "Database"]));
                Display.updateLivePaths(linkData, 'overlay');
            })
    }

    this.content = function(content) {
        var node = d3.select('#item-content').html('');
        if(content) {
            node.append('div').html(content);
        }
    }
}
