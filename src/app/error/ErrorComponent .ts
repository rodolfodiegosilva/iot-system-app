import { Component } from '@angular/core';

@Component({
  selector: 'app-error',
  standalone: true,
  template: '<h2>Página não encontrada</h2>',
  styles: ['h2 { color: red; }'],
})
export class ErrorComponent {}
