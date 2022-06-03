// ---------Responsive-navbar-active-animation-----------
function test(){
	var tabsNewAnim = $('#navbarSupportedContent');
	var selectorNewAnim = $('#navbarSupportedContent').find('li').length;
	var activeItemNewAnim = tabsNewAnim.find('.active');
	var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
	var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
	var itemPosNewAnimTop = activeItemNewAnim.position();
	var itemPosNewAnimLeft = activeItemNewAnim.position();
	$(".hori-selector").css({
		"top":itemPosNewAnimTop.top + "px", 
		"left":itemPosNewAnimLeft.left + "px",
		"height": activeWidthNewAnimHeight + "px",
		"width": activeWidthNewAnimWidth + "px"
	});
	$("#navbarSupportedContent").on("click","li",function(e){
		$('#navbarSupportedContent ul li').removeClass("active");
		$(this).addClass('active');
		var activeWidthNewAnimHeight = $(this).innerHeight();
		var activeWidthNewAnimWidth = $(this).innerWidth();
		var itemPosNewAnimTop = $(this).position();
		var itemPosNewAnimLeft = $(this).position();
		$(".hori-selector").css({
			"top":itemPosNewAnimTop.top + "px", 
			"left":itemPosNewAnimLeft.left + "px",
			"height": activeWidthNewAnimHeight + "px",
			"width": activeWidthNewAnimWidth + "px"
		});
	});
}
$(document).ready(function(){
	setTimeout(function(){ test(); });
});
$(window).on('resize', function(){
	setTimeout(function(){ test(); }, 500);
});
$(".navbar-toggler").click(function(){
	$(".navbar-collapse").slideToggle(300);
	setTimeout(function(){ test(); });
});


var rowConverter = function(d){
    for (n in d){
        if (isNaN(parseFloat(d[n])) == false){
            d[n] = parseFloat(d[n]);
        } 
		else {continue;}
        
    }
    return d
}

// Insert body for svg's
$('body').append('<div id="current"></div>')



// define filepath
var filepath = 'hltv_playerStats-complete.csv';



// Define function for question 1
var question1=function(filePath){
    d3.csv(filePath, rowConverter).then(function(data){

		var margin = {top: 50, right: 30, bottom: 50, left: 60},
			width = 800 - margin.left - margin.right,
			height = 800 - margin.top - margin.bottom;

		// append the svg object to the body of the page
		var svg = d3.select("#current")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform",
				"translate(" + margin.left + "," + margin.top + ")");


		// Add X axis
		var x = d3.scaleLinear()
			.domain([d3.min(data, function(d){return d.maps_played}), d3.max(data, function(d){return d.maps_played})])
			.range([ 0, width ]);
		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x))
			.style('font-family', 'Font Awesome 5 Free');

		// Add Y axis
		var y = d3.scaleLinear()
			.domain([d3.min(data, function(d) { return d.kd_ratio; }), d3.max(data, function(d) { return d.kd_ratio; })])
			.range([ height, 0]);
		svg.append("g")
			.call(d3.axisLeft(y))
			.style('font-family', 'Font Awesome 5 Free');

		// Add the dots
		svg.selectAll('circle').data(data).enter().append('circle')
			.attr("fill", "#0099ff")
			.attr('cx', function(d){return x(d.maps_played)})
			.attr('cy', function(d){return y(d.kd_ratio)})
			.attr('r', 3)

		svg.append('text')
			.text('KD Ratio')
			.attr('text-anchor', 'center')
			.attr("transform", "translate("+ ((width)/2-margin.left/2) + "," + (height+  margin.bottom) + ")")
			.style('font-family', 'Font Awesome 5 Free')
			.style('fill', 'grey');

		svg.append('text')
			.text('Maps Played')
			.attr('text-anchor', 'center')
			.attr("transform", "translate("+ (-margin.left/2) + "," + (height/2 - margin.bottom/2) + ")" + ' rotate(-90)')
			.style('font-family', 'Font Awesome 5 Free')
			.style('fill', 'grey');

    });
}


