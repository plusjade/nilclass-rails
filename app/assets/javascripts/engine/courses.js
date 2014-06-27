var Courses = function(CourseData) {
    var CourseData = CourseData;
    this.data = function() {
        return CourseData;
    }
    this.update = update;

    function initialize() {
        var courses = d3.select('#courses ul').selectAll('li')
            .data(CourseData, function(d){ return d.url });

        courses.enter()
            .append('li').append('a')
                .attr('href', function(d){ return '#' + d.url })
                .html(function(d){ return d.name })
                .on('click', function(d) {
                    d3.event.preventDefault();
                    d3.select('#courses').classed('active', false);

                    update(d);

                    World.diagram = new Diagram(d.url);
                    World.diagram.get(0, function(graph, index) {
                        Display.update(graph);
                        World.diagram.steps(function(steps) {
                            Navigation.update(steps, index);
                        })
                    })
                });

        courses.exit().remove();

        d3.select('#courses .courses').on('click', function() {
            d3.event.preventDefault();
            var node = d3.select('#courses');

            node.classed('active', !node.classed('active'));
        })
    }

    function update(d) {
        d3.select('#courses .title h2').html(d.name);
    }

    initialize();
}
