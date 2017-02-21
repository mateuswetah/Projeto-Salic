import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,OnDestroy {

  PRONAC: Number = 1;
  queryUF: String = 'GO';
  inscricao: Subscription; // Usada para observar mudanças na URL

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.inscricao = this.route.queryParams.subscribe (
      (queryParams: any) => {
        this.queryUF = queryParams['UF'];
      }
    );

  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

}
