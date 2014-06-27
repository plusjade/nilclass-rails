// Display a <Graph> using d3.
var Display = (function() {
    // Public. update the UI with a graph.
    function update(graph) {
        Plot.nodes(graph);
        var nodes = d3.values(graph.dict);

        updateNodes(nodes);

        World.page.show(graph.meta('content'));

        updateLinks(Plot.links(graph), 'connect');

        updateLinks(Plot.focusPath(graph), 'focusPath')
            .transition()
                .duration(World.duration)
                .style('stroke-opacity', 1)
                .style('stroke-width', 4)
            .transition()
                .duration(World.duration)
                .style('stroke-width', 2)


        World.container.selectAll("g.node")
            .data(graph.metaItems('focus'), function(d) { return d._id })
            .call(Style.highlight);
    }

    function updateNodes(nodes) {
        var root = rootCoord();
        // Update the nodes
        var node = World.container.selectAll("g.node")
            .data(nodes, function(d) { return d._id });

        var nodeEnter = node.enter().append("svg:g")
            .attr('class', function(d){ return 'node ' + d.name })
            .attr("transform", function(d) {
                return "translate(" + (d.x0 || root.x0) + "," + (d.y0 || root.y0) + ")";
            })

        nodeEnter
            .filter(function(d) { return d.icon === "software" })
            .call(Style.software)

        nodeEnter
            .filter(function(d) { return d.icon != "software" })
            .call(Style.icon)

        nodeEnter.call(Style.labels);

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(World.duration)
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);


        var nodeExit = node.exit().transition()
            .duration(World.duration)
            .style("fill-opacity", 0)
            .remove();

        nodeExit.select("circle").attr("r", 1e-6);
        nodeExit.select("text").style("fill-opacity", 1e-6);
    }

    function updateLinks(linkData, namespace) {
        var root = rootCoord();
        var classname = 'link-' + namespace;
        // Update the links.
        var link = World.container.selectAll("path." + classname)
            .data(linkData, function(d) { return d.source._id + '.' + d.target._id; });

        // Enter any new links at the parent's previous position.
        var linkEnter = link.enter().insert("svg:path", "g")
            .style('stroke-opacity', 0)
            .attr("class", function(d) {
                return (d.source.public && d.target.public)
                            ? classname + ' public'
                            : classname;
            })
            .attr("d", World.diagonal);

        link.transition()
            .duration(World.duration)
                .style('stroke-opacity', 1)
                .attr("d", World.diagonal);


        link.exit().remove();

        return link;
    }

    function rootCoord() {
        return { x0:0, y0: World.height / 2 }
    }

    return ({
        update : update
    })
})();
