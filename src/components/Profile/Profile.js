import React from 'react';
import './Profile.css';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.user.name,
            avatar: this.props.user.avatar,
            updated: false
        }
    }

    onFormChange = event => {
        switch(event.target.name) {
            case 'user-name':
                this.setState({
                    name: event.target.value,
                    updated: true
                });
                break;
            case 'avatar':
                this.setState({
                    avatar: event.target.value,
                    updated: true
                });
                break;
            default:
                return;
        }
    }

    onProfileUpdate = (data) => {
        if((data.name || data.avatar) && this.state.updated) {
            fetch(`${this.props.host}/profile/${this.props.user.id}`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': window.localStorage.getItem('token')
                },
                body: JSON.stringify({ formInput: data })
            }).then(resp => {
                this.props.toggleModal();
                this.props.loadUser({ ...this.props.user, ...data});
                this.setState({updated: false});
            }).catch(console.log)
        } else {
            this.setState({ updated: false});
            this.props.toggleModal();
        }
    }

    render() {
        const { toggleModal, user } = this.props;
        const { name, avatar } = this.state;
        return (
            <div className='profile-modal'>
                <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
                    <main className="black-80">
                        <img
                            src={user.avatar || "http://tachyons.io/img/logo.jpg"}
                            className="br4 profile_img" alt="avatar" 
                        />
                        <h1 className='profile_username'>{this.state.name}</h1>
                        <h4>Image submitted: {user.entries}</h4>
                        <p>Member since: {new Date(user.joined).toLocaleDateString()}</p>
                        <hr/>
                        <label className='mt2 fw6' htmlFor='user-name'>Name:</label>
                        <input 
                            onChange={this.onFormChange}
                            className="pa2 ba w-100"
                            placeholder={user.name}
                            type="text" 
                            name="user-name"
                            id="name"
                        />
                        <label className='mt2 fw6' htmlFor='avatar'>Avatar:</label>
                        <input 
                            onChange={this.onFormChange}
                            className="pa2 ba w-100"
                            placeholder="Avatar URL"
                            type="text" 
                            name="avatar"
                            id="avatar"
                        />
                        <div className='mt4' style={{display: 'flex', justifyContent: 'space-evenly'}}>
                            <button 
                                className='b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20'
                                onClick={() => this.onProfileUpdate({ name, avatar })}
                            >
                                Save
                            </button>
                            <button 
                                className='b pa2 grow pointer hover-white w-40 bg-light-red b--black-20'
                                onClick={toggleModal}
                            >
                                Cancel
                            </button>    
                        </div>
                    </main>
                    <div className='modal-close' onClick={toggleModal}>&times;</div>
                </article>
            </div>
        )
    }
}

export default Profile;