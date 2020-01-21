import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';

import { Message, User } from './model';
import route from './api';

export class AppServer {
    public static readonly PORT:number = 3080;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
        this.app.use('/api', route);
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || AppServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect', (socket: any) => {
            let user: User;
            console.log('Connected client on port %s.', this.port);
            socket.on('message', (m: Message) => {
                user = m.from;
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });

            socket.on('disconnect', () => {
                const m: Message = {
                    from: user,
                    content: '',
                    action: 1,
                };
                this.io.emit('message', m);
                console.log('Client disconnected', user);
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}
