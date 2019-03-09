import React, { Component } from 'react';
import './App.css';
import L from 'leaflet';
import Joi from 'joi';
//import only modules needed or error.
import { Map, TileLayer, Marker, Popup,  MapLayer, withLeaflet  } from 'react-leaflet';
import { Card, CardTitle, CardText,Modal,ModalBody,ModalFooter,ModalHeader } from 'reactstrap';
import {Form, FormGroup, Label, Input, Dropdown } from 'reactstrap';
import * as ELG from 'esri-leaflet-geocoder';
import { Button } from 'reactstrap';
import Chart from './components/Chart';
import Search from './components/Search';
import PopupModal from './components/Modal';
import Ddown from './components/Dropdown';
import MarkerClusterGroup from './components/Cluster';


var myIcon = L.icon({
    iconUrl: 'user.png',
    iconSize: [25, 40],
    iconAnchor: [12.5, 20],
    popupAnchor: [0, -40],
    draggable: true,
});

var myIcon1 = L.icon({
    iconUrl: 'members.png',
    iconSize: [25, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

var myIcon2 = L.icon({
    iconUrl: 'sessions.png',
    iconSize: [25, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44],
});

var myIcon3 = L.icon({
    iconUrl: 'http://www.clker.com/cliparts/E/L/C/f/4/B/google-maps-icon-blank-hi.png',
    iconSize: [25, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44],
});

var myIcon4 = L.icon({
    iconUrl: 'https://img.icons8.com/doodle/48/000000/marker.png',
    iconSize: [25, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44],
});

//Joi creates the schema for validation
const schema = Joi.object().keys({
    event: Joi.string().min(1).max(100).required(),
    venue: Joi.string().min(1).max(500).required(),
    address: Joi.string().min(1).max(100).required(),
    dtstart: Joi.string().required(),
    dtend:   Joi.string().required()
});

//Not used unless for posting (Members but can be applied to others.)
const schema1 = Joi.object().keys({
    name:   Joi.string().min(1).max(100).required(),
    bio:   Joi.string().min(1).max(500).required(),
    latitude:    Joi.number().required(),
    longitude:   Joi.number().required()
});




//URL declaration, if hostname is localhost, request backend. otherwise URL.
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v1/Sessions' : 'https://api.tradmap.live/api/v1/Sessions';
//const API_URL1 = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v1/Members' : 'https://api.tradmap.live/api/v1/Members';

class App extends Component {
  state = {
    location: {
        lat: 53.1424,
        lng: -6.266155,
 },
 UserslocationFound: false,
   zoom: 6,

   /* Monitors the state of the users inputs (detects changes). */
   UsersSession: {
     event: '',
     venue: '',
     address: '',
     dtstart: '',
     dtend: ''
   },
   Sessions: [],
   Members: [],
   nearbymems: [],
   items: [],
   newSessions: [],
   newEvents: [],
   poptunes: [],

   sendingMessage: false,
   sentMessage: false
 }
componentDidMount() {
  //Grabs the markers from the Thesession API to be displayed.
  /* fetch(API_URL)
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
        });  */

/* const urls= ['https://thesession.org/members/nearby?latlon=53,-6&radius=1000&format=json&perpage=50&page=2',
'https://thesession.org/members/nearby?latlon=53,-6&radius=1000&format=json&perpage=50&page=3',
'https://thesession.org/members/nearby?latlon=53,-6&radius=1000&format=json&perpage=50&page=4' ];

Promise.all(urls.map(url =>
      fetch(url)
      .then(res => res.json())
         ))
         .then(members => {

           console.log(members);
           this.setState({
             nearbymems: members.members
           });
         }); */

     fetch('https://thesession.org/members/nearby?latlon=53,-6&radius=1000&format=json&perpage=50&page=1')
          .then(res => res.json())
          .then(members => {
            console.log(members);
            this.setState({
              nearbymems: members.members
            });
          });






               fetch('https://thesession.org/sessions/new?format=json&perpage=50')
                    .then(res => res.json())
                    .then(sessions => {
                      this.setState({
                        newSessions: sessions.sessions
                      });
                    });

                    fetch('https://thesession.org/events/new?format=json&perpage=50')
                         .then(res => res.json())
                         .then(events => {
                           this.setState({
                             newEvents: events.events
                           });
                         });

          //To be used for the activity stream of thesession.
               fetch('https://thesession.org/activity?format=json')
               .then(res => res.json())
               .then(items => {
                 this.setState({
                   items: items.items
                 });
               });

               fetch('https://thesession.org/tunes/popular?format=json&perpage=50')
               .then(res => res.json())
               .then(tunes => {
                 this.setState({
                   poptunes: tunes.tunes
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
/*  fetch('https://ipapi.co/json')
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
      }); */
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
    this.setState({
      sendingMessage: true
    })
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
      setTimeout(() => {
      this.setState({
        sendingMessage: false,
        sentMessage: true
      });
    }, 4000);
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
      <Map className ="map" center={position} zoom={this.state.zoom} maxZoom ={28}>
         <TileLayer
           attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
         />

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

                   <PopupModal initialModalState={true}/>
              </Popup>
           </Marker>
         ))}
      <MarkerClusterGroup>
      {this.state.nearbymems.map(members => (
           <Marker
                   position={[members.location.latitude, members.location.longitude]}
                   icon={myIcon1} >
              <Popup>
              <h1 className="lead">{members.name} </h1>


                   <PopupModal initialModalState={true}/>
              </Popup>
           </Marker>
         ))}
        </MarkerClusterGroup>

        <MarkerClusterGroup>
        {this.state.newSessions.map(sessions => (
             <Marker
                     position={[sessions.latitude, sessions.longitude]}
                     icon={myIcon2} >
                <Popup>

                  <em>  <p className="lead">Session lead by {sessions.member.name}</p>
                     <hr className="my-2" />
                        {sessions.venue.name}{'\n'} </em>
                     <PopupModal initialModalState={true}/>
                </Popup>
             </Marker>
           ))}
           </MarkerClusterGroup>

           <MarkerClusterGroup>
           {this.state.newEvents.map(events => (
                <Marker
                        position={[events.latitude, events.longitude]}
                        icon={myIcon4} >
                   <Popup>
                   <em><p className="lead">{events.name} </p> {'\n'}
                   {events.venue.name} {'\n'}
                   <hr className="my-2" />
                     Hosted by {events.member.name}. </em>
                     {''}

                        <PopupModal initialModalState={true} />
                   </Popup>
                </Marker>
              ))}
              </MarkerClusterGroup>



       <Search/>
       </Map>
       <Card body className="message-form">
       <CardTitle>Welcome to TradMap!</CardTitle>
        <CardText>Please input the details of your event below.</CardText>

        { !this.state.sendingMessage && !this.state.sentMessage ?
          <Form onSubmit={this.formSubmitted}>
         <FormGroup>
           <Ddown color="success"/>
           <Label for="name">Title</Label>
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

                 <Label for="venue">Venue</Label>
                 <Input
                   onChange={this.valueChanged}
                   type="textarea"
                   name="venue"
                   id="venue"
                   placeholder="..." />

                 <Label for="Address">Address</Label>
                 <Input
                   onChange={this.valueChanged}
                   type="textarea"
                   name="address"
                   id="address"
                   placeholder="..." />
        </FormGroup>

         <Button type ="submit" color="success" disabled={!this.state.UserslocationFound}>submit</Button>
         </Form>
          :
          this.state.sendingMessage || !this.state.UserslocationFound ?
         <img src="loading.gif"></img> :
       <CardText>Thanks for submitting a Session! </CardText>

        }
       </Card>
      </div>
    );
  }
}

export default App;
