import React, {Component} from 'react';
import Reviews from './components/Reviews'
import Header from './components/layout/Header';
import AddReview from './components/AddReview';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css'
import axios from 'axios';
import ApprovedReviews from './components/ApprovedReviews';

class App extends Component{
    state = {
        reviews: [
            {}
        ],
        approvedReviews: [
            {}
        ]
    };

    componentDidMount() {
        this.getReviews();
        this.getAppovedReviews(); 
    }

    getReviews() {
        axios.get('http://localhost:5000/reviews')
        .then( res => {
            this.setState({
                reviews: res.data
            });
        });
    }

    getAppovedReviews() {
        axios.get('http://localhost:5000/reviews/approved')
        .then( res => {
            this.setState({
                approvedReviews: res.data
            });
            console.log(res.data)
        });
    }

    approveReview() {

    }

    disapproveReview() {

    }

    addReview = (text) => {
        let prediction;
        axios.post('http://localhost:5000/predict', {
            'review_text': text
        }).then(res => {
            console.log(res.data.prediction)
            prediction = JSON.parse(res.data.prediction.replace(/'/g, '"')).approved > 0.5 ? 1 : 0;          
            if(prediction === 1) {
                let rev = {
                    'text': text,
                    'prediction': 1,
                    'checked': 0,
                    'true_label': null,
                    '_id': res.data._id
                }
                this.setState(prevState => ({
                    approvedReviews: [...prevState.approvedReviews, rev],
                    reviews: [...prevState.reviews, rev]
                }))
            }
        });
    }

    render() {
        return (
            <Router>
                <div>
                    <div className="container">
                        <Header/>
                        <Route exact path='/admin' render={props => (
                            <React.Fragment>
                                <Reviews reviews={this.state.reviews}
                                       approveReview = {this.approveReview}
                                       disapproveReview={this.disapproveReview}/>
                            </React.Fragment>
                        )} />
                        <Route exact path='/' render={props => (
                            <React.Fragment>
                                <ApprovedReviews reviews = {this.state.approvedReviews}/>
                                <AddReview addReview={this.addReview}/>
                            </React.Fragment>
                        )}/>
                    </div>
                </div>
            </Router>
        )
    }
}

export default App;
