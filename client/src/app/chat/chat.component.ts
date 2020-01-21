import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

import { Action } from './shared/model/action';
import { Event } from './shared/model/event';
import { Message } from './shared/model/message';
import { User } from './shared/model/user';
import { Mode } from './shared/model/mode';

import { SocketService } from './shared/services/socket.service';
import { DataService } from './shared/services/data.service';

import { DialogWelcomeComponent } from './dialog-welcome/dialog-welcome.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('chatMessagesContainer') chatMessagesContainer: ElementRef;
  subscriptions: Subscription[] = [];

  action = Action;
  mode = Mode;

  user: User = {};
  messages: Message[] = [];
  newMessage: string;
  socketConnection: any;
  currentMode: number;

  constructor(
    private dataService$: DataService,
    private socketService$: SocketService,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar,
    private viewContainerRef: ViewContainerRef,
  ) { }

  ngOnInit() {
    const modeSub = this.dataService$.mode$.subscribe(
      (mode) => {
        this.currentMode = mode;
      },
    );
    this.subscriptions.push(modeSub);

    this.openDialogWelcome();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  openDialogWelcome(): void {
    const dialogParams = {
      disableClose: true,
      viewContainerRef: this.viewContainerRef,
      data: this.user,
    };

    const dialogRef: MatDialogRef<DialogWelcomeComponent> = this.matDialog.open(DialogWelcomeComponent, dialogParams);

    dialogRef.afterClosed().subscribe((user) => {
      this.setUserModel(user);
      this.initSocketConnection();
      this.sendNotification(Action.JOINED);
    });
  }

  setUserModel(user: User) {
    this.user = user;
  }

  initSocketConnection(): void {
    this.socketService$.initSocket();

    this.socketConnection = this.socketService$.onMessage()
      .subscribe((message: Message) => {
        console.log('message', message);
        // notify
        if (message.action === Action.MESSAGE && message.from.id !== this.user.id) {
          this.snackBar.open(`New message from ${message.from.name}`, '', {
            duration: 2000,
            horizontalPosition: 'end',
          });
        }
        this.messages.push(message);
        this.scrollChatToBottom();
      });

    this.socketService$.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.socketService$.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  sendNewMessage(): void {
    // check if empty string or new line from textarea
    if (!this.newMessage || this.newMessage === '\n') {
      this.newMessage = '';
      return;
    }

    this.socketService$.send({
      from: this.user,
      content: this.newMessage,
      action: Action.MESSAGE,
    });
    this.newMessage = null;
  }

  sendNotification(action: Action): void {
    const message: Message  = {
      action,
      from: this.user,
    };
    this.socketService$.send(message);
  }

  scrollChatToBottom(): void {
    setTimeout(() => {
      try {
        this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
      } catch (err) { }
    }, 100);
  }

}
