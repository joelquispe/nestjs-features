// src/push-to-talk.gateway.ts
import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class PushToTalkGateway implements OnGatewayConnection,
  OnGatewayDisconnect,
  OnModuleInit,
  OnGatewayInit {
  afterInit(server: any) {
    console.log('WebSocket Gateway Inicializado');
  }
  onModuleInit() {
    console.log('hola');
  }
  @WebSocketServer()
  server: Server;

  // Almacena las conexiones de los usuarios
  private users: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
    this.users.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
    this.users.delete(client.id);
  }

  @SubscribeMessage('pushToTalk')
  handlePushToTalk(@MessageBody() data: { senderId: string; audioData: string }) {
    // Reenviar el audio a todos los clientes excepto al remitente
    console.log(data);
    const { senderId, audioData } = data;

    // Decodificar el audio base64
    const audioBuffer = Buffer.from(audioData, 'base64');

    // Guardar el archivo de audio en el servidor (opcional)
    // const filePath = `./uploads/${senderId}_audio.aac`;
    // require('fs').writeFileSync(filePath, audioBuffer);
    this.server.emit('receiveAudio', data);
  }
}