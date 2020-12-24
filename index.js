const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser')
const path = require('path')
const app = express()
app.use(cookieParser())

const port = process.env.PORT || 3000

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//setup public folder
app.use(express.static('./public'));

const apiKey = 'pk_0110bd689712c480475e1ef2052060b3da';

app.get('/', (req, res) => {
    res.render('index')
});
app.get('/events', (req, res) => {
    const config = {
        method: 'get',
        url: `https://a.klaviyo.com/api/v1/metrics?api_key=${apiKey}`,
        headers: { }
    };
    
    axios(config)
    .then(function (response) {
        const events = response.data.data;
        res.render('events', {events: events})
    })
    .catch(function (error) {
        console.log(error);
    });
});

app.get('/event', (req, res) => {
    let eventId = '';
    if (req.query.event_id) {
        eventId = req.query.event_id;
    }
    let since = '';
    if (req.query.next) {
        since = `&since=${req.query.next}`;
    }
    let count = '';
    if (req.query.count) {
        count = `&count=${req.query.count}`;
    }
    let sort = '';
    if (req.query.sort) {
        sort = `&sort=${req.query.sort}`;
    }
    const config = {
        method: 'get',
        url: `https://a.klaviyo.com/api/v1/metric/${eventId}/timeline?api_key=${apiKey}${since}${count}${sort}`,
        headers: { }
    };
    
    axios(config)
    .then(function (response) {
        res.json(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
