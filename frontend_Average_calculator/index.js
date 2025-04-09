const express = require('express');
const axios = require('axios');

const app = express();
const port = 9876;
const WINDOW_SIZE = 10;
let windowNumbers = [];

const apiMap = {
  p: 'http://20.244.56.144/evaluation-service/primes',
  f: 'http://20.244.56.144/evaluation-service/fibo',
  e: 'http://20.244.56.144/evaluation-service/even',
  r: 'http://20.244.56.144/evaluation-service/rand'
};

app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;

  if (!apiMap[numberid]) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  const prevState = [...windowNumbers];

  let response;
  try {
    response = await axios.get(apiMap[numberid], { timeout: 500 });
  } catch (error) {
    return res.status(200).json({
      windowPrevState: prevState,
      windowCurrState: windowNumbers,
      numbers: [],
      avg: calculateAverage(windowNumbers)
    });
  }

  const newNumbers = response.data.numbers || [];
  for (const num of newNumbers) {
    if (!windowNumbers.includes(num)) {
      if (windowNumbers.length >= WINDOW_SIZE) {
        windowNumbers.shift(); // remove oldest
      }
      windowNumbers.push(num); // add new
    }
  }

  res.status(200).json({
    windowPrevState: prevState,
    windowCurrState: windowNumbers,
    numbers: newNumbers,
    avg: calculateAverage(windowNumbers)
  });
});

function calculateAverage(arr) {
  if (arr.length === 0) return 0.0;
  const sum = arr.reduce((a, b) => a + b, 0);
  return parseFloat((sum / arr.length).toFixed(2));
}

app.listen(port, () => {
  console.log(Server running at http://localhost:${port});
});