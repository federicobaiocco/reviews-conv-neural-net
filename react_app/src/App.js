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
    api_url = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'http://localhost:5000/'
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
        },
        training_result_snack:
        {
            type: 'success',
            open: false,
            message: ''
        },
        training: false,
        training_result: null
    };

    componentDidMount() {
        this.getReviews();
        this.getAppovedReviews(); 
        console.log('API: ',this.api_url)
    }

    getReviews() {
        axios.get(this.api_url+'reviews/pending')
        .then( res => {
            this.setState({
                reviews: res.data
            });
        });
    }

    getAppovedReviews() {
        axios.get(this.api_url+'reviews/approved')
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
        axios.patch(this.api_url+'reviews', req_data)
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
        axios.patch(this.api_url+'reviews', req_data)
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
        axios.post(this.api_url+'predict', {
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
        this.setState(prevState => ({
            training: true
        }))
        axios.post(this.api_url+'train_model')
        .then( res => {
            console.log(res)
            this.setState(prevState => ({
                training: false,
                training_result: res,
                training_result_snack:
                {
                    type: 'success',
                    open: true,
                    message: 'Model ready to use ✔ accuracy: ' + res.data.score.split(',')[1].slice(0, -1)
                }
            }))
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
        },
        training_result_snack:
        {
            type: 'success',
            open: false,
            message: ''
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
                                {   
                                    this.state.training === false ?
                                    <div>
                                        <Reviews reviews={this.state.reviews}
                                        approveReview = {this.approveReview}
                                        disapproveReview={this.disapproveReview}/>
                                        
                                        <Button onClick={this.trainModel.bind(this)}
                                                variant="contained" 
                                                color="primary">
                                            Train model
                                        </Button>
                                    </div> 
                                    :
                                    <div style={{'textAlign': 'center', 'marginTop': 15}}>
                                        <CircularProgress />
                                        <p>
                                            Training model 💻🧠 ... 
                                        </p>
                                    </div>
                                }
                                <div>    
                                    <Snackbar open={this.state.training_result_snack.open} autoHideDuration={6000} onClose={this.handleClose}>
                                        <Alert onClose={this.handleClose} severity={this.state.training_result_snack.type}>
                                            {this.state.training_result_snack.message}
                                        </Alert>
                                    </Snackbar>
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
