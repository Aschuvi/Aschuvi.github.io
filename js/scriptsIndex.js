var drawCharts=function(dataTable){
	var roleColors, barColor;
    var repartRole;
    
    var dataViewPlayTimeByRole, playTimeChart, playTimeChartOptions;
    
	roleColors = ["1565c0", "c62828", "2e7d32", "f9a825"];
	barColor = "e0e0e0";
    
	repartRole = google.visualization.data.group(dataTable, [1], [{ column:2, aggregation:google.visualization.data.sum, type:"number" }]);
    
    
	playTimeChart = new google.visualization.PieChart(document.getElementById("playtimeByRole"));
    playTimeChartOptions = { colors: roleColors, width: "100%", chartArea:{left:20, top:20, width:'90%', height:'90%'}, legend:{position:"top", alignment: 'center'}, pieSliceTextStyle: {color:"#222"}, pieSliceText:'value' };
    
	function displayCharts(){
        playTimeChart.draw(repartRole, playTimeChartOptions);
	} 
    
	displayCharts();
};

function initialization(){
    // récupération du fichier JSON
	$.getJSON("ressources/datas.json",function(d){
        console.log("test");
        // création de la DataTable pour google Chart si les données sont cohérantes
        if(d.nom.length != d.role.length || d.role.length != d.looses.length || d.role.length != d.time.length || d.looses.length != d.wins.length || d.wins.length != d.eliminations.length || d.eliminations.length != d.deaths.length || d.deaths.length != d.gold.length || d.gold.length != d.silver.length || d.silver.length != d.bronze.length) {
            $("#container").prepend("<div class='alert alert-danger' role='alert'><strong>Data file corrupted</strong></div>");
        } else {
          
            var dataTable=new google.visualization.DataTable();

            dataTable.addColumn("string","Name");
            dataTable.addColumn("string","Role");
            dataTable.addColumn("number","Play Time");
            
            var nbWins=0, nbLooses=0, nbEliminations=0, nbDeaths=0, nbMedals=0, playTime=0;
            d.nom.forEach(function(nom, i){
                nbWins += d.wins[i];
                nbLooses += d.looses[i];
                nbEliminations += d.eliminations[i];
                nbDeaths += d.deaths[i];
                nbMedals += d.gold[i] + d.silver[i] + d.bronze[i];
                playTime += d.time[i];
                
                // chargement des valeurs depuis le JSON
                dataTable.addRows([[nom, d.role[i], d.time[i]]]);
            });
            
            $("#overallWL .data-number-overall").html(nbWins + "/" + nbLooses);
            $("#overallWL .data-number-avg").html(Math.round(playTime) + "H");
            
            $("#overallE .data-number-overall").html(nbEliminations);
            $("#overallE .data-number-avg").html((nbEliminations/(nbWins+nbLooses)).toFixed(2) + " avg");
            
            $("#overallD .data-number-overall").html(nbDeaths);
            $("#overallD .data-number-avg").html((nbDeaths/(nbWins+nbLooses)).toFixed(2) + " avg");
            
            $("#overallM .data-number-overall").html(nbMedals);
            $("#overallM .data-number-avg").html((nbMedals/(nbWins+nbLooses)).toFixed(2) + " avg");
            
            
            // console.log(dataTable.getValue(0,0));
            drawCharts(dataTable);
        }
	});

};