import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class WebsocketsGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit,
    OnGatewayInit
{
  onModuleInit() {
    console.log('hola');
  }
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);

    // Enviar un mensaje a todos los clientes conectados
    this.server.emit('message', 'Bienvenido a todos los clientes!');
  }

  // Este método se llama cuando un cliente se desconecta
  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  // Este método se llama cuando el Gateway se inicializa
  afterInit() {
    console.log('WebSocket Gateway Inicializado');
  }

  // Este es un ejemplo de un mensaje personalizado (en este caso "events")
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): string {
    console.log(`Mensaje recibido: ${payload}`);

    // Enviar un mensaje al cliente específico que envió el mensaje
    client.emit('position', `Mensaje recibido: ${payload}`);
    return 'Mensaje recibido correctamente';
  }
}
