import React from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';
import './App.css';


const particlesOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 250
      }
    }
  }
}

const initState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
    avatar: ''
  }
}

// in production environment has to have variable API_URL set to backendAPI URL
const host =  process.env.API_URL || 'http://localhost:3000';

class App extends React.Component {
  constructor() {
    super();
    this.state = initState;
  }

  componentDidMount() {
    const token = window.localStorage.getItem('token');
    if (token) {
      fetch(`${host}/signin`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
        .then(response => response.json())
        .then(data => {
          if(data && data.id) {
            fetch(`${host}/profile/${data.id}`, {
              method: 'get',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token
              }
            })
              .then(response => response.json())
              .then(user => {
                if (user && user.email) {
                  this.loadUser(user);
                  this.onRouteChange('home');
                }
              })
              .catch(console.log);
          }
        })
        .catch(console.log)
    }
  }

  loadUser = (data) => {
    this.setState({
      isSignedIn: true,
      user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
      avatar: data.avatar
    }})
  }

  calculateFaceLocations = (data) => {
    return data.outputs[0].data.regions.map(face => {
      const clarifaiFace = face.region_info.bounding_box;
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    });    
  }

  displayFaceBoxes = (boxes) => {
    this.setState({boxes: boxes})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch(`${host}/imageUrl`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.localStorage.getItem('token')
        },
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => {
        if (response.status === 401) {
          this.onRouteChange('signout');
          return Promise.reject('Unauthorized');
        }
        return response.json()
      })
      .then(response => {
        if (response) {
          fetch(`${host}/image`, {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': window.localStorage.getItem('token')
            },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, {entries: count}))
            })
            .catch(console.log)
        }
        this.displayFaceBoxes(this.calculateFaceLocations(response))
      })
      .catch(console.log)
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      if (window.localStorage.getItem('token')) {
        fetch(`${host}/signout`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': window.localStorage.getItem('token')
          }
        })
        .then(response => {
          if (response.status === 400) {
            return Promise.reject(response.json());
          }
          return response.json()
        })
        .then(response => {
          if(response) {
            return console.log(`Successfuly deleted token with id - ${response}`);
          }
        })
        .catch(console.log)
        window.localStorage.removeItem('token');  
      }
      return this.setState(initState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  toggleModal = () => {
    this.setState(prev => ({
      ...prev,
      isProfileOpen: !prev.isProfileOpen
    }))
  }

  render() {
    const { isSignedIn, imageUrl, route, boxes, user, isProfileOpen } = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions} />
        <Navigation avatar={user.avatar} isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} toggleModal={this.toggleModal} />
        {isProfileOpen ? 
          <Modal>
            <Profile 
              loadUser={this.loadUser}
              toggleModal={this.toggleModal}
              user={user}
              host={host}
            />
          </Modal>
          : null
        }
        { route === 'home'
          ? <div>
              <Logo />
              <Rank name={user.name} entries={user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit} 
              />
              <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            </div>
           : (
             route === 'register' 
             ? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} host={host}/> 
             : <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} host={host}/>
             ) 
        }
        </div>
    )
  }
}

export default App;
