var app = require('connect')();

app.use(require('ecstatic')({
  root: __dirname + "/build",
  baseDir: "/",
  cache: 0,
  showDir: false,
}));

app.listen(5000, () => {
  console.log('Server is listening on http://localhost:5000. Use Ctrl-c to stop.')
});
