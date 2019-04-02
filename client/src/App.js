import React, { Component } from 'react';
import './App.css';
import L from 'leaflet';
import Joi from 'joi';
//import only modules needed or error.
import { Map, TileLayer, Marker, Popup,  MapLayer, withLeaflet, LayerGroup  } from 'react-leaflet';
import { Card, CardTitle, CardText,CardImg,Modal,ModalBody,ModalFooter,ModalHeader,} from 'reactstrap';
import {Form, FormGroup, Label, Input, Dropdown } from 'reactstrap';
import * as ELG from 'esri-leaflet-geocoder';
import { Button } from 'reactstrap';
import Chart from './components/Chart';
import Search from './components/Search';
import UsersModal from './components/UsersModal';
import EventModal from './components/EventModal';
import SeshModal from './components/SeshModal';
import Ddown from './components/Dropdown';
import MarkerClusterGroup from './components/Cluster';
//import LocateControl from './components/LocateControl';

const createClusterCustomIcon = function (cluster) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: 'marker-cluster-custom',
    iconSize: L.point(40, 40, true),
  });
};

const createClusterCustomIcon1 = function (cluster) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: 'marker-cluster-custom1',
    iconSize: L.point(40, 40, true),
  });
};

const createClusterCustomIcon2 = function (cluster) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: 'marker-cluster-custom2',
    iconSize: L.point(40, 40, true),
  });
};



var myIcon = L.icon({
    iconUrl: 'user.png',
    iconSize: [25, 40],
    iconAnchor: [20, 40],
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
  fetch(API_URL)
     .then(res => res.json())
     .then(Sessions => {
       this.setState({
         Sessions
       });
     });

/*
     fetch(API_URL1)
        .then(res => res.json())
        .then(Members => {
          this.setState({
            Members
          });
        });  */

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
    /*    fetch('https://thesession.org/activity?format=json')
        .then(res => res.json())
        .then(items => {
          this.setState({
            items: items.items
          });
        }); */



const urls= ['https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=1',
'https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=2',
'https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=3',
'https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=4',
'https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=5',
'https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=6',
'https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=7',
'https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=8',
'https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=9',
'https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=10',
'https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=11',
'https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=12',
'https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=13',
'https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=14',
'https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=15',
'https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=16',
'https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=17',
'https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=18',
'https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=19',
'https://thesession.org/members/nearby?latlon=53,-6&radius=8000&format=json&perpage=50&page=20' ];

/* Promise.all(urls.map(url =>
      fetch(url)
      .then(res => res.json())
         ))
         .then(members => {
           console.log(members);
           this.setState({
             nearbymems: members
           });
         });
  */
    /*  fetch('https://thesession.org/members/nearby?latlon=53,-6&radius=1000&format=json&perpage=50&page=1')
          .then(res => res.json())
          .then(members => {
            console.log(members);
            this.setState({
              nearbymems: members.members
            });
          }); */

          //threading ??

          Promise.all(
            urls.map(url =>
              fetch(url)
                .then(res => res.json())
                .then(res => res.members)
            )
          ).then(members => {
            this.setState({
              nearbymems: [].concat(...members)
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

     /* const locateOptions = {
      position: 'topright',
      strings: {
          title: 'Show me where I am, yo!'
      },
      onActivate: () => {} // callback before engine starts retrieving locations
  } */

     const position = [this.state.location.lat, this.state.location.lng]
    return (
      <div className ="map">
      <Map className ="map" center={position} zoom={this.state.zoom} maxZoom ={30}>
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

                   <EventModal initialModalState={true}/>
              </Popup>
           </Marker>
         ))}
      <MarkerClusterGroup
      iconCreateFunction={createClusterCustomIcon}
      >
      {this.state.nearbymems.map(members => (
           <Marker
                   position={[members.location.latitude, members.location.longitude]}
                   icon={myIcon1} >
              <Popup>
              <h1 className="lead">{members.name} </h1>
              <hr className="my-2" />
              <p>{members.bio} </p>
              </Popup>
           </Marker>
         ))}
        </MarkerClusterGroup>

        <MarkerClusterGroup
        iconCreateFunction={createClusterCustomIcon1}
        >
        {this.state.newSessions.map(sessions => (
             <Marker
                     position={[sessions.latitude, sessions.longitude]}
                     icon={myIcon2} >
                <Popup>

                  <em>  <p className="lead">Session lead by {sessions.member.name}</p>
                     <hr className="my-2" />
                        {sessions.venue.name}{'\n'} </em>
                     <SeshModal initialModalState={true}/>
                </Popup>
             </Marker>
           ))}
           </MarkerClusterGroup>

           <MarkerClusterGroup
            iconCreateFunction={createClusterCustomIcon2}
           >
           {this.state.newEvents.map(events => (
                <Marker
                        position={[events.latitude, events.longitude]}
                        icon={myIcon4} >
                   <Popup>
                   <em><h1 fluid className="lead">{events.name} </h1> {'\n'}
                   <p> Venue: {events.venue.name}</p> {'\n'}
                   <p fluid className="lead">Event start: {events.dtstart} </p> {'\n'}
                   <p fluid className="lead">Event end:   {events.dtend}   </p> {'\n'}
                   <hr className="my-2" />
                     Hosted by {events.member.name}. </em>
                     {''}

                        <EventModal initialModalState={true} />
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
       

        <Card body className="legend">
        <em>
        <img  height="30vw" width="20vw" src='user.png' />
        : User icon
        </em>
        <em>
        <img  height="30vw" width="20vw" src='members.png' />
         : Member icon
        </em>
        <em>
        <img  height="30vw" width="20vw" src='sessions.png' />
         : Session icon
        </em>
        <em>
        <img  height="30vw" width="20vw" src='https://img.icons8.com/doodle/48/000000/marker.png' />
         : Event icon
         </em>
        </Card>


      </div>
    );
  }
}

export default App;
