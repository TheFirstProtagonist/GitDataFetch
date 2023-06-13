const express = require('express');
const app = express();
const port = 3000;

const userRoutes = require('./routes/userRoutes');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/', userRoutes);

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});