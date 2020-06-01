import React, {Component} from 'react';
import PropTypes from 'prop-types';

class AddReview extends Component{

    state = {
        text: ''
    };

    onChangeInput = (e) => this.setState({
        [e.target.name] : e.target.value
    });

    onSubmit = (e) => {
      e.preventDefault();
      this.props.addReview(this.state.text);
      this.setState({text: ''});
    };

    render() {
        return (
            <form onSubmit={this.onSubmit} style={{display: 'flex'}}>
                <input type="text"
                       name="text"
                       style={{flex: '10', padding: '5px'}}
                       placeholder="Add Review"
                       value={this.state.text}
                       onChange={this.onChangeInput}
                />
                <input type="submit"
                       value="Submit"
                       className="btn"
                       style={{flex: '1'}}
                />
            </form>
        )
    }
}
//PropTypes
AddReview.propTypes = {
    addReview: PropTypes.func.isRequired
};
export default AddReview;
