import axios from 'axios';
import { Component } from 'react';

class PushNotificationsForm extends Component {
    handleOnSubmit(e) {
        e.preventDefault();
        const options = {
            notification: {
                title: e.target.title.value || '',
                body: e.target.body.value || '',
                icon: e.target.icon.value || ''
            }
        };
        axios.post('/api/trigger-push-msg', options)
    }
    render() {
        return (
            <form className="form" onSubmit={(e) => this.handleOnSubmit(e)}>
                <div class="field">
                    <label class="label">Title</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="Title" name="title" />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Icon</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="Image" name="icon" />
                    </div>
                </div>
                <div className="field">
                    <label class="label">Body</label>
                    <div className="control">
                        <textarea className="textarea" placeholder="Enter message here..." name="body"/>
                    </div>
                </div>
                <button className="button is-primary" type="submit">Send Push Notification</button>
            </form>
        );
    }
}

export default PushNotificationsForm;
