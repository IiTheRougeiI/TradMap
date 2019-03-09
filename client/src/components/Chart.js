import React, {Component} from 'react';
import {Bar,Radar} from 'react-chartjs-2';

class Chart extends Component {


  constructor(props){
    super(props);
    this.state= {
      poptunes : [],

      chartData:{
        labels: ['The Kesh', 'The Butterfly', 'Morrisons', 'Out on the Ocean', 'The Connaughtmans Rambles', 'The Blarney Pilgrim'],
      datasets:[
        {
          label:'Most Popular Jigs (Per TuneBook)',
          data:[
            4887,
            4199,
            3773,
            2674,
            2336,
            2144
          ],
          backgroundColor:[
            'rgba(255, 99, 132, 0.6)'
          ]
        }
      ]
    }
 }
}

/* componentDidMount() {

  fetch('https://thesession.org/tunes/popular?format=json&perpage=50')
  .then(res => res.json())
  .then(tunes => {
    console.log(tunes);
    this.setState({
      poptunes: tunes.tunes
    });
  });
} */

  render(){
    return (
      <div className="chart">
      <Radar
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
