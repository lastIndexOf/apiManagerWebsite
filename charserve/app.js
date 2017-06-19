const
  socketIo =  require('socket.io'),
  http     =  require('http'),
  express  =  require('express'),
  mysql    =  require('mysql'),
  moment   =  require('moment')

const config = require('./config.js')

const server = http.createServer(express())
const connection = mysql.createConnection(config.db.mysql)

const query = sql => new Promise((resolve, reject) => {
  connection.query(sql, (err, result) => {
    if (err)
      reject(err)
    else {
      resolve(result)
    }
  })
})

connection.connect(err => {
  if (err)
    console.error(err)
  else {
    console.log('connect to mysql success...')
  }
})

io = socketIo(server)

io.on('connection', socket => {
  console.log('someone connected...')
  let _id
  let groups = []
  socket.on('signin', (id, lastTime) => {
    _id = id
    query(`SELECT groupid FROM group_user WHERE userid=${ _id }`)
      .then(result => {
        for (let group of result) {
          groups.push({ id: group.groupid })
        }

        let lists = []
        for (let group of groups) {
          lists.push(query(`SELECT COUNT(*) FROM group_chat WHERE time>='${ lastTime }' AND group_id=${ group.id }`))
        }

        return Promise.all(lists)
      })
      .then(datas => {
        for (let [ i, group ] of groups.entries()) {
          group.sum = datas[i][0]['COUNT(*)']
        }

        io.emit('accept-sum', groups)
      })
      .catch(err => {
        console.error(err.message)
      })
    // query(`SELECT logouttime FROM user WHERE id=${ _id }`)
    //   .then(result => {
    //     console.log(result[0].logouttime)
    //   })
    //   .catch(err => {
    //     io.emit('error', err.message)
    //   })

  })

  socket.on('disconnect', (reason) => {
    const data = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')

    query(`UPDATE user SET logouttime='${ data }' WHERE id=${ _id }`)
      .then(result => {})
      .catch(err => {
        console.error(err)
      })
  })
})

server.listen(4040, () => {
  console.log('server runing at localhost:4040')
})