var question2=function(filePath){
	d3.csv(filePath, rowConverter).then(function(data){
		
		// Filter for top 50 ratings
		players = []
		final = []
		data = Array.from(d3.map(data, function(d){return {'nick': d.nick, 'rating': d.rating}})).sort()
		
		for (n of Array(50).keys()){
			final.push(data[n]);
			players.push(data[n]['nick'])
		}


		// SVG setup
		var svgheight = 600;
		var svgwidth = 1500;
		var padding = 150;

		var svg = d3.select("#current").append("svg")
						.attr("width", svgwidth)
						.attr("height", svgheight);

		// X and Y scale setup
		var xScale = d3.scaleBand()
			.domain(players)
			.range([padding, svgwidth-padding])

		var yScale = d3.scaleLinear()
			.domain([d3.min(final, function(d){return d.rating;}),
				d3.max(data, function(d){return d.rating;})
			])
			.range([padding, svgheight-padding]);

		svg.append("g")
			.attr("transform", "translate(0," + (svgheight-padding) + ")")
			.call(d3.axisBottom(xScale))
			.selectAll('text')
				.attr('text-anchor', 'end')
				.attr('transform', 'translate(0,10) rotate(-45)')
				.style('font-family', 'Font Awesome 5 Free')
				.style('color', 'grey');

					
		// SVG Title			
		svg.append('text')
			.text('Top 50 Players and their ratings')
			.attr('text-anchor', 'center')
			.attr("transform", "translate("+ ((svgwidth)/2-padding) + "," + (20) + ")")
			.style('fill', 'grey')
			.style('font-family', 'Font Awesome 5 Free')
			.style('font-size', 20);
			
							
		// Tooltip setup
		var tooltip = d3.select("#current")
			.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")
			.style("background-color", "black")
			.style("color", "white")
			.style("border-radius", "5px")
			.style("padding", "10px")
			

		// Setting up movetootip function	
		const moveTooltip = function(event,d) {
			
			tooltip.style("left", (event.pageX)-170 + "px")
				.style("top", (event.pageY)-170 + "px")
			}

		var svg_bars = svg.selectAll(".bar")
				.data(final).enter().append("rect")
				.attr("class", "bar")
				.attr('fill', '#f5f37f')

				.on("mousemove", moveTooltip )

				.on("mouseover", function(event, d){ 
					tooltip.transition()
						.duration(100)
						.style("opacity", 1)
					tooltip.html("Rating: " + d.rating + "<br> Player: " + d.nick)
						.style("left", (event.pageX)-170 + "px")
						.style("top", (event.pageY)-170 + "px")	
						.style('color', 'lightgrey')	
					
					d3.select(this)
						.transition()
						.duration(20)
						.attr("fill", "#0099ff")

				})

				.on('mouseout', function(event, d){
					tooltip.transition()
						.duration(100)
						.style("opacity", 0)
					
					d3.select(this)
						.transition()
						.attr('fill', '#f5f37f')
						.duration(200)
				})
			
				.attr("x", function(d){
					return xScale(d.nick);
				})
				.attr("y", function(d){
					return svgheight-padding-yScale(d.rating);
				})
				.attr("width", function(d){
					return xScale.bandwidth()-3;
				})
				.attr("height", function(d){
					return yScale(d.rating);
				})

		// Flag for ascending/decending
		var isDescending = false;
		var sortBars = function(){
			sorted = final.sort(function(a, b){
				if (isDescending == false){
					return a.rating - b.rating
				} else {
					return b.rating - a.rating
				}

			})

			// Change domain after sorting to fit scaleBand
			xScale.domain(d3.map(sorted, function(d){return d.nick}))

			d3.selectAll('.bar')
				.data(sorted)
				.transition('sorting')
				.duration(1000)
				.attr('height', function(d,i){
					return yScale(d.rating)
				})
				.attr("y", function(d, i){
					return svgheight-padding-yScale(d.rating);
				})
				.attr("x", function(d, i){
					return xScale(d.nick);
				});

				isDescending = !isDescending;
		}      

		// Changing text on sort button
		d3.select('#sort_button').on('click', function(){
			sortBars()
			if (isDescending == false){d3.select('#sort_button').html('Sort Ascendingly')}
			else{d3.select('#sort_button').html('Sort Descendingly')}
		})
	});
}

