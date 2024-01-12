import { Kafka, Producer } from "kafkajs";
import fs from 'fs'
import path from "path";
import prismaClient from "./prisma";


const kafka = new Kafka({
    brokers:["kafka-296654cb-socketio-chat-app.a.aivencloud.com:18774"],
    ssl : {
        ca : [fs.readFileSync(path.resolve("../server/src/services/ca-kafka.pem"), "utf-8")]
    },
    sasl : {
        username : "avnadmin",
        password : "AVNS_PhYl0WbBPb0HtD977cD",
        mechanism : "plain"
    }
    
})

let producer : null | Producer= null 

export async function createProducer(){

    if(producer) return producer
    
    const _producer = kafka.producer()
    await _producer.connect()
    producer = _producer
    return producer
}

export async function produceMessage(message : string) {
    const producer = await createProducer()
    producer.send({
        messages : [{key : `message-${Date.now()}`, value : message}],
        topic : "MESSAGES",
    })
    return true
}

export async function startMessageConsumer () {
    const consumer = kafka.consumer({groupId : "default"});
    await consumer.connect()
    await consumer.subscribe({topic : "MESSAGES"})
    await consumer.run({
        autoCommit : true,
        eachMessage : async ({message, pause}) => {
            console.log("New Message received to consumer" , message)
            if(!message.value) return
            try {
                await prismaClient.message.create({
                    data : {
                        text : (message.value).toString(),
                    }
                })
                
            } catch (e) {
                console.log("Something went wrong... pausing consumer for 1 minute", e)
                pause()
                setTimeout(() => {
                    console.log("resuming consumer for topic:[MESSAGES]...")
                    consumer.resume([{topic : "MESSAGES"}])
                } , 60*1000)
            }
        }
    })
}
export default kafka