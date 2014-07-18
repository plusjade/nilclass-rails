// Display a <Graph> using d3.
var Display = (function() {
    // Public. update the UI with a graph.
    function update(graph) {
        updateLivePaths([], 'overlay'); // clear

        updateBreadCrumb(graph);
        World.page.show(graph);

        Plot.nodes(graph);
        var nodes = d3.values(graph.dict);

        updateLinks(Plot.diagonalConnectionLinks(graph), 'connect');

        updateLivePaths(Plot.diagonalFocusPathLinks(graph), 'focusPath');
        updateLivePaths(Plot.diagonalFocusPathLinks(graph), 'focusPath-reverse', true);


        updateNodes(nodes);

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
            .attr('class', function(d){ return 'node ' + d.icon })
            .attr("transform", function(d) {
                return "translate(" + (d.x0 || root.x0) + "," + (d.y0 || root.y0) + ")";
            })

        nodeEnter
            .filter(function(d) { return d.icon === "software" })
            .call(Style.software)

        nodeEnter
            .filter(function(d) { return d.icon != "software" })
            .call(Style.icon)

        nodeEnter
            .filter(function(d) { return !!d.text })
            .call(Style.text)

        nodeEnter.call(Style.labels);

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(World.duration)
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .attr('display', function(d){ return d.hide ? 'none' : null })

        nodeUpdate.select("text")
            .style("fill-opacity", 1);


        var nodeExit = node.exit().transition()
            .duration(World.duration)
            .style("fill-opacity", 0)
            .remove();

        nodeExit.select("circle").attr("r", 1);
        nodeExit.select("text").style("fill-opacity", 1);

        return node;
    }

    // Update link connections between items.
    // @param[Array] linkData - formated linkData for d3.
    // @param[String] namespace - used to preserve grouping and uniqueness.
    function updateLinks(linkData, namespace) {
        var classname = 'link-' + namespace;
        // Update the links.
        var link = World.container.select('g.group-' + namespace).selectAll("path." + classname)
            .data(linkData, function(d) { return d.source._id + '.' + d.target._id; });

        // Enter any new links at the parent's previous position.
        var linkEnter = link.enter().append("svg:path")
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

    // Similar to updateLinks but adds animated directional flow icons.
    // @param[Array] linkData - formated linkData for d3.
    // @param[String] namespace - used to preserve grouping and uniqueness.
    // @param[Boolean] reverse - set true to reverse animation direction.
    function updateLivePaths(linkData, namespace, reverse) {
        var pathData = updateLinks(linkData, namespace)
            .call(Style.pulsePath)

        updateFlowIcons(linkData, pathData[0], namespace, reverse);

        return pathData;
    }

    // @param[Array] linkData - formated linkData for d3.
    // @param[Array] paths - actual SVG path DOM nodes required.
    // @param[String] namespace - used to preserve grouping and uniqueness.
    function updateFlowIcons(linkData, paths, namespace, reverse) {
        var markerData = [], markers;
        paths.map(function(d, i) {
            if(d) {
                var slope = (linkData[i].target.y - linkData[i].source.y)/
                                (linkData[i].target.x - linkData[i].source.x);
                // this coincides with the transform(rotate()) format (clockwise degrees)
                var degree = Math.atan(slope) * (180/Math.PI);
                markerData.push({
                    x: linkData[i].source.x,
                    y: linkData[i].source.y,
                    path: d,
                    degree : degree,
                    reverse : reverse,
                    _id : (linkData[i].source._id + linkData[i].target._id + namespace)
                });
            }
        });

        markers = World.container
                        .select('g.group-' + namespace).selectAll("g." + namespace)
                            .data(markerData, function(d) { return d._id });

        // ENTER
        markers.enter().append("svg:g")
            .attr('class', namespace + ' flow-icon')
            .attr('transform', function(d) {
                return 'translate('+ d.x +','+ d.y +')';
            })
            .append('use')
                .attr('xlink:href', '#flow-icon')
                .attr('height', 20)
                .attr('width', 20)
                .attr('x', -10)
                .attr('y', -10)
                .attr('transform', function(d) {
                    return 'rotate(' + (d.degree + (d.reverse ? 180 : 0)) + ')';
                });

        // UPDATE
        markers.transition()
            .delay(400)
            .duration(1500)
            .style('display', 'block')
            .attrTween("transform", function(d) {
                var l = d.path.getTotalLength()/2; // mid-point
                  return function(t) {
                    var offset = t * l;
                    if (d.reverse) {
                        offset = d.path.getTotalLength() - offset;
                    }
                    var p = d.path.getPointAtLength(offset);
                    return "translate(" + p.x + "," + p.y + ")";
                  };
            })

        // EXIT
        markers.exit().remove();

        return markers;
    }

    function updateBreadCrumb(graph) {
        var current = graph.meta('index') + 1;
        var count = '<em>'+ current + '</em> of ' + graph.meta('total') + ' <i class="fa fa-chevron-down"> </i>';
        d3.select('#steps-count').html(count);
        d3.select('#signup-form').classed('active', current === graph.meta('total'));
    }

    function rootCoord() {
        return { x0:0, y0: World.height / 2 }
    }

    return ({
        update : update,
        updateLivePaths : updateLivePaths
    })
})();
