
const mongoose = require('mongoose');

const ConstituencySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  mla: {
    name: String,
    party: String,
    contact: String,
    email: String
  },
  departmentHeads: [
    {
      department: String,
      hodName: String,
      hodEmail: String
    }
  ]
});

module.exports = mongoose.model('Constituency', ConstituencySchema);
