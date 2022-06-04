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
var worldMapData = 'world_country_and_usa_states_latitude_and_longitude_values.csv';



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
			
			tooltip.style("left", (event.pageX)-550 + "px")
				.style("top", (event.pageY)-100 + "px")
			}


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
			.on("mousemove", moveTooltip )

				.on("mouseover", function(event, d){ 
					tooltip.transition()
						.duration(100)
						.style("opacity", 1)
					tooltip.html("Player: " + d.nick + "<br>Maps Played: " + d.maps_played + "<br> K/D Ratio: " + d.kd_ratio)
						.style('color', 'lightgrey')	
					
					d3.select(this)
						.transition()
						.duration(20)
						.attr("fill", "#f5f37f")

				})

				.on('mouseout', function(event, d){
					tooltip.transition()
						.duration(100)
						.style("opacity", 0)
					
					d3.select(this)
						.transition()
						.attr('fill', '#0099ff')
						.duration(200)
				})

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
			if (isDescending == false){d3.select('#sort_button').html('Sort In Ascending Order')}
			else{d3.select('#sort_button').html('Sort In Descending Order')}
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
			
				tooltip.style("left", (event.pageX)-190 + "px")
					.style("top", (event.pageY)-110 + "px")
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

				if (this.classList.contains('killsRect')){tooltip.html("Kills per round: " + d.data.k)}
				else{tooltip.html("Assists per round: " + d.data.a)}
				
				tooltip.style("left", (event.pageX) + "px")
					.style("top", (event.pageY) + "px")	
					.style('color', 'lightgrey')	
				
				d3.select(this)
					.transition()
					.duration(20)
					.attr("fill", function(){
						if (this.classList.contains('killsRect')){return '#0099ffde'}
						else{return '#f5f37f'}
					})
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
		d3.csv(worldMapData).then(function(mapData){

			countryIndexes = d3.map(mapData, d=> d.country);

				// Setting up count data for each country
			var rollup = Array.from(d3.rollup(data, d => d.length, d => d.country))
			var final = []
			var counts = []
			for (let i=0; i < rollup.length; i+=1) {
				// One country has to be missed due to it's lack of data
				var country = mapData[countryIndexes.indexOf(rollup[i][0])]
				if(typeof country !== 'undefined'){
					final.push({'country':rollup[i][0], 'count':rollup[i][1], 'long': parseFloat(country['longitude']), 'lat': parseFloat(country['latitude'])})
					counts.push(rollup[i][1])
				}
			}
			


			// Setting up SVG
			const svgwidth=2000;
			const svgheight=800;
			const paddingTop = 100;
			const paddingLeft = 100;

			const rScale = d3.scaleLinear().domain([d3.min(counts), d3.max(counts)]).range([4,15])

			var svg = d3.select("#current")
				.append("svg").attr("width", svgwidth)
				.attr("height", svgheight)
				.append("g")
					.attr("transform",
						"translate(500," + paddingTop + ")");

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
		
				tooltip.style("left", (event.pageX)+60 + "px")
					.style("top", (event.pageY)-120 +"px")
				}
			
			// World projection 
			const projection  = d3.geoNaturalEarth1();
			const pathgeo = d3.geoPath().projection(projection);
			const world = d3.json('world.json')

			world.then(function(map){
				svg.selectAll('#path').data(map.features).enter().append('path')
					.attr('d', pathgeo)
					.style('fill', 'grey')
					.style('stroke', 'white')
					.style('opacity', 0.7)
					.attr('class', 'worldMap')
			

				svg.selectAll("#circle").data(final).enter().append("circle")
					.attr("cx", d=>projection([d.long,d.lat])[0])
					.attr("cy", d=>projection([d.long,d.lat])[1])
					.attr("r", function(d){return rScale(d.count)})
					.attr('id', function(d){return d.country})
					.attr('class', 'circ')
					.attr('fill', 'rgb(231, 99, 89)')
					.style('stroke', 'maroon')
					.style('opacity', 0.6) 
					.on("mousemove", moveTooltip )

		
					.on("mouseover", function(event, d){ 
						tooltip.transition()
							.duration(100)
							.style("opacity", 1)

						tooltip.html("Country: " + this.getAttribute('id') + "<br>Pro players: " + String(d.count)) 
						
						tooltip.style("left", (event.pageX) + "px")
							.style("top", (event.pageY) + "px")	
							.style('color', 'lightgrey')	
						
						d3.select(this)
							.transition()
							.duration(20)
							.attr("fill", "rgb(245, 243, 127)")
					})

					.on('mouseout', function(event, d){
						tooltip.transition()
							.duration(100)
							.style("opacity", 0)
						d3.select(this)
							.transition()
							.attr('fill', 'rgb(231, 99, 89)')
							.duration(200)
					})
					function zoomed({transform}) {
						d3.selectAll('.worldMap').attr("transform", transform);
						d3.selectAll('.circ').attr("transform", transform)
					  }
					svg.call(d3.zoom()
						.extent([[0, 0], [svgwidth, svgheight]])
						.scaleExtent([1, 8])
						.on("zoom", zoomed));

					// SVG title
					svg.append('text')
						.text("Players and where they're from")
						.attr('text-anchor', 'center')
						.attr("transform", "translate("+ 380 + ",-40)")
						.style('fill', 'grey')
						.attr('class', 'title')
						.style('font-family', 'Font Awesome 5 Free')
						.style('font-size', 20);

			});
		});
	});
}

