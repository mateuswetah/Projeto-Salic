import { Component } from '@angular/core';
import { MetaService } from '@nglibs/meta';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Consulta Salic';

  public isCollapsed: Boolean = true;

  constructor(private metaService: MetaService) {}

  public collapsed(event: any): void {
    // console.log(event);
  }

  public expanded(event: any): void {
    // console.log(event);
  }

}
