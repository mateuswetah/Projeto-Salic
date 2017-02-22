import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { ApiService } from './../../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  inscricaoQueries: Subscription; // Usada para observar mudanças na URL
  inscricaoPesquisaPor: Subscription;
  pesquisaPor = 'projeto';

  // Queries para a busca
  queries: { [query: string]: String; } = {};
  possibleQueries = [ 'limit', 'offset', 'PRONAC', 'proponente', 'cgccpf',
                      'nome', 'area', 'segmento', 'UF', 'ano_projeto', 'sort',
                      'data_inicio', 'data_inicio_min', 'data_inicio_max',
                      'data_termino', 'data_termino_min', 'data_termino_max' ];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiService: ApiService) {
              }

  ngOnInit() {
    this.inscricaoPesquisaPor = this.route.params.subscribe (
      (params: any) => {
        this.pesquisaPor = params['pesquisaPor'];
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
        this.atualizaStringDeQueries(queryParams);
      }
    );

  }

  ngOnDestroy() {
    this.inscricaoPesquisaPor.unsubscribe();
    this.inscricaoQueries.unsubscribe();
  }

  onUpdateQuery() {
    this.queries['UF'] = 'SP';
    this.router.navigate([''], { queryParams: {'UF': this.queries['UF']}});
  }

  atualizaStringDeQueries(queryParams: any) {

    for (const query of this.possibleQueries) {
      if (queryParams[query]) {
        this.queries[query] = queryParams[query];
      }
    }

  }

}
