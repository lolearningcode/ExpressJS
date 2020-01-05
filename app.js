/*jshint esversion: 6 */
const fs = require('fs');
const express = require('express');

const app = express();
//middleware modifies incoming json data
app.use(express.json());

// app.get('/', (req, res) => {
//     res
//         .status(200)
//         .json({message: 'Hello from the server side!', app: 'Natours'});
// });

// app.post('/', (req, res) => {
//     res.send('You can post to this endpoint...');
// });

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
});
//?'s makes things optionals like in swift
app.get('/api/v1/tours/:id', (req, res) => {
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
});

//req holds all of the data
app.post('/api/v1/tours', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
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
    })
});

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});