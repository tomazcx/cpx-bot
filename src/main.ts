import { NestFactory } from '@nestjs/core';
import { create, Whatsapp } from 'venom-bot';
import { GetMenu } from './commands/ru';
import { add } from 'date-fns';
import { GetVerasAppointment } from './commands/veras';

async function start(client:Whatsapp){
  client.onMessage((message) => {
    console.log(message)
  })

  client.sendText("5549991613639@c.us", "Teste").then(data => console.log("message sent!")).catch(err => console.log(err))
}

async function main() {
  // const getTodayMenu = new GetMenu()

  // const date = add(new Date(), {
  //   days: 2
  // })
  // const todaysMenu = await getTodayMenu.execute(date)
  // console.log(todaysMenu)

  const getVerasAppointment = new GetVerasAppointment()
  const result = await getVerasAppointment.execute('Abner')
  console.log(result)

  // create({
  //   session: 'session-name' //name of session
  // })
  // .then((client) => start(client))
  // .catch((erro) => {
  //   console.log(erro);
  // });
}
main();
