const express = require("express");
const app = express();
const userRoutes = require('./routes/users.js');


app.use(express.json());

app.use('/user', userRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.json({ error: err });
});


app.listen(process.env.APP_PORT, (err) => {
  if (err) return console.error(err);
  console.log("listening on server");
});
