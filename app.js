function calculateAndDisplaySummary(selectedYear) {
  // Initialize objects to store counts for each category
  let trafficCounts = {};
  let theftCounts = {};

  // Function to count records by year for traffic accidents
  function countTrafficAccidentsByYear(data) {
    data.forEach(record => {
      let year = record.YEAR;
      if (year in trafficCounts) {
        trafficCounts[year] += 1;
      } else {
        trafficCounts[year] = 1;
      }
    });
  }

  // Function to count records by year for thefts
  function countTheftsByYear(data) {
    data.forEach(record => {
      let year = record.YEAR;
      if (year in theftCounts) {
        theftCounts[year] += 1;
      } else {
        theftCounts[year] = 1;
      }
    });
  }

  // Load traffic accidents data
  d3.json('Resources/traffic_accidents_data.json')
    .then(trafficData => {
      // Count records for traffic accidents by year
      countTrafficAccidentsByYear(trafficData);

      // Load theft data
      d3.json('Resources/theft_data.json')
        .then(theftData => {
          // Count records for thefts by year
          countTheftsByYear(theftData);

          // Initialize totals
          let totalTrafficAccidents = 0;
          let totalThefts = 0;

          // If a specific year is selected, calculate totals for that year
          if (selectedYear) {
            totalTrafficAccidents = trafficCounts[selectedYear] || 0;
            totalThefts = theftCounts[selectedYear] || 0;
          } 
        

          // Select the panel to display the combined summary
          let panel = d3.select("#summary-panel");

          // Clear any existing content
          panel.html("");

          // Append summary for total traffic accidents
          panel.append("p").text(`Total Traffic Accidents: ${totalTrafficAccidents}`);
          
          // Append summary for total thefts
          panel.append("p").text(`Total Thefts: ${totalThefts}`);

         

        }).
        catch(error => {
          console.error('Error loading theft_data.json:', error);
          // Display an error message in the panel
           d3.select("#summary-panel").html("<p>Error loading data.</p>");
         });

    })

}

function Accidentgraph(year) {
  d3.json('Resources/traffic_accidents_data.json').then((data) => {
      // Convert year to number
      year = +year;
      // Filter the data for the specified year
      let dataForYear = data.filter(d => d.YEAR === year);
      // Group the data by neighborhood and count the occurrences
      let accidentCountByNeighborhood = d3.rollup(
        dataForYear,
        v => v.length,
        d => d.NEIGHBOURHOOD_158
      );
      // Sort the neighborhoods by accident count in descending order and get the top 10
      let topNeighborhoods = Array.from(accidentCountByNeighborhood)

        .sort((a, b) => b[1] - a[1]) // Sort in descending order by count
        .slice(0, 10); // Get the top 10 neighborhoods
      // Extract the neighborhood names and counts for the chart
      let neighborhoods = topNeighborhoods.map(d => d[0]);
      let accidentCounts = topNeighborhoods.map(d => d[1]);
      

      // Create a bar chart using Plotly
      let trace = {
        x: neighborhoods,
        y: accidentCounts ,
        type: 'bar'
      };
      let layout = {
        //width: 500,  
        height: 500,
        title: `Top 10 Neighborhoods with highest # Accidents in ${year}`,
        yaxis: { title: '# of Accidents', tickfont: {size:10}},
        xaxis: {tickfont:{size: 10}, tickangle: 90}
      };
      Plotly.newPlot('bar2', [trace], layout);
  });
}
function Theftgraph(year) {
  d3.json('Resources/theft_data.json').then((data) => {
      // Convert year to number
      year = +year;
      // Filter the data for the specified year
      let dataForYear = data.filter(d => d.YEAR === year);
      // Group the data by neighborhood and count the occurrences
      let theftCountByNeighborhood = d3.rollup(
        dataForYear,
        v => v.length,
        d => d.NEIGHBOURHOOD_158
      );
      // Sort the neighborhoods by theft count in descending order and get the top 10
      let topNeighborhoods = Array.from(theftCountByNeighborhood)
        .sort((a, b) => b[1] - a[1]) // Sort in descending order by count
        .slice(0, 10); // Get the top 10 neighborhoods
      // Extract the neighborhood names and counts for the chart
      let neighborhoods = topNeighborhoods.map(d => d[0]);
      let theftCounts = topNeighborhoods.map(d => d[1]);
      // Create a bar chart using Plotly
      let trace = {
        x: neighborhoods,
        y: theftCounts,
        type: 'bar'
      };
      let layout = {
        //width: 500,  // Adjust width as needed
        //height: 300,
        margin: { t: 200, l: 50, r: 50,},
        title: `Top 10 Neighborhoods with highest # of Thefts in ${year}`,
        yaxis: { title: '# of thefts' }
      };
      Plotly.newPlot('bar1', [trace], layout);
  });
}

// Function to run on page load
function init() {
      // Create an array of years from 2018 to 2023
      let years = Array.from({length: 6}, (_, index) => 2018 + index);
    
      // Select the dropdown element
      let dropdown = d3.select("#selDataset");
    
      // Populate the dropdown with the years
      years.forEach(year => {
        dropdown.append("option")
          .text(year)
          .attr("value", year);
      });
    
      // Get the first year (2018) from the list
      let firstYear = years[0];
    
      // Build charts and metadata panel with the first year
      calculateAndDisplaySummary(firstYear);
      Theftgraph(firstYear);
      Accidentgraph(firstYear);
      googleChart(firstYear);
      plotlyScatter(firstYear);
      leafletmap(firstYear);


     
    //Update the optionChanged function to handle the selection of a new year:
    function optionChanged(newYear) {
      // Build charts and metadata panel each time a new year is selected
      calculateAndDisplaySummary(newYear);
      Theftgraph(newYear);
      Accidentgraph(newYear);
      googleChart(newYear);
      plotlyScatter(newYear);
      leafletmap(newYear);
      
    }
    //Update the event listener to call the optionChanged function when a new year is selected:
    d3.select("#selDataset").on("change", function() {
      // Get the selected year value from the dropdown
      let newYear = d3.select(this).property("value");
      optionChanged(newYear);
    });

}