var question5=function(filePath){


	d3.csv(filePath, rowConverter).then(function(data){

		data = data.sort(
			function(a,b){
				return b.rating - a.rating
			}
		)
		
		// Constructing final data array
		const final = []


		for (n of Array(200).keys()){
			final.push(data[n]);
		}
		
		var teams = []
		for(n in final){
			final[n]['id'] = parseInt(n)
			final[n].teams = eval(final[n]['teams']) 
			teams.push(final[n].teams )
		}
		teams = teams.flat(Infinity); 
		var teams = [...new Set(teams)]
		
		var links =[]

		// Matching all players with teams
		for(var i=0;i<final.length;i++){
			for (team of final[i]['teams']){
				for (n of final){
					if (n == final[i]){continue;}
					if (n['teams'].includes(team)){
						var obj={}
						obj["source"]=final[i].id;
						obj["target"]=n.id;
						obj["team"]= team
						links.push(obj);
					}
				}
			}
		}

		// Finding all linked teams, used for node link identification during tooltip setup
		var linkedTeams = d3.map(links, d => d.team)
		var linkedTeams = [...new Set(linkedTeams)]
		
		// SVG Setup
		var width = 1800;
		var height = 800;

		var svg = d3.select("#current")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		// Force initialization
		var force = d3.forceSimulation(data)
			.force("charge", d3.forceManyBody().strength(-50))
			.force("link", d3.forceLink(links))
			.force('center', d3.forceCenter(100, 50))

		// Edge setup
		var edges = svg.selectAll("line")
			.data(links)
			.enter()
			.append("line")
			.attr('class', function(d){return '_' + d.team.replace(/[^0-9a-z]/gi, '')})
			.attr("stroke", "gray")
			.style('stroke-width', 2);

		//Node setup
		var nodes = svg.selectAll("circle")
			.data(final)
			.enter()
			.append("circle")
			.attr('fill', '#5161ce');

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
			tooltip.style("left", (event.pageX)-25 + "px")
				.style("top", (event.pageY)-100+"px")
			}

		// force simulation
		force.on("tick", function() {

			edges.attr("x1", function(d) { return d.source.x*3; })
					.attr("y1", function(d) { return d.source.y*3; })
					.attr("x2", function(d) { return d.target.x*3; })
					.attr("y2", function(d) { return d.target.y*3; });
					
		
			nodes.attr("cx", function(d) { return d.x*3; })
					.attr("cy", function(d) { return d.y*3; })
					.attr("r", 10);
		});
		// Zoom setup
		function zoomed({transform}) {
			d3.selectAll('circle').attr("transform", transform);
			d3.selectAll('line').attr("transform", transform)
			}
		svg.call(d3.zoom()
			.extent([[0, 0], [width, height]])
			.scaleExtent([-5, 8])
			.on("zoom", zoomed))

		// Tooltip highlighting and HTML text for edges
		svg.selectAll('line')
			.on("mousemove", moveTooltip )
			.on("mouseover", function(event, d){ 
				tooltip.transition()
					.duration(100)
					.style("opacity", 1)
				tooltip.html("Team: " + d.team)
				console.log(d)
				
				d3.select(this)
					.transition()
					.duration(20)
					.attr("stroke", "#0099ff")
			})

			.on('mouseout', function(event, d){
				tooltip.transition()
					.duration(100)
					.style("opacity", 0)
				d3.select(this)
					.transition()
					.attr('stroke', 'grey')
					.duration(200)
			});

		// Tooltip highlighting and HTML text for circles
		svg.selectAll('circle')
			.on("mousemove", moveTooltip )
			.on("mouseover", function(event, d){ 
				tooltip.transition()
					.duration(100)
					.style("opacity", 1)

				tooltip.html("Player: " + d.nick)
					for (n of d.teams){
						if (!linkedTeams.includes(n)){continue;}
						var classSearch = '._' + n.replace(/[^0-9a-z]/gi, '')
						console.log(classSearch)
						svg.selectAll(classSearch)
							.attr('stroke', '#0099ff')
					}
					
				
				d3.select(this)
					.transition()
					.duration(20)
					.attr("fill", "rgb(245, 243, 127)")
			})

			.on('mouseout', function(event, d){
				tooltip.transition()
					.duration(100)
					.style("opacity", 0)
				d3.select(this)
					.transition()
					.attr('fill', '#5161ce')
					.duration(200)
				
				for (n of d.teams){
					if (!linkedTeams.includes(n)){continue;}
					var classSearch = '._' + n.replace(/[^0-9a-z]/gi, '')
					svg.selectAll(classSearch)
						.attr('stroke', 'gray')

				}
			
			});










	});
}





// Default loading visualization
if ($("#current").is(':empty')){
	question2(filepath)
	// $('#current').append()
	$('#current').append('<button type="button", id="sort_button">Sort In Ascending Order</button>')
}


$("#navbarSupportedContent").on("click","li .nav-link1",function(e){
	$("#current").empty()
	question1(filepath)
});

$("#navbarSupportedContent").on("click","li .nav-link2",function(e){
	
	$("#current").empty();
	question2(filepath)
	$('#current').append('<button type="button", id="sort_button">Sort In Ascending Order</button>')
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