var graph = { data:{}};

graph.create = function(data){
	if (!data.width) data.width = 640;
	if (!data.height) data.height = 480;

	$("#"+data.name).replaceWith("<canvas id=\""+data.name+"\"class=\"graph\" style=\"width:"+data.width +"px;height:"+data.height+"px;\">Canvas are needed for graphs to work. Update your browser</canvas>");
	data.ce = $("#"+data.name)[0];
	data.c = data.ce.getContext('2d');
	data.shift = 0;
	graph.data[data.name] = data;	
	graph.update(data);
	
	$("#"+data.name).mousedown(function(e){
		data.clicking = true;
		data.lastm  = -1;
	});

	$(window).mouseup(function(){
		data.clicking = false;
		data.lastm  = -1;
	});

	$("#"+data.name).mousemove(function(e){
		if(!data.clicking) return;

		// Mouse click + moving logic here
		var rect = data.ce.getBoundingClientRect();
        var mouse = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
		
		if (data.lastm!=-1)
			data.shift -= mouse.x - data.lastm;
			
		graph.validate_shift(data);
			
		data.lastm = mouse.x;
		graph.update(data);
	});
	
	window.onkeydown = function(e){
		if ( e.keyCode == 65 ) {
			console.log("Moving left");
			graph.data["graphone"].shift = graph.data["graphone"].shift + 5;
			graph.update(graph.data["graphone"]);
		}else if ( e.keyCode == 68 ) {
					console.log("Moving right");
			graph.data["graphone"].shift = graph.data["graphone"].shift - 5;
			graph.update(graph.data["graphone"]);
		}else if ( e.keyCode == 87 ) {
			var b4 = data.xtopx;
			data.xtopx = data.xtopx * 1.2;
			data.shift = (data.shift/b4)*data.xtopx;			
			graph.update(data);
		}else if ( e.keyCode == 83 ) {
			var b4 = data.xtopx;
			data.xtopx = data.xtopx * 0.9;
			data.shift = (data.shift/b4)*data.xtopx;			
			graph.update(data);
		}
	};
};

graph.update = function(g){
	g.ce.width = g.width;
	g.ce.height = g.height;

	var rightX = (g.ce.width-g.shift)/g.xtopx;
	var leftX = (g.shift)/g.xtopx;	

	var start = -1;
	for (var i=0;i<g.data.length;i++){
		var v = g.data[i];
		if (v.x >= leftX){
			if (i-1>=0){
				start = i-1;
				break;				
			}
		}
	}
	console.log("starting at id "+start+" ("+g.data[start].x+","+g.data[start].y+")");
	var i = start;
	g.c.beginPath();
	var tmp = {
		x:(g.data[i].x*g.xtopx - g.shift + 65),
		y:((g.ce.height - 30) - (g.data[i].y*g.ytopx))
	};
	console.log("cursor at ("+tmp.x+","+tmp.y+")");
	g.c.moveTo(tmp.x,tmp.y);	
	i++;
	while(1){
		if (i>=g.data.length)
			break;
			
		var tmp = {
			x:(g.data[i].x*g.xtopx-g.shift+65),
			y:((g.ce.height - 30) - (g.data[i].y*g.ytopx))
		};
		console.log("line to ("+tmp.x+","+tmp.y+")");
			
		g.c.lineTo(tmp.x,tmp.y);
		
		if (g.data[i] > rightX){
			break;
		}		
		i++;		
	}
	g.c.strokeStyle = "black";
	g.c.stroke();
	
	// Draw Axis'
	g.c.beginPath();	
	g.c.fillStyle="#eeeeee";
	g.c.fillRect(0,0,65,g.height);
	g.c.fillRect(0,g.height-30,g.width,30);
	g.c.fill();
	
	// Title	
	g.c.fillStyle = "black";
	g.c.fillText("X-Shift: "+Math.round(g.shift)+"   -   Start: "+g.data[start].x+" - xtopx: "+g.xtopx,100,15);
	g.c.fill();

};

graph.validate_shift = function(g){
	if (g.shift > g.data[g.data.length-1].x*g.xtopx - g.width)
		g.shift = g.data[g.data.length-1].x*g.xtopx - g.width;	

	if (g.shift < 0)
		g.shift = 0;	
};