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

		var margin = {top: 50, right: 30, bottom: 60, left: 60},
			width = 800 - margin.left - margin.right,
			height = 800 - margin.top - margin.bottom;

		// append the svg object to the body of the page
		var svg = d3.select("#current")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.attr('transform', 'translate(550,00)')
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
			
			tooltip.style("left", (event.pageX)+20 + "px")
				.style("top", (event.pageY)-150 + "px")
			}


		// Add X axis
		var x = d3.scaleLinear()
			.domain([d3.min(data, function(d){return d.maps_played})-100, d3.max(data, function(d){return d.maps_played})+100])
			.range([ 0, width ]);
		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x))
			.style('font-family', 'Font Awesome 5 Free');

		// Add Y axis
		var y = d3.scaleLinear()
			.domain([d3.min(data, function(d) { return d.kd_ratio; })-0.05, d3.max(data, function(d) { return d.kd_ratio; })+0.05])
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
			.text('Maps Played')
			.attr('text-anchor', 'center')
			.attr("transform", "translate("+ ((width)/2-margin.left/2) + "," + (height+  margin.bottom/2+10) + ")")
			.style('font-family', 'Font Awesome 5 Free')
			.style('fill', 'grey');

		svg.append('text')
			.text('KD Ratio')
			.attr('text-anchor', 'center')
			.attr("transform", "translate("+ (-margin.left/2) + "," + (height/2) + ")" + ' rotate(-90)')
			.style('font-family', 'Font Awesome 5 Free')
			.style('fill', 'grey');

		// SVG Title			
		svg.append('text')
			.text('Maps played against KD Ratio')
			.attr('text-anchor', 'center')
			.attr("transform", "translate("+ ((width)/2-margin.left-margin.left) + "," + (-20) + ")")
			.style('fill', 'grey')
			.style('font-family', 'Font Awesome 5 Free')
			.style('font-size', 20);

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
		var svgheight = 700;
		var svgwidth = 1500;
		var padding = 150;

		var svg = d3.select("#current").append("svg")
				.attr("width", svgwidth)
				.attr("height", svgheight)
				.attr('transform', 'translate(250,100)');

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
            .attr('height', height)
			.attr('transform', 'translate(250,0)');


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
			.text('Kill/Assists per round for top 50 players')
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
						"translate(450," + paddingTop + ")");

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
							.attr("fill", "#0099FF")
							.style('stroke', 'blue')

					})

					.on('mouseout', function(event, d){
						tooltip.transition()
							.duration(100)
							.style("opacity", 0)
						d3.select(this)
							.transition()
							.attr('fill', 'rgb(231, 99, 89)')
							.style('stroke', 'maroon')
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
		var width = 2000;
		var height = 1000;

		var svg = d3.select("#current")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		// Force initialization
		var force = d3.forceSimulation(data)
			.force("charge", d3.forceManyBody().strength(-30))
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
			.attr('fill', 'rgb(231, 99, 89)');

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
			tooltip.style("left", (event.pageX)+10 + "px")
				.style("top", (event.pageY)-50+"px")
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
					.attr('fill', 'rgb(231, 99, 89)')
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

var introduction=function(){
	
	d3.select('#current')
		.style("overflow-y", "scroll")
		.append('h1')
		.attr('class', 'introTitle')
		.html("A deep look at the statistics behind CS:GO's best players")

	d3.select('#current')
		.append('h3')
		.attr('class', 'pallete')
		.html('Color Pallete')

	d3.select('#current')
		.append("img")
		.attr("src", "color_pallete.png")
		.style("left", '37%')
		.style("top", '60px')
		.style('position', 'relative')
		.attr("width", "500")
		.attr("height", "500");

	d3.select('#current')
		.append('p')
		.html('<br><br><br>')

	d3.select('#current')
		.append('h3')
		.attr('class', 'vizTitle')
		.html('Experience & Performance')
	d3.select('#current')
		.append('h5')
		.attr('class', 'subTitle')
		.html('What this graph represents')
	d3.select('#current')
		.append('p')
		.attr('class', 'explaination')
		.html('This scatter plot shows the possible correlation between professional experience against performance. The motivation behind this was to try and decipher if' + 
		' a player with higher experience performed better (has a higher kill to death ratio). In a sense, this visualization monitors the effectiveness of a player in ' + 
		'correspondance ot their personal experience. As a result of the data seenthrought he visualization, experience seems to have little to no correlation with a ' + 
		"player's K/D ratio, and this visualization can help team managers or player scouts identify individual talent, or most effective players. The provided tooltip allows " + 
		"users to look at the statistics of individual players, good for identifying outstanding players and acquiring their alias names")
	d3.select('#current')
		.append('h5')
		.attr('class', 'subTitle')
		.html('Color Scheme')
	d3.select('#current')
		.append('p')
		.attr('class', 'explaination')
		.html("The colors chosen in this graph were blue and yellow with grey axes to fit my 5 color color scheme. In addition, these colors were chosen so that they have minimal overlapping" + 
		" when it comes to users with color blindness. Refering to the chart above, these two colors can be seen as easily distinguishable for al types of color blindness. " + 
		"Combined with the small circular points and overlapping of circles, yellow as a default color would be hard to see in general, which is why I choose to only use yellow "+
		"in this visualization as highlighting for my tooltip.")
	d3.select('#current')
		.append('h5')
		.attr('class', 'subTitle')
		.html('Marks & Channels')
	d3.select('#current')
		.append('p')
		.attr('class', 'explaination')
		.html("Marks: Points <br> Channels: Vertical and Horizontal	positions")



	d3.select('#current')
		.append('h3')
		.attr('class', 'vizTitle')
		.html('Top Ratings')
	d3.select('#current')
		.append('h5')
		.attr('class', 'subTitle')
		.html('What this graph represents')
	d3.select('#current')
		.append('p')
		.attr('class', 'explaination')
		.html('This visualization finds the top 50 players according to their rating, provided by HLTV, which denotes their performance with respect to the average, 1 being average.' + 
		' The two sorting options allow the user to easily look at the best performing players and worst performing players out fo the top 50 best players in the world.' + 
		' In addition, the tooltip allows users to look at individual statistics down to the fine grain without guessing based on an axis. Finally, the bottom axis also denotes ' + 
		"player's alias names for ease of searching or access for users.")
	d3.select('#current')
		.append('h5')
		.attr('class', 'subTitle')
		.html('Color Scheme')
	d3.select('#current')
		.append('p')
		.attr('class', 'explaination')
		.html("Similar to the previous visualization, the colors were chosen tomatch the color scheme for my website. As the colors are the same as the last visualization" + 
		"it should be provided that any user with color blindness will have no trouble viewing the visualization. The only difference I made was switching the highlight color" + 
		" with the default color of the bars. (Default: Blue, Highlight: Yellow to Default: Yellow, Highlight: Blue) I made this decision not only to give some variance in styling " + 
		"but only because the bars were easily distinguishable from each other due to the white gaps in between. When hovering the mouse over a bar, the individual bars also light" + 
		" up pretty prominently, which made searching through individual players easier")
	d3.select('#current')
		.append('h5')
		.attr('class', 'subTitle')
		.html('Marks & Channels')
	d3.select('#current')
		.append('p')
		.attr('class', 'explaination')
		.html("Marks: Area <br> Channels: Area")



	d3.select('#current')
		.append('h3')
		.attr('class', 'vizTitle')
		.html('Stats per round')
	d3.select('#current')
		.append('h5')
		.attr('class', 'subTitle')
		.html('What this graph represents')
	d3.select('#current')
		.append('p')
		.attr('class', 'explaination')
		.html('This visualization shows the kills and assists each top player (top 50 players) gets on average per round, The higher the more impactful and better. Because each team consisted of five players, ' + 
		'the maximum amount a player could possibly achieve in terms of participation either in kills or assists would be five per round, being the most effective and impactful player. ' + 
		'In hindsight, this is very unlikely, and a player with an average of one or more kills per round would already be considered effective, carrying their own weight and perhaps more.' + 
		" However, because many in-game mechanics and play styles prevent that, we can see that even the best performing players average less than one kill per round." + 
		" This visualization can again help player scouts and managers identify the effectiveness and impact of each player on average.")
	d3.select('#current')
		.append('h5')
		.attr('class', 'subTitle')
		.html('Color Scheme')
	d3.select('#current')
		.append('p')
		.attr('class', 'explaination')
		.html("This visualization involves the use of 4 colors which all fit into the five color scheme shown above. Because of the increased number of colors seen, compensating " + 
		"for all types of color blindnes is a bit more difficult. However, I made sure to refer back to my color pallete and pick colors that would not overlap in terms of both hue and " +
		"shade. In addition, I made sure that the hover color of both assists and kills were different to make it easier for users to denote between the highlighting of each category. "+ 
		"Finally, when deciding on the default color encoding of my stacked bar chart, I chose to go with both grey and red, as they are both easily distinguishable to any user regardless of color blindness.")
	d3.select('#current')
		.append('h5')
		.attr('class', 'subTitle')
		.html('Marks & Channels')
	d3.select('#current')
		.append('p')
		.attr('class', 'explaination')
		.html("Marks: Area <br> Channels: Area, Color Hue")



	d3.select('#current')
		.append('h3')
		.attr('class', 'vizTitle')
		.html("Where they're from")
	d3.select('#current')
		.append('h5')
		.attr('class', 'subTitle')
		.html('What this graph represents')
	d3.select('#current')
		.append('p')
		.attr('class', 'explaination')
		.html("This geo visualization shows the count of all professional players with respect to their country of origin. This visualization is meant to put into perspective " + 
		"of where all the top players are originating from. The larger the circles are, the higher amount of players originate from that country. Hovering over the dots allows the user " +
		"to look into the specific number of players from that country. In addition, because many countries overlap each other, especially in the European region, the user can " + 
		"drag and zoom into the visualization to get a clear understanding of the distribution of players from a specific group of countries and better highlight them.")
	d3.select('#current')
		.append('h5')
		.attr('class', 'subTitle')
		.html('Color Scheme')
	d3.select('#current')
		.append('p')
		.attr('class', 'explaination')
		.html("Similar to the previous visualization, these colors were chosen to fit the color scheme. In this visualization, I choose to go with a grey map and red circles instead of "+ 
		"a more stereotypical green map with red circles to allow ease of use for users with red-green colorblindness. When hovering, the highlight color was chosen so that they don't seem "+
		"too similar to the default red color for all users and so that it would'nt blend into the map itself.")
	d3.select('#current')
		.append('h5')
		.attr('class', 'subTitle')
		.html('Marks & Channels')
	d3.select('#current')
		.append('p')
		.attr('class', 'explaination')
		.html("Marks: Points, Containments <br> Channels: Area, Spacial Region")



	d3.select('#current')
		.append('h3')
		.attr('class', 'vizTitle')
		.html("Player Compatability")
	d3.select('#current')
		.append('h5')
		.attr('class', 'subTitle')
		.html('What this graph represents')
	d3.select('#current')
		.append('p')
		.attr('class', 'explaination')
		.html("This force directed graph shows the compatability of each of the top 200 players in the professional CS:GO esports scene. (More would cause the website to lag alot) " +
		"Each node represents a player and each link represents the teams they have played on. Two players connected means that they have been on the same team, whether currently or previously. " +
		"When highlighting a link, the team name can be seen, and when highlighting a player, their name can be seen. In addition, when highlighting a player, their team links are also highlighted, " + 
		"helping the user visualize different players that this player might be compatable with or have played together before. Nodes without links denote players that made it into the "+
		"top 200 player list, however their teamates haven't. This information can be useful for player scouts to identify new talent that might suit well in an already well established team, " + 
		"helping those players make full use of their talent. Moreover, this visualization represents the overall influence a player has had on the CS:GO eSports scene, as a long member of the scene" + 
		"may have played on many more teams when compared to a brand new player. In order to take a more closer look, the user is allowed the option to drag and zoom around the graph to look at specific connections.")
	d3.select('#current')
		.append('h5')
		.attr('class', 'subTitle')
		.html('Color Scheme')
	d3.select('#current')
		.append('p')
		.attr('class', 'explaination')
		.html("Similar to the stacked bar chart, this visualization involves four different colors. However, the most important color choice might be the highlight of the links when a player is selected. "+ 
		"Because many links may be highlighted at the same time when a player is hovered over, these links have to stand out from any other element in the visualization to be deciphered clearly. "+ 
		"By choosing to go with light blue, any user will have no problem distinguishing between highlighted links with unhilighted nodes and links, making them stand out even more.")
	d3.select('#current')
		.append('h5')
		.attr('class', 'subTitle')
		.html('Marks & Channels')
	d3.select('#current')
		.append('p')
		
		.attr('class', 'explaination')
		.html("Marks: Points, Connections <br> Channels: Color Hue, Spacial Region")
	
	d3.select('#current')
		.append('p')
		.html('<br><br><br>')





}





// Default loading visualization
if ($("#current").is(':empty')){
	// $('#current').append('<button type="button", id="sort_button">Sort In Ascending Order</button>')
	introduction()	
}


$("#navbarSupportedContent").on("click","li .nav-link1",function(e){
	$("#current").empty()
	question1(filepath)
});

$("#navbarSupportedContent").on("click","li .nav-link2",function(e){
	
	$("#current").empty();
	$('#current').append('<button type="button", id="sort_button">Sort In Ascending Order</button>')
	question2(filepath)
	
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
$("#navbarSupportedContent").on("click","li .introduction",function(e){
	$("#current").empty();
	introduction()
});