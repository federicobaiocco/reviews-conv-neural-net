import React, {Component} from 'react';
import ReviewItem from './ReviewItem';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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
            <TableContainer style={{margin: '20px auto', maxHeight: 400, overflowY: 'scroll'}} component={Paper}>
                <Table aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell style={{width: '25%'}} align="center">Text</TableCell>
                            <TableCell style={{width: '15%'}} align="center">Prediction</TableCell>
                            <TableCell style={{width: '20%'}} align="center">Mark as approved</TableCell>
                            <TableCell style={{width: '20%'}} align="center">Mark as disapproved</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.reviewsList()}
                        </TableBody>
                </Table>
            </TableContainer>
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
