module.exports = Concat

var Stream = require('stream').Stream
var PS = require('pause-stream')

function Concat(cb) {
  Stream.call(this)
  this.cb = cb
  this.started = false
  this.writable = true
  this.readable = true
  this.streams = []
}

Concat.prototype = new Stream

Concat.prototype.write = function(buf) {
  this.emit('data', buf)
}

Concat.prototype.end = function(buf) {
  if (buf) this.write(buf)
  this.started = false
  this.writable = false
  this.emit('end')
  this.cb && this.cb()
}

Concat.prototype.destroy = function() {
  this.writable = false
}

Concat.prototype.addStream = function(s) {
  var ps = PS()
  s.pipe(ps.pause())
  this.streams.push(ps)
  if (!this.started) this.next()
  this.started = true
}

Concat.prototype.next = function() {
  if (!this.streams.length) return this.end()
  var s = this.streams.shift()
  var self = this
  s.pipe(this,{end:false})
  s.on('end',function(){self.next()})
  s.resume()
}
