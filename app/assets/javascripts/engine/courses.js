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
                .attr('href', function(d){ return '/courses/' + d.url })
                .html(function(d){ return d.name });

        courses.exit().remove();

        d3.select('#courses-toggle').on('click', function() {
            d3.event.preventDefault();
            var node = d3.select('#courses');

            node.classed('active', !node.classed('active'));
        })


        d3.select('#steps-count').on('click', function() {
            d3.event.preventDefault();
            var node = d3.select('#table-of-contents');

            node.classed('active', !node.classed('active'));
        })


    }

    function update(d) {
        d3.select('#course-title h2').html(d.name);
    }

    initialize();
}
