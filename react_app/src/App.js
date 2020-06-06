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
        axios.get('http://localhost:5000/reviews/pending')
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
        });
    }

    approveReview = (review) => {
        const req_data = {
            "query": {
                "_id": review._id
            },
            "payload": {
                "checked": 1,
                "true_label": 1
            }
        }
        axios.patch('http://localhost:5000/reviews', req_data)
        .then(res => {
            this.getAppovedReviews();
            this.getReviews();
        });
    }

    disapproveReview = (review) => {
        const req_data = {
            "query": {
                "_id": review._id
            },
            "payload": {
                "checked": 1,
                "true_label": 0
            }
        }
        axios.patch('http://localhost:5000/reviews', req_data)
        .then(res => {
            this.getAppovedReviews();
            this.getReviews();
        });
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
            } else if (prediction === 0 ){
                let rev = {
                    'text': text,
                    'prediction': 0,
                    'checked': 0,
                    'true_label': null,
                    '_id': res.data._id
                }
                this.setState(prevState => ({
                    approvedReviews: [...prevState.approvedReviews],
                    reviews: [...prevState.reviews, rev]
                }))
            }
        });
    }

    trainModel = () => {
        axios.post('http://localhost:5000/train_model')
        .then( res => {
            console.log(res)
        })
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
                                <div>
                                <button onClick={this.trainModel.bind(this)}>Train model</button>
                                </div>
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
