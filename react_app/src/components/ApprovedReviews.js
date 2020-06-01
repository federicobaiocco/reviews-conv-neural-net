import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ApprovedReviews extends Component{

    reviewsList() {
        return this.props.reviews.map( (review) => (
            <div>
                <hr/>
                <p>
                    {review.text}
                </p>
                <hr/>
            </div>
            
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
