import { SimpleChatComponent } from './chat/simple-chat/simple-chat.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: '', redirectTo: 'simple-chat', pathMatch: 'full'},
  {
    path:'simple-chat', loadComponent: () => import('./chat/simple-chat/simple-chat.component').then(c => c.SimpleChatComponent)
  },
  {
    path: '**', redirectTo: 'simple-chat'
  }
];
