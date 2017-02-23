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
  carregandoDados: Boolean = false;
  resposta: String = '';
  JSON: any = JSON;

  // Queries para a busca
  queries: { [query: string]: String; } = {};
  queriesDoSelecionado = [];
  queriesDeProjetos = [ 'limit', 'offset', 'PRONAC', 'proponente', 'cgccpf',
                        'nome', 'area', 'segmento', 'UF', 'ano_projeto', 'sort',
                        'data_inicio', 'data_inicio_min', 'data_inicio_max',
                        'data_termino', 'data_termino_min', 'data_termino_max' ];
  queriesDePropostas = [ 'limit', 'offset', 'nome', 'data_inicio', 'data_termino' ];
  queriesDeProponentes = [ 'limit', 'offset', 'nome', 'cgccpf', 'url_id',
                           'municipio', 'UF', 'tipo_pessoa', 'sort' ];
  queriesDeIncentivadores = [ 'limit', 'offset', 'nome', 'cgccpf', 'municipio', 
                              'UF', 'tipo_pessoa', 'PRONAC', 'sort' ];
  queriesDeFornecedores = [ 'limit', 'offset', 'nome', 'cgccpf', 'PRONAC' ];


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
            this.queriesDoSelecionado = this.queriesDeProjetos;
          break;
          case 'propostas':
            this.queriesDoSelecionado = this.queriesDePropostas;
          break;
          case 'proponentes':
            this.queriesDoSelecionado = this.queriesDeProponentes;
          break;
          case 'incentivadores':
            this.queriesDoSelecionado = this.queriesDeIncentivadores;
          break;
          case 'fornecedores':
            this.queriesDoSelecionado = this.queriesDeIncentivadores;
          break;
          default:
            this.router.navigate(['falha', 405]);
        }
      }
    );

    this.inscricaoQueries = this.route.queryParams.subscribe (
      (queryParams: any) => {
        this.atualizaQueries(queryParams);
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

  atualizaQueries(queryParams: any) {

    for (const query of this.queriesDoSelecionado) {
      if (queryParams[query]) {
        this.queries[query] = queryParams[query];
      }
    }
  }

  onTestarBusca() {
    this.carregandoDados = true;

    switch (this.pesquisaPor) {

      case 'projetos':
        this.apiService.getListaProjetos(this.queries).subscribe(
          projetos => {
            this.resposta = JSON.stringify(projetos);
          },
          err => {
            this.carregandoDados = false;
            this.router.navigate(['falha', err]);
          },
          () => this.carregandoDados = false);

      break;

      case 'propostas':
        this.apiService.getListaPropostas(this.queries).subscribe(
          propostas => {
            this.resposta = JSON.stringify(propostas);
          },
          err => {
            this.carregandoDados = false;
            this.router.navigate(['falha', err]);
          },
          () => this.carregandoDados = false);
      break;

      case 'proponentes':
        this.apiService.getListaProponentes(this.queries).subscribe(
          proponentes => {
            this.resposta = JSON.stringify(proponentes);
          },
          err => {
            this.carregandoDados = false;
            this.router.navigate(['falha', err]);
          },
          () => this.carregandoDados = false);
      break;

      case 'incentivadores':
        this.apiService.getListaIncentivadores(this.queries).subscribe(
          incentivadores => {
            this.resposta = JSON.stringify(incentivadores);
          },
          err => {
            this.carregandoDados = false;
            this.router.navigate(['falha', err]);
          },
          () => this.carregandoDados = false);
      break;

      case 'fornecedores':
        this.apiService.getListaFornecedores(this.queries).subscribe(
          fornecedores=> {
            this.resposta = JSON.stringify(fornecedores);
          },
          err => {
            this.carregandoDados = false;
            this.router.navigate(['falha', err]);
          },
          () => this.carregandoDados = false);  
      break;
      default:
        this.router.navigate(['falha', 405]);
    }
  }
}
