import { Component } from '@angular/core';
import { MetaService } from '@nglibs/meta';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Consulta Salic';

  constructor(private metaService: MetaService) {}

}
