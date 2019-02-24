import React, { Component } from 'react';
import './App.css';
import L from 'leaflet';
import Joi from 'joi';
//import only modules needed or error.
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardTitle, CardText } from 'reactstrap';
import {Form, FormGroup, Label, Input } from 'reactstrap';
import { Button } from 'reactstrap';
import Chart from './components/Chart';



var myIcon = L.icon({
    iconUrl: 'https://purepng.com/public/uploads/large/purepng.com-harpharpstringedsoundboardfingersmodern-1421526538276nepuu.png',
    iconSize: [25, 51],
    iconAnchor: [12.5, 51],
    popupAnchor: [0, -51],
    draggable: true,
});

var myIcon1 = L.icon({
    iconUrl: 'members.png',
    iconSize: [25, 51],
    iconAnchor: [12.5, 51],
    popupAnchor: [0, -51],
    draggable: true,
});

//Joi creates the schema for validation
const schema = Joi.object().keys({
    event: Joi.string().min(1).max(100).required(),
    venue: Joi.string().min(1).max(500).required(),
    address: Joi.string().min(1).max(100).required(),
    dtstart: Joi.string().required(),
    dtend:   Joi.string().required()
});

const schema1 = Joi.object().keys({
    name:   Joi.string().min(1).max(100).required(),
    bio:   Joi.string().min(1).max(500).required(),
    latitude:    Joi.number().required(),
    longitude:   Joi.number().required()
});



//URL declaration, if hostname is localhost, request backend. otherwise URL.
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v1/Sessions' : 'production-url-here'
const API_URL1 = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v1/Members' : 'production-url-here'

class App extends Component {
  state = {
    location: {
        lat: 51.505,
        lng: -0.09,
 },
 UserslocationFound: false,
   zoom: 12,
   /* Monitors the state of the users inputs (detects changes). */
   UsersSession: {
     event: '',
     venue: '',
     address: '',
     dtstart: '',
     dtend: ''
   },
   Sessions: [],
   Members: []
 }
componentDidMount() {
  //Grabs the markers from the Thesession API to be displayed.
  fetch(API_URL)
     .then(res => res.json())
     .then(Sessions => {
       this.setState({
         Sessions
       });
     });

     fetch(API_URL1)
        .then(res => res.json())
        .then(Members => {
          this.setState({
            Members
          });
        });

  /*Asks user for location via google alert. */
  navigator.geolocation.getCurrentPosition((position) => {
    this.setState({
      location: {
        lat:  position.coords.latitude,
        lng: position.coords.longitude
      },
      UserslocationFound: true,
      zoom: 15,
      draggable: true
    });
  }, () => {
    console.log("Location not given :(");
    fetch('https://ipapi.co/json')
      .then(res => res.json())
      .then(location => {
          console.log(location);
          this.setState({
            location: {
              lat:  location.latitude,
              lng: location.longitude
            },
            UserslocationFound: true,
            zoom: 15
          });
      });
});
}

formSubmitted = (event) => {
/* prevents the page from refreshing on submit. */
  event.preventDefault();
  console.log(this.state.UsersSession);
  const UsersSession = {
    event: this.state.UsersSession.event,
    venue: this.state.UsersSession.venue,
    address: this.state.UsersSession.address,
    dtstart: this.state.UsersSession.dtstart,
    dtend: this.state.UsersSession.dtend
  };
  //importing Joi to get the result through validation of the inputs with the schema.
  const result = Joi.validate(UsersSession, schema);
  if(!result.error) {
//fetching against API_URL
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',

      },
      body: JSON.stringify({
        ...UsersSession,
        latitude: this.state.location.lat,
        longitude: this.state.location.lng,
      })
    }).then(res => res.json())
    .then(Sessions => {
      console.log(Sessions)
    });
  }
}

/*Updates the state on UsersSession */
valueChanged = (event) => {
  /*declaring event.target as it throws errors in chrome */
  const { name,value } = event.target;
  /*Sets usersSession to be the value defined in inputs */
   this.setState((prevState) => ({
     UsersSession: {
       ...prevState.UsersSession,
       [name]: value
     }
   }))
}
//Sharing of code between React components
  render() {
     const position = [this.state.location.lat, this.state.location.lng]
    return (
      <div className ="map">
      <Map className ="map" center={position} zoom={this.state.zoom}>
      /* tile imported to use over leafletjs*/
         <TileLayer
           attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
         />

         /* displays marker for when users location is given/found */
         { this.state.UserslocationFound ?

         <Marker
                position={position}
                icon={myIcon}>
         </Marker> : ''

         }
         {this.state.Sessions.map(UsersSession => (
           <Marker
                   position={[UsersSession.latitude, UsersSession.longitude]}
                   icon={myIcon} >
              <Popup>
              <em>{UsersSession.event}, </em>
                  {UsersSession.venue} {'\n'}

                  <Button color="primary" size="sm">More info</Button>
                  <Chart/>
              </Popup>
           </Marker>
         ))}

         {this.state.Members.map(Users => (
           <Marker
                   position={[Users.latitude, Users.longitude]}
                   icon={myIcon1} >
              <Popup style={{display: 'inline-block'}}>
              <em>{Users.name}, </em>
                  {Users.bio} {'\n'}

                  <Button color="primary" size="sm">More info</Button>
              </Popup>
           </Marker>
         ))}
       </Map>
       <Card body className="message-form">
        <CardTitle>Welcome to TradMap!</CardTitle>
        <CardText>Please input the details of your Session below.</CardText>
        <Form onSubmit={this.formSubmitted}>
       <FormGroup>
         <Label for="name">Session Title</Label>
         <Input
         /*when the state changes */
           onChange={this.valueChanged}
           type="text"
           name="event"
           id="event"
           placeholder="..." />

           <Label for="startDate">Start Date</Label>
           <Input
             onChange={this.valueChanged}
             type="date"
             name="dtstart"
             id="dtstart" />

          <Label for="EndDate"> End Date </Label>
             <Input
               onChange={this.valueChanged}
               type="date"
               name="dtend"
               id="dtend" />

               <Label for="venue">Session Venue</Label>
               <Input
                 onChange={this.valueChanged}
                 type="textarea"
                 name="venue"
                 id="venue"
                 placeholder="..." />

               <Label for="Address">Session Address</Label>
               <Input
                 onChange={this.valueChanged}
                 type="textarea"
                 name="address"
                 id="address"
                 placeholder="..." />
      </FormGroup>

       <Button type ="submit" color="info" disabled={!this.state.UserslocationFound}>submit</Button>
       </Form>
      </Card>
      </div>
    );
  }
}

export default App;