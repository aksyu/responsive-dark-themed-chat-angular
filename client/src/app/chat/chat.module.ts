import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../shared/material/material.module';

import { SocketService } from './shared/services/socket.service';
import { ChatComponent } from './chat.component';
import { DialogWelcomeComponent } from './dialog-welcome/dialog-welcome.component';
import { ModeSwitcherComponent } from './mode-switcher/mode-switcher.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
  ],
  declarations: [ChatComponent, DialogWelcomeComponent, ModeSwitcherComponent],
  providers: [SocketService],
  entryComponents: [DialogWelcomeComponent],
})
export class ChatModule { }
