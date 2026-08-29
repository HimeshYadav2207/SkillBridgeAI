const Datastore = require('nedb-promises')
const path = require('path')

const dir = path.join(__dirname, '../data')

module.exports = {
  users:        Datastore.create({ filename: path.join(dir, 'users.db'),        autoload: true }),
  skills:       Datastore.create({ filename: path.join(dir, 'skills.db'),       autoload: true }),
  internships:  Datastore.create({ filename: path.join(dir, 'internships.db'),  autoload: true }),
  applications: Datastore.create({ filename: path.join(dir, 'applications.db'), autoload: true }),
  assessments:  Datastore.create({ filename: path.join(dir, 'assessments.db'),  autoload: true }),
  mentors:      Datastore.create({ filename: path.join(dir, 'mentors.db'),      autoload: true }),
  feedback:     Datastore.create({ filename: path.join(dir, 'feedback.db'),     autoload: true }),
  portfolio:    Datastore.create({ filename: path.join(dir, 'portfolio.db'),   autoload: true }),
  notifications:Datastore.create({ filename: path.join(dir, 'notifications.db'), autoload: true }),
}
