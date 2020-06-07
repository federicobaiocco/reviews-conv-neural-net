import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';

class ApprovedReviews extends Component{

    reviewsList() {
        return this.props.reviews.map( (review) => (
            <Card key={review._id} style={{'flex': 12, 'padding':10, 'marginTop': '10px', 'marginBottom': '10px'}}>
                {review.text}
            </Card>
        ));
    }

    render() {
        return (this.reviewsList())
    }
}

ApprovedReviews.propTypes = {
    reviews: PropTypes.array.isRequired
};

export default ApprovedReviews;
