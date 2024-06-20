import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavBarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, NavBarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'iot-system-app';
}