import { ChatResponse } from './../chat-response';
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ChatService } from '../chat.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-simple-chat',
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    NgClass,
  ],
  templateUrl: './simple-chat.component.html',
  styleUrl: './simple-chat.component.scss',
})
export class SimpleChatComponent {
  @ViewChild('chatHistory')
   private chatHistory!: ElementRef;

   private chatService = inject(ChatService);

  userInput = '';
  isLoading = false;

  local = false

  messages = signal([
    {
      text: 'Olá, como posso ajudar?',
      isBot: true,
    },
  ]);

  sendMessage() {
    this.trimUserMessage();
    if (this.userInput != '' && !this.isLoading) {
        console.log(this.userInput)
      this.updateMessages(this.userInput);
        console.log(this.userInput)
      // this.messages.update(messages => [...messages, {text: this.userInput, isBot: false}])
      this.isLoading = true;
      if(this.local){
        this.simulateResponse();
      }else{
        this.sendChatMessage()
      }
    }
  }

  private trimUserMessage() {
    this.userInput = this.userInput.trim();
  }

private sendChatMessage(){
    console.log(this.userInput)
   this.chatService.sendChatMessage(this.userInput).pipe(
    catchError(() => {
      this.updateMessages('Desculpe Nao foi possivel realizaar a requisicao', true)
      this.isLoading = false
      return throwError(() => new Error('Erro ocorreu ao enviar a mensagem'))
    })
   ).subscribe((response: ChatResponse)  => {
    this.updateMessages(response.message, true);
    this.isLoading = false;
    this.userInput = '';
  });
}

  private updateMessages(text: string, isBot = false) {
    this.messages.update((messages) => [
      ...messages,
      { text: text, isBot: isBot },
    ]);
    this.scrollToBottom()
  }

  private simulateResponse() {
    setTimeout(() => {
      const response = 'Legal';
      this.updateMessages(response, true);
      this.isLoading = false
    }, 2000);
  }

  private scrollToBottom(){
    try{
      this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight
    }catch(err){

    }
  }
}
