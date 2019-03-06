import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';

class Chart extends Component {


  constructor(props){
    super(props);
    this.state= {
      poptunes : [],

      chartData:{
        labels: ['Jigs', 'Reels', 'Sean Nos', 'Hornpipe', 'N/A', 'Techno'],
      datasets:[
        {
          label:'Music Types',
          data:[
            617594,
            181045,
            153060,
            106519,
            105162,
            95072
          ],
          backgroundColor:[
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ]
        }
      ]
    }
 }
}

componentDidMount() {

  fetch('https://thesession.org/tunes/popular?format=json&perpage=50')
  .then(res => res.json())
  .then(tunes => {
    console.log(tunes);
    this.setState({
      poptunes: tunes.tunes
    });
  });
}

  render(){
    return (
      <div className="chart">
      <Bar
        data={this.state.chartData}
        options={{
          maintainAspectRatio: false
        }}
     />

      </div>
    )
  }
}

export default Chart;
