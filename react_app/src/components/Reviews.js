import React, {Component} from 'react';
import ReviewItem from './ReviewItem';
import PropTypes from 'prop-types';

class Reviews extends Component{

    reviewsList() {
        return this.props.reviews.map( (review) => (
              
            <ReviewItem key = {review._id}
                        review = {review}
                        approveReview = { this.props.approveReview }
                        disapproveReview = {this.props.disapproveReview}/>
        ));
    }

    render() {
        return (
            <table style={{margin: '20px auto'}}>
                <thead>
                    <tr>
                        <th style={{width: '35%', textAlign : 'center'}}>Text</th>
                        <th style={{width: '15%', textAlign : 'center'}}>Prediction</th>
                        <th style={{width: '15%', textAlign : 'center'}}>Confirm</th>
                        <th style={{width: '15%', textAlign : 'center'}}>Deny</th>
                    </tr>
                </thead>
                <tbody>
                    {this.reviewsList()}
                </tbody>
            </table>
        )
    }
}

//PropTypes
Reviews.propTypes = {
    reviews: PropTypes.array.isRequired,
    approveReview: PropTypes.func.isRequired,
    disapproveReview: PropTypes.func.isRequired
};

export default Reviews;
