import axios from 'axios';
import { Component } from 'react';

class PushNotificationsForm extends Component {
    handleOnSubmit(e) {
        e.preventDefault();
        const options = {
            notification: {
                title: 'Example Title',
                body: e.target.pushMessage.value,
                icon: ''
            }
        };
        axios.post('/api/trigger-push-msg', options)
    }
    render() {
        return (
            <form onSubmit={(e) => this.handleOnSubmit(e)}>
                <textarea placeholder="Enter message here..." name="pushMessage"/>
                <button type="submit">Send Push Notification</button>
            </form>
        );
    }
}

export default PushNotificationsForm;
