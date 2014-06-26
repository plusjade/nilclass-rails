var Page = function(selector) {
    var node = d3.select(selector);

    this.show = function(name) {
        node.selectAll('div').html('<strong>Loading...</strong>');

        if(!name) { return };

        d3.html("/pages/" + name + ".html?" + Math.random(), function(rsp) {
            if(rsp) {
                node.selectAll('div').remove();
                node.append("div")[0][0].appendChild(rsp);
            }
            else {
                console.log('error loading page name:' + name)
            }
        })
    }

    this.content = function(content) {
        var node = d3.select('#item-content').html('');
        if(content) {
            node.append('div').html(content);
        }
    }
}
