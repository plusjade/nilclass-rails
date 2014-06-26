// Library for consuming a graph object to generate coordinates 
// in order to plot the graph on the page using d3.
var Plot = function() {
    var z = 0;

    // Plot the graph nodes based on the custom data format.
    // This means determing x and y coordinates relative to each node.
    // Note this is mutable service, it mutates the graph.
    function nodes(graph) {
        walk(graph, graph._root, { "x" : 70, "y" : 180 });

        return graph;
    }

    function links(graph) {
        var links = [];

        for(key in graph.dict) {
            graph.connections(key).forEach(function(name) {
                links.push({
                    source: graph.find(key),
                    target: graph.find(name)
                });
            })
        }

        return links;
    }

    function focusPath(graph) {
        var links = [],
            paths = [];

        if (graph.metaItems('focusPath').length > 0) {
            var paths = [graph.metaItems('focusPath')];
        } else if (graph.meta('focusPaths')) {
            var paths = graph.meta('focusPaths').map(function(path) {
                return path.map(function(name) {
                    return graph.find(name);
                })
            })
        }

        paths.forEach(function(path) {
            path.forEach(function(d, i) {
                if(path[i+1]) {
                    links.push({
                        source: d,
                        target: path[i+1]
                    });
                }
            })
        })

        return links;
    }

    function walk(graph, start, previous) {
        var item = graph.find(start);

        item._id = item.name;
        item.index = z;

        // temp hack. model 3D.
        item.depth = 0;
        if (['software', 'document-html', 'image', 'video-2', 'filesystem'].indexOf(item.icon) != -1) {
            item.depth = 1;
        }

        var coord = gridify(item.grid, (item.depth > 0 ? 100 : 125));

        item.x0 = previous.x;
        item.y0 = previous.y; 
        item.x = previous.x + coord.x;
        item.y = previous.y + coord.y;

        graph.mappings(start).forEach(function(name) {
            z++;
            walk(graph, name, item);
        })

        return graph;
    }


    // parses grid statements to determine relative coordinate offset.
    // Example:
    // "top-right 2" returns an x,y coordinate that is top and to the right
    // as measured in spacing units.
    function gridify(input, spacing) {
        if(!spacing) spacing = 100;
        var parts = (input ? input.split(/\s+/) : []),
            grid = parts[0], 
            multiple = (parts[1] || 1),
            x = 0,
            y = 0;

        if (grid === "top") {
            y = -(spacing * multiple);
        }
        else if (grid === "top-right") {
            x = (spacing * multiple);
            y = -(spacing * multiple);
        }
        else if (grid === "right") {
            x = (spacing * multiple);
        }
        else if (grid === "bottom-right") {
            x = (spacing * multiple);
            y = (spacing * multiple);
        }
        else if (grid === "bottom") {
            y = (spacing * multiple);
        }
        else if (grid === "bottom-left") {
            x = -(spacing * multiple);
            y = (spacing * multiple);
        }
        else if (grid === "left") {
            x = -(spacing * multiple);
        }
        else if (grid === "top-left") {
            x = -(spacing * multiple);
            y = -(spacing * multiple);
        }

        return { x : x, y : y };
    }

    // Public API
    return {
        nodes : nodes,
        links : links,
        focusPath : focusPath
    };
}();
