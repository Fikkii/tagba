const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('conected to database successfully'))
  .catch(err => console.log('Unable to connect to database', err))
