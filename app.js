
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

          // Log the totals for debugging
          console.log("Total Traffic Accidents:", totalTrafficAccidents);
          console.log("Total Thefts:", totalThefts);

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
      console.log(accidentCountByNeighborhood);
      // Create a bar chart using Plotly
      let trace = {
        x: neighborhoods,
        y: accidentCounts,
        type: 'bar'
      };
      let layout = {
        title: `Top 10 Neighborhoods with highest # Accidents in ${year}`,
        yaxis: { title: '# of Accidents' }
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
        title: `Top 10 Neighborhoods with highest # of Thefts in ${year}`,
        yaxis: { title: '# of thefts' }
      };
      Plotly.newPlot('bar1', [trace], layout);
  });
}


function Piechart(year) {
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
        values: accidentCounts,
        labels: neighborhoods,
        type: 'pie'
      };
      let layout = {
        title: `Top 10 Neighborhoods with highest # Accidents in ${year}`,
        height: 400,
        width: 500
      };
      Plotly.newPlot('pie1', [trace], layout);
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
      Piechart(firstYear);
     //buildCharts(firstYear);
    //Update the optionChanged function to handle the selection of a new year:
    function optionChanged(newYear) {
      // Build charts and metadata panel each time a new year is selected
      calculateAndDisplaySummary(newYear);
      Theftgraph(newYear);
      Accidentgraph(newYear);
      Piechart(newYear);
      //buildCharts(newYear);
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
