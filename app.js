/*jshint esversion: 6 */
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

//Middleware morgan for login authentication
app.use(morgan('dev'));

//middleware modifies incoming json data
app.use(express.json());

//creating own middleware
app.use((req, res, next) => {
    console.log('Hello from the middleware🚴🏿');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
//Refactoring code
const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    });
};

const getTour = (req, res) => {
    console.log(req.params);

    //this method converts strings into numbers
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    // if (id > tours.length)
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
};

const createTour = (req, res) => {
    // console.log(req.body);

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({
        id: newId
    }, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        //201 stands for create new resource
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });

    // res.send('Done');
};

const updateTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    });
};

const deleteTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
};

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};

const getUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};

// app.get('/api/v1/tours', getAllTours);

//?'s makes things optionals like in swift
//app.get('/api/v1/tours/:id', getTour);

//req holds all of the data
// app.post('/api/v1/tours', createTour);

//Patch is updating data
//app.patch('/api/v1/tours/:id', updateTour);

//Delete a tour
//app.delete('/api/v1/tours/:id', deleteTour);

//Routes
const tourRouter = express.Router();
app.use('/api/v1/tours', tourRouter);

tourRouter
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app
    .route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

app
    .route('/api/v1/users')
    .get(getAllUsers)
    .post(createUser);

app
    .route('/api/v1/users/:id')
    .get(getUsers)
    .patch(updateUser)
    .delete(deleteUser);

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});