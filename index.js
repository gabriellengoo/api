const PORT = 5000;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cherrio = require('cheerio');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const fetch = require('cross-fetch');

const app = express();

async function valueScraper() {
	const url = process.env.SCRAPE_URL;

	const response = await fetch(
		'https://itameri.fi/en-US/The_Baltic_Sea_now/Water_quality/Amount_of_algae',
	);
	// console.log('response', response);
	const body = await response.text();
	console.log('body', body);

	let $ = cherrio.load(body);

	let title = $('title');
	console.log('server running...', title.text());

	// const get_list_url = `https://${process.env.GET_P_ID}`;
	// const config = {
	//     method: 'get',
	//     responseType: "json",
	//     responseEncoding: "utf8",
	//     headers: {
	//         Accept: "application/json",
	//         charset: "utf-8"
	//     },
	//     baseURL: get_list_url
	// }

	const get_parse_value_url = `https://wwwi.ymparisto.fi/MeriPortaaliVedenlaatugraafit/VESLA_CP_viimeisin_6947.csv`;

	const data_list = await axios(get_parse_value_url);
	const parse_data_arr = data_list.data.split('\n')[1].slice(0, -1).split(',');
	return parse_data_arr;
}

app.use(cors());

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept',
	);
	next();
});

// app.listen(PORT, () => console.log(`server running on port ${PORT}`));
app.listen(process.env.PORT || 5000);

app.get('/api/scrap', async (req, res) => {
	try {
		console.log('test');
		const rtnData = await valueScraper();
		return res.status(200).json({
			data: rtnData,
		});
	} catch (err) {
		return res.status(500).json({
			err: err.toString(),
		});
	}
});

app.get('/', async (req, res) => {
	return res.status(200).json('working');
});
