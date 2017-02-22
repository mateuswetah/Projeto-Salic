import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { ApiService } from './../../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,OnDestroy {

  queryUF: String = 'GO';
  inscricaoQueries: Subscription; // Usada para observar mudanças na URL
  inscricaoPesquisaPor: Subscription;
  pesquisaPor = 'projeto';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiService: ApiService) {
              }

  ngOnInit() {

    this.inscricaoPesquisaPor = this.route.params.subscribe (
      (params: any) => {
        this.pesquisaPor = params['pesquisaPor'];
        console.log("PARAM: " + this.pesquisaPor);
        switch (this.pesquisaPor) {
          case 'projetos':
          break;
          case 'propostas':
          break;
          case 'proponentes':
          break;
          case 'incentivadores':
          break;
          case 'fornecedores':
          break;
          default:
            this.router.navigate(['falha', 405]);
        }
      }
    );

    this.inscricaoQueries = this.route.queryParams.subscribe (
      (queryParams: any) => {
        if (queryParams['UF']) {
          this.queryUF = queryParams['UF'];
        }
      }
    );

  }

  ngOnDestroy() {
    this.inscricaoPesquisaPor.unsubscribe();
    this.inscricaoQueries.unsubscribe();
  }

  onUpdateQuery() {
    this.queryUF = 'SP';
    this.router.navigate([''], { queryParams: {'UF': this.queryUF}});
  }

}
