import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class WebsocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (data) => {
      console.log(data.id);
    });
  }
  handleDisconnect(client: any) {
    client.emit('disconnectss');
  }
  handleConnection(client: any, ...args: any[]) {
    client.emit('connected');
  }
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): string {
    this.server.emit('messageServer', 'texto desde el cliente');
    console.log(payload);
    return 'Hello world!';
  }
}
