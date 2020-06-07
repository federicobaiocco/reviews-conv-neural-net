import React, {Component} from 'react';
import Reviews from './components/Reviews'
import Header from './components/layout/Header';
import AddReview from './components/AddReview';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css'
import axios from 'axios';
import ApprovedReviews from './components/ApprovedReviews';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

class App extends Component{
    state = {
        reviews: [
            {}
        ],
        approvedReviews: [
            {}
        ],
        waitingPrediction: false,
        snack:
        {
            type: 'success',
            open: false,
            message: ''
        }
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
        this.setState(prevState => ({
            approvedReviews: [...prevState.approvedReviews],
            reviews: [...prevState.reviews],
            waitingPrediction: true
        }))
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
                    reviews: [...prevState.reviews, rev],
                    waitingPrediction: false
                }))
                this.handleOpen('Your comment is approved! 😎. Thanks for your feedback! 😀', 'success')
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
                    reviews: [...prevState.reviews, rev],
                    waitingPrediction: false
                }))
                this.handleOpen('We just received your comments 🙌. Our team will check it soon. Thanks! 😀', 'info')
            }
        });
    }

    trainModel = () => {
        axios.post('http://localhost:5000/train_model')
        .then( res => {
            console.log(res)
        })
    }

    handleOpen = (message, type) => this.setState( prevState => ({ 
        approvedReviews: [...prevState.approvedReviews],
        reviews: [...prevState.reviews],
        waitingPrediction: false,
        snack: {
            open: true,
            message: message,
            type: type
        }
    }))

    handleClose = () => this.setState( prevState => ({ 
        approvedReviews: [...prevState.approvedReviews],
        reviews: [...prevState.reviews],
        waitingPrediction: false,
        snack: {
            open: false,
            message: '..',
            type: 'info'
        }
    }))

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
                                <Button onClick={this.trainModel.bind(this)}
                                        variant="contained" 
                                        color="primary">
                                    Train model
                                </Button>
                                </div>
                            </React.Fragment>
                        )} />
                        <Route exact path='/' render={props => (
                            <React.Fragment>
                                <div style={{'maxHeight': 350, 'overflowY': 'scroll'}}>
                                    <ApprovedReviews reviews = {this.state.approvedReviews}/>
                                </div>
                                { 
                                this.state.waitingPrediction ? 
                                    <div style={{'textAlign': 'center', 'marginTop': 15}}>
                                        <CircularProgress />
                                        <p>
                                            We're checking your comment
                                        </p>
                                    </div> : 
                                    <AddReview addReview={this.addReview}/>
                                }
                                <div>    
                                    <Snackbar open={this.state.snack.open} autoHideDuration={6000} onClose={this.handleClose}>
                                        <Alert onClose={this.handleClose} severity={this.state.snack.type}>
                                            {this.state.snack.message}
                                        </Alert>
                                    </Snackbar>
                                </div>
                            </React.Fragment>
                        )}/>
                    </div>
                </div>
            </Router>
        )
    }
}

export default App;
