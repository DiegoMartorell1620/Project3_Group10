// Build the metadata panel
// function buildMetadata(sample) {
//     d3.json('Resources/traffic_accidents_data.json').then((data) => {
  
//       // Filter the metadata for the object with the desired sample number
//       let resultArray = data.filter(sampleObj => sampleObj.YEAR == sample);
//       let result = resultArray[0];

//       console.log(result)
  
//       // Use d3 to select the panel with id of `#sample-metadata`
//       let panel = d3.select("#sample-metadata");
  
//       // Use `.html("") to clear any existing metadata
//       panel.html("");
  
//       // Inside a loop, you will need to use d3 to append new
//       // tags for each key-value in the filtered metadata.
//       Object.entries(result).forEach(([key, value]) => {
//         let text = `${key.toUpperCase()}: ${value}`;
//         panel.append("p").text(text);
//       });
//     });
//   }
  
//   function buildMetadata(sample) {
//   d3.json('Resources/theft_data.json').then((data) => {
  
//     // Filter the metadata for the object with the desired sample number
//     let resultArray = data.filter(sampleObj => sampleObj.YEAR == sample);
//     let result = resultArray[0];

//     console.log(result)

//     // Use d3 to select the panel with id of `#sample-metadata`
//     let panel = d3.select("#sample-metadata");

//     // Use `.html("") to clear any existing metadata
//     panel.html("");

//     // Inside a loop, you will need to use d3 to append new
//     // tags for each key-value in the filtered metadata.
//     Object.entries(result).forEach(([key, value]) => {
//       let text = `${key.toUpperCase()}: ${value}`;
//       panel.append("p").text(text);
//     });
//   });
// }

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
          } else {
            // Calculate totals for all years if no specific year is selected
            totalTrafficAccidents = Object.values(trafficCounts).reduce((a, b) => a + b, 0);
            totalThefts = Object.values(theftCounts).reduce((a, b) => a + b, 0);
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

        }).catch(error => {
          console.error('Error loading theft_data.json:', error);
          // Display an error message in the panel
          d3.select("#summary-panel").html("<p>Error loading data.</p>");
        });

    }).catch(error => {
      console.error('Error loading traffic_accidents_data.json:', error);
      // Display an error message in the panel
      d3.select("#summary-panel").html("<p>Error loading data.</p>");
    });
}
// function to build both charts
//   function buildCharts(sample) {
//     d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    //let samples = data.samples;
    // Filter the samples for the object with the desired sample number
    //let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //let result = resultArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    //let otuIds = result.otu_ids;
    //let otuLabels = result.otu_labels;
    //let sampleValues = result.sample_values;

    // Build a Bubble Chart
    //let bubbleTrace = {
    //  x: otuIds,
    // y: sampleValues,
    //  text: otuLabels,
     // mode: 'markers',
    //  marker: {
     //   size: sampleValues,
     //   color: otuIds,
//        //   colorscale: 'Earth'
//         }
//       };

//       let bubbleData = [bubbleTrace];

//       let bubbleLayout = {
//         title: 'Bacteria Cultures Per Sample',
//         xaxis: { title: 'OTU ID' }
//       };


//       // Render the Bubble Chart

//       Plotly.newPlot('bubble', bubbleData, bubbleLayout);  

//       // For the Bar Chart, map the otu_ids to a list of strings for your yticks
//       let yTicks = otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse();

//       // Build a Bar Chart
//       // Don't forget to slice and reverse the input data appropriately
//       let barTrace = {
//         x: sampleValues.slice(0, 10).reverse(),
//         y: yTicks,
//         text: otuLabels.slice(0, 10).reverse(),
//         type: 'bar',
//         orientation: 'h'
//       };
    
//       let barData = [barTrace];
    
//       let barLayout = {
//         title: 'Top 10 OTUs Found',
//         xaxis: { title: 'Number of Bacteria' }
//       };

//       // Render the Bar Chart
//       Plotly.newPlot('bar', barData, barLayout);
//    //});
//   //}

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
     //buildCharts(firstYear);
    //Update the optionChanged function to handle the selection of a new year:
    function optionChanged(newYear) {
      // Build charts and metadata panel each time a new year is selected
      calculateAndDisplaySummary(newYear);
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

