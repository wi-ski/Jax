const {curry} = require('ramda');
const {Observable,Observer} = require('rx');
const EventEmitter = require('events');
const NRP    = require('node-redis-pubsub');
const theNRP = new NRP();

const creatObservable = Observable.create.bind(Observable);
const recordNewMessage = curry((redis,conversationId,message) => {
	redis.lpush(conversationId,message);
	return new Promise((rej,res)=>{
		redis.lrange(conversationId,0,10,(err,resp)=>{
			if(err)
				return rej(err);
			return res(resp);
		})
	})	
});

const notifyConversationUpdate = curry((nrp,conversationId,conversation) => { //Todo: Just send message vs last n messages.
	nrp.emit(conversationId,'NEW_ROOM_MESSAGE',conversation)
})

const emitConversationUpdate = curry((io,conversationId,conversation) =>  { //Todo: Just send message vs last n messages.
	io.to(conversationId).emit('NEW_ROOM_MESSAGE',conversation);
})

module.exports = function(io,mongoose,nrp){
	io.on('connection', socket => {
		
		Observable.fromEvent(socket, 'NEW_CHAT_MESSAGE')
				  // .throttle()
				  .map(m => m)
				  .flatMap(recordNewMessage)
				  .subscribe(notifyConversationUpdate)



		Observable.fromEvent(theNRP, 'NEW_ROOM_MESSAGE')
				  // .throttle()
				  // .map()
				  .subscribe(emitConversationUpdate)
	}


}


function bullpenBuild(socket,
					 bullpenRoom,
					 lobbyRoom,
					 teamRoom
					 ){





};






