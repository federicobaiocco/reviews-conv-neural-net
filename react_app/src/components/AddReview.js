import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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
                <TextField  id="standard-required" 
                            type="text"
                            name="text"
                            required
                            variant="filled"
                            style={{flex: '10', padding: '5px'}}
                            value={this.state.text}
                            onChange={this.onChangeInput}
                            label="Add review" />
                <Button type="submit"
                        value="Submit"
                        style={{flex: '1', padding: '3px'}} 
                        variant="contained" 
                        color="primary">
                Submit
                </Button>
            </form>
        )
    }
}
//PropTypes
AddReview.propTypes = {
    addReview: PropTypes.func.isRequired
};
export default AddReview;
