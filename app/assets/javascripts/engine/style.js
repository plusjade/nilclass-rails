var Style = {
    text : function(nodes) {
        return nodes
            .append("svg:text")
            .attr("dy", function(d) {
                return 65;
            })
            .attr("text-anchor", function(d) { return d['text-anchor'] || 'middle' })
            .text(function(d) { return d.text })
            .style("font-size", 12)
            .style("fill-opacity", 1);
    }

    ,
    clicker : function(nodes) {
        nodes.append('circle')
            .attr('class', 'clicker')
            .attr('r', 50)
            .on('click', function(d) {
                World.page.content(d.content || '');
            })

        return nodes;
    }
    ,
    software : function(nodes) {
        nodes.append("svg:circle")
            .attr('class', 'software')
            .attr("r", 7);

        nodes.call(Style.clicker);

        return nodes;
    }
    ,
    icon : function(nodes) {
        nodes.append('g').append('use')
            .attr('x', -15)
            .attr('y', -15)
            .attr('xlink:href', function(d) { return '#' + d.icon })
            .attr('class', function(d) { return "icon " + d.icon })
            .attr('height', function(d) {
                return d.depth > 0 ? 20 : 30;
            })
            .attr('width', function(d) {
                return d.depth > 0 ? 20 : 30;
            })

        nodes.call(Style.clicker);

        return nodes;
    }
    ,
    labels : function(nodes) {
        return nodes
            .append("svg:text")
            .attr("dy", function(d) {
                return d.depth > 0 ? 35 : 45;
            })
            .attr("text-anchor", "middle")
            .text(function(d) { return d.name || d.id })
            .style("font-size", function(d) { 
                return d.depth > 0 ? '10px' : '14px';
            })
            .style("fill-opacity", 1);
    }

    ,
    highlight : function(nodes) {
        nodes.selectAll("use")
            .transition()
            .duration(World.duration)
                .attr('x', -30)
                .attr('y', -30)
                .attr('height', 60)
                .attr('width', 60)
            .transition()
            .duration(World.duration)
                .attr('x', -25)
                .attr('y', -25)
                .attr('height', 50)
                .attr('width', 50)

        nodes.exit().selectAll("use").transition()
            .duration(World.duration)
                .attr('x', -15)
                .attr('y', -15)
                .attr('height', 30)
                .attr('width', 30)

        nodes.selectAll("circle.software")
            .transition()
                .duration(World.duration)
                .attr('r', 20)
            .transition()
                .duration(World.duration)
                .attr('r', 16)


        nodes.exit().selectAll("circle.software").transition()
            .duration(World.duration)
            .attr('r', 8)

        nodes.insert('svg:circle', 'g')
            .attr('class', 'highlight')
            .attr('r', 0)
            .transition()
                .duration(World.duration)
                .attr('r', 60)
            .transition()
                .duration(World.duration)
                .attr('r', 50)


        nodes.exit().selectAll("circle.highlight").transition()
            .duration(World.duration)
            .attr('r', 0)
            .remove()

        return nodes;
    }
}
