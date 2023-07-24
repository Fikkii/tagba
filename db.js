const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Fikkyart:mydadaskedmetoprepare@cluster0.2iaq2am.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('conected to database successfully'))
  .catch(err => console.log('Unable to connect to database', err))
