var Navigation = {
    current : 0
    , 
    node : d3.select('#prev-next')

    , 
    render : function() {
        var self = this;
        this.node
            .selectAll('a.next')
                .on('click', function() {
                    d3.event.preventDefault();
                    self.next();
                })

        this.node
            .selectAll('a.prev')
                .on('click', function() {
                    d3.event.preventDefault();
                    self.previous();
                })
    }

    ,
    update : function(steps, index) {
        var self = this;
        this.current = index || 0;

        steps.forEach(function(d, i) {
            d.active = (i === index);
        })

        var nodes = d3.select('#table-of-contents > ol').selectAll('li')
                    .data(steps, function(d){ return d.name })
                    .classed('active', function(d) { return d.active })

        nodes.enter()
            .append('li')
                .classed('active', function(d) { return d.active })
            .append('a')
                .html(function(d) { return d.title })
                .on('click', function(d, i) {
                    d3.event.preventDefault();
                    self.navigate(i);
                    d3.select('#table-of-contents').classed('active', false);
                })

        nodes.exit().remove();
    }

    ,
    // Internal. Prgramatically navigate to step at index.
    navigate : function(index) {
        var self = this;
        World.diagram.getBounded(index, function(graph) {
            Display.update(graph);
            self.current = graph.meta('index');
            self.highlight(self.current);
            if (graph.meta('slug')) {
                var url = window.location.pathname.split('/');
                // (4 slots)
                if (url.length === 4) {
                    url.pop(); //   / course / course_id / step_name
                }
                url.push(graph.meta('slug'));
                history.replaceState(null, null, url.join('/'));
            }
        })
    }

    ,
    next : function() {
        this.navigate(this.current+1);
    }

    ,
    previous : function() {
        this.navigate(this.current-1);
    }

    ,
    highlight : function(index) {
        d3.select('#table-of-contents > ol').selectAll('li')
            .classed('active', false)
            .filter(':nth-child('+ (index+1) +')').classed('active', true);
    }
}
