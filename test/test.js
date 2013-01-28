var assert = require('assert')
var Concat = require('../index')
var fs = require('fs')

var pathA = __dirname+'/a.txt'
var pathB = __dirname+'/b.txt'
var pathAB = __dirname+'/ab.txt'

var a1 = fs.createReadStream(pathA)
var a2 = fs.createReadStream(pathA)
var b1 = fs.createReadStream(pathB)
var b2 = fs.createReadStream(pathB)
var ab = fs.createWriteStream(pathAB)
              
var concat = new Concat
concat.pipe(ab)
concat.addStream(a1)
concat.addStream(b1)
concat.addStream(b2)    
concat.addStream(a2)
                         
concat.once('end',function(){
  var a = fs.readFileSync(pathA)
  var b = fs.readFileSync(pathB)
  var ab = fs.readFileSync(pathAB)
  assert.equal(a+b+b+a,ab)
  console.log(ab+'')
  fs.unlinkSync(pathAB)
})