// Initialize the dashboard
init();


function googleChart(year) {
// Building google interactive pie chart
// Load the Visualization API and the controls package.
  // Packages for all the other charts you need will be loaded
  // automatically by the system.
  google.charts.load('current', {'packages':['corechart', 'controls']});

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawDashboard);

  function drawDashboard() {
    let dashboard = new google.visualization.Dashboard(document.getElementById('dashboard_div'));
 

    d3.json('Resources/traffic_accidents_data.json').then((data) => {
      // Convert year to number
      year = +year; 
  
      // Filter the data for the specified year
      let dataForYear = data.filter(d => d.YEAR === year);
  
      // Group the data by road conditions and count the occurrences
      let rdCond = d3.rollup(
        dataForYear,
        v => v.length,
        d => d.RDSFCOND
      );

      // Transform data into an array
      let rdCondData = Array.from(rdCond);
      
      // Confirming there are null values
      // console.log(rdCondData);
      
      // Rename null values to "unspecified"
      for (data of rdCondData){
           if (data[0] === null) {data[0] = "Unspecified"};
      }

      // Creating a google DataTable object
      let rdCondtable = new google.visualization.DataTable();

       rdCondtable.addColumn('string', 'Road Condition');
       rdCondtable.addColumn('number', 'Number of Accidents');
       rdCondtable.addRows(rdCondData);
      

     // Create a range slider, passing some options
     let accidentRangeSlider = new google.visualization.ControlWrapper({
      'controlType': 'NumberRangeFilter',
      'containerId': 'filter_div',
      'options': {
        'filterColumnLabel': 'Number of Accidents'
      }
    });

   
    // Create a pie chart, passing some options
    let accPieChart = new google.visualization.ChartWrapper({
      'chartType': 'PieChart',
      'containerId': 'chart_div',
      'options': {
        'width': 500,
        'height': 500,
        'pieSliceText': 'label',
        'title': "Car Accidents by road conditions"
      },
      // The pie chart will use the columns 'Road Condition' and 'Number of Accidents'
      // out of all the available ones.
      'view': {'columns': [0, 1]}
    });

    
      // 'pieChart' will update whenever you interact with 'AccidentRangeSlider'
      // to match the selected range.
      dashboard.bind(accidentRangeSlider,  accPieChart);
      dashboard.draw(rdCondtable);


      changeRange = function() {
        accidentRangeSlider.setState({'lowValue': 0, 'highValue': 100});
        accidentRangeSlider.draw();
      };

      changeOptions = function() {
        accPieChart.setOption('is3D', true);
        accPieChart.draw();
      };



  })
}};

function plotlyScatter(year) {
  d3.json('Resources/theft_data.json').then((data) => {
    // Convert year to number
    year = +year;
    // Filter the data for the specified year
    let dataForYear = data.filter(d => d.YEAR === year);
    // Group the data by neighborhood and count the occurrences
    let theftReportByMonth = d3.rollup(
      dataForYear,
      v => v.length,
      d => d.REPORT_MONTH

    );

    console.log(dataForYear);

    // Sort the neighborhoods by accident count in descending order and get the top 10
    let monthlyReport = Array.from(theftReportByMonth );
      // .sort((a, b) => b[1] - a[1]) 
      // .slice(0, 10);

    // Extract the months and counts for the chart
    let months = monthlyReport.map(d => d[0]);
    let accidentCounts = monthlyReport.map(d => d[1]);

    console.log(months);
    console.log(accidentCounts);

    // Create a scatter plot using Plotly
    let trace = {
      x: months,
      y: accidentCounts,
      mode: 'markers',
      type: 'scatter',
      marker: { size: 12 }
    };

    layout = {
          title: `Car thefts reported each month for ${year}`
    };

    Plotly.newPlot('scatter', [trace], layout);
});
}

let myMap = L.map("map", {
  center: [43.75107, -79.847015],
  zoom: 10.5
});
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


function leafletmap(year) {
  // Get the data with D3
  d3.json('Resources/traffic_accidents_data.json').then(function(response) {
      // Convert year to number
      year = +year;
      // Filter the data for the specified year and fatal injuries
      let dataForYearFatal = response.filter(d => d.YEAR === year && d.ACCLASS === "Fatal");
      // Clear existing markers from the map
      myMap.eachLayer(function (layer) {
          if (layer instanceof L.Marker) {
              myMap.removeLayer(layer);
          }
      });
      // Add markers to the map based on latitude and longitude for the specified year and fatal injuries
      dataForYearFatal.forEach(data => {
          const marker = L.marker([data.LATITUDE, data.LONGITUDE]).addTo(myMap);
          // You can customize the marker icon, popup, etc. here
          marker.bindPopup(`<b>${data.STREET1}</b><br>${data.DISTRICT}<br>${data.ACCLASS}`);
      });
  });
}
   

    

   
  
    
    

    


   

  
    