var question3=function(filePath){
	d3.csv(filePath, rowConverter).then(function(data){

		data = Array.from(d3.map(data, function(d){return {'nick': d.nick, 'k': d.kills_per_round, 'a': d.assists_per_round, 'rating': d.rating}})).sort(
			function(a,b){
				return b.rating - a.rating
			}
		)
		
		// Constructing final data array
		const players = []
		const final = []
		const kills = []
		const assists = []

		for (n of Array(50).keys()){
			final.push({'nick': data[n].nick, 'k': data[n].k, 'a': data[n].a});
			players.push(data[n]['nick'])
			kills.push(data[n].k)
			assists.push(data[n].a)
		}

		// Setting up SVG
		const width=1500;
        const height=800;
        const padding=100;
        var colors = d3.scaleOrdinal().domain(['k', 'a']).range(['#e76359', 'lightgrey'])
        var keys = ['k', 'a'];

		var svg = d3.select('#current').append('svg')
            .attr('width', width)
            .attr('height', height);


		// X and Y Scale
		const xScale = d3.scaleBand()
            .domain(d3.range(final.length)) 
            .range([padding, width-padding])
            .padding([0.1]);

        const yScale = d3.scaleLinear().domain([0, d3.sum([d3.max(kills), d3.max(assists)])]).range([height-padding, padding]);

		

		const xAxis = d3.axisBottom(xScale).tickFormat(function(d) { return players[d]});
		const yAxis = d3.axisLeft(yScale);


		// Tooltip setup
		var tooltip = d3.select("#current")
			.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")
			.style("background-color", "black")
			.style("color", "white")
			.style("border-radius", "5px")
			.style("padding", "10px")

		const moveTooltip = function(event,d) {
			
				tooltip.style("left", (event.pageX)-170 + "px")
					.style("top", (event.pageY)-170 + "px")
				}

		svg.append('g').call(xAxis)
            .attr('class', 'xAxis')
            .attr('transform', "translate(0," + (height - padding) + ")")
            .selectAll("text")
            .style('text-anchor', 'end')
            .attr('transform', 'translate(0,10) rotate(-45)');

		svg.append('g').call(yAxis) 
            .attr('class', 'yAxis')
            .attr('transform', 'translate('+ padding + ',0)');

		
		// Group and stack setup for stacked bar chart
		var series = d3.stack().keys(keys)
		var stack = series(final);
		var groups = svg.selectAll('.gbars')
            .data(stack).enter().append('g')
            .attr('class', 'gbars')
            .attr('fill', function(d){return colors(d.index)})

		// Bars for stacked bar chart
		var rects = groups.selectAll('rect').data(function(d){return d}).enter().append('rect')
			.attr('x', function(d,i){
				return xScale(i);
			})
			.attr('y', function(d){
				return yScale(d[1]);
			})
			.attr('width', function(d){
				return xScale.bandwidth();
			})
			.attr('height', function(d){
				return  yScale(d[0]) - yScale(d[1]);
			})
			.attr('class', function(d){
				if (d[0] == 0){return 'killsRect'}
				else{return 'assistRect'}
			})
			.on("mousemove", moveTooltip )

	
			.on("mouseover", function(event, d){ 
				tooltip.transition()
					.duration(100)
					.style("opacity", 1)

				if (this.classList.contains('killsRect')){tooltip.html("Kills: " + d.data.k)}
				else{tooltip.html("Assists: " + d.data.a)}
				
				tooltip.style("left", (event.pageX)-170 + "px")
					.style("top", (event.pageY)-170 + "px")	
					.style('color', 'lightgrey')	
				
				d3.select(this)
					.transition()
					.duration(20)
					.attr("fill", "#0099ff")
			})

			.on('mouseout', function(event, d){
				tooltip.transition()
					.duration(100)
					.style("opacity", 0)
				d3.select(this)
					.transition()
					.attr('fill', function(){
						if (this.classList.contains('killsRect')){return '#e76359'}
						else{return 'lightgrey'}
					})
					.duration(200)
			})

		// SVG title
		svg.append('text')
			.text('Kill/Death per round for top 50 players')
			.attr('text-anchor', 'center')
			.attr("transform", "translate("+ ((width)/2-padding-padding) + "," + (40) + ")")
			.style('fill', 'grey')
			.style('font-family', 'Font Awesome 5 Free')
			.style('font-size', 20);
	});
}

var question4=function(filePath){
	d3.csv(filePath, rowConverter).then(function(data){

	});
}

var question5=function(filePath){
	d3.csv(filePath, rowConverter).then(function(data){

	});
}





// Default loading visualization
if ($("#current").is(':empty')){
	question2(filepath)
	// $('#current').append()
	$('#current').append('<button type="button", id="sort_button">Sort Ascendingly</button>')
}


$("#navbarSupportedContent").on("click","li .nav-link1",function(e){
	$("#current").empty()
	question1(filepath)
});

$("#navbarSupportedContent").on("click","li .nav-link2",function(e){
	
	$("#current").empty();
	question2(filepath)
	$('#current').append('<button type="button", id="sort_button">Sort Ascendingly</button>')
});

$("#navbarSupportedContent").on("click","li .nav-link3",function(e){
	$("#current").empty();
	question3(filepath)
});

$("#navbarSupportedContent").on("click","li .nav-link4",function(e){
	$("#current").empty();
	question4(filepath)
});

$("#navbarSupportedContent").on("click","li .nav-link5",function(e){
	$("#current").empty();
	question5(filepath)
});