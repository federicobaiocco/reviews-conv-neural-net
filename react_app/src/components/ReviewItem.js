import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

class ReviewItem extends Component{
    getStyle = () => {
        return {
            background: 'f4f4f4',
            padding: '10px',
            borderBottom: '1px #ccc dotted'
        }
    };

    render() {
        const { prediction } = this.props.review;
        const review = this.props.review;
        return (
            <TableRow key={review._id}>
              <TableCell component="th" scope="row">
                {review.text}
              </TableCell>
              <TableCell align="center" style={{textAlign : 'center', color: prediction === 1 ? 'green': 'red'}}>{prediction === 1 ? 'APPROVED' : 'DISAPPROVED'}</TableCell>
              <TableCell align="center"><button onClick={this.props.approveReview.bind(this, review)} style={approveBtnStyle}>✓</button></TableCell>
              <TableCell align="center"><button onClick={this.props.disapproveReview.bind(this, review)} style={disapproveBtnStyle}>X</button></TableCell>
            </TableRow>
        )
    }
}

ReviewItem.propTypes = {
    approveReview: PropTypes.func.isRequired,
    disapproveReview: PropTypes.func.isRequired
};

const approveBtnStyle = {
  background: 'green',
  color: '#fff',
  border: 'none',
  padding: '5px 9px',
  borderRadius: '50%',
  cursor: 'pointer'
};

const disapproveBtnStyle = {
    background: 'red',
    color: '#fff',
    border: 'none',
    padding: '5px 9px',
    borderRadius: '50%',
    cursor: 'pointer'
  };
export default ReviewItem;
