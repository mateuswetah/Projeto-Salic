import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { ApiService } from './../../services/api.service';
import { ConfigurationService } from './../../services/configuration.service';
import { DataFormatterService } from './../../services/data-formatter.service';
import { PaginationService } from './../../services/pagination.service';

import { Projeto } from './../../models/projeto.model';
import { Proposta } from './../../models/proposta.model';
import { Proponente } from './../../models/proponente.model';
import { Incentivador } from './../../models/incentivador.model';
import { Fornecedor } from './../../models/fornecedor.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  inscricaoQueries: Subscription; // Usada para observar mudanças na URL
  inscricaoPesquisaPor: Subscription;

  JSON: any = JSON;

  pesquisaPor = 'projeto';
  carregandoDados: Boolean = false;
  buscaSemResultados = false;

  // Parâmetros do InifiniteScroll
  //scrollDistance = 1;
  offsetAtual = 0;

  // Respostas da API:
  listaProjetos:        [Projeto];
  listaPropostas:       [Proposta];
  listaProponentes:     [Proponente];
  listaIncentivadores:  [Incentivador];
  listaFornecedores:    [Fornecedor];

  // Paginacao
  numeroDeItems: number;
  totalDeItems: number;
  paginador: any;
  indicesPaginas = [Number];

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
              private apiService: ApiService,
              private configurationService: ConfigurationService,
              private dataFormatterService: DataFormatterService,
              private paginationService: PaginationService) {
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

  onRealizarBusca() {
    this.offsetAtual = 0;
    this.listaProjetos = undefined;
    this.listaPropostas = undefined;
    this.listaProponentes = undefined;
    this.listaIncentivadores = undefined;
    this.listaFornecedores = undefined;

    this.carregarPagina(1);
  }

  carregarPagina(indice: number) {

    console.log(indice);

    if (indice < 1 || indice > (this.totalDeItems / this.numeroDeItems) + this.numeroDeItems) {
      return;
    }

    this.carregandoDados = true;
    this.buscaSemResultados = false;
    this.offsetAtual = (indice - 1) * this.configurationService.limitResultados;

    // Adiciona queries extras
    this.queries['limit'] = '' + this.configurationService.limitResultados;
    this.queries['offset'] = '' + this.offsetAtual;

    switch (this.pesquisaPor) {

      case 'projetos':
        this.apiService.getListaProjetos(this.queries).subscribe(
          resposta => {

            this.totalDeItems = resposta.total;
            this.numeroDeItems = resposta.count;
            this.atualizaIndicesPaginas();

            this.listaProjetos = resposta.listaProjetos;

          },
          err => {
            this.carregandoDados = false;

            if (err === 404) {
              this.buscaSemResultados = true;
            } else {
              this.router.navigate(['falha', err]);
            }
          },
          () => this.carregandoDados = false);

      break;

      case 'propostas':
        this.apiService.getListaPropostas(this.queries).subscribe(
          resposta => {

            this.totalDeItems = resposta.total;
            this.numeroDeItems = resposta.count;
            this.atualizaIndicesPaginas();

            this.listaPropostas = resposta.listaPropostas;

          },
          err => {
            this.carregandoDados = false;

            if (err === 404) {
              this.buscaSemResultados = true;
            } else {
              this.router.navigate(['falha', err]);
            }
          },
          () => this.carregandoDados = false);
      break;

      case 'proponentes':
        this.apiService.getListaProponentes(this.queries).subscribe(
          resposta => {
            this.totalDeItems = resposta.total;
            this.numeroDeItems = resposta.count;
            this.atualizaIndicesPaginas();

            this.listaProponentes = resposta.listaProponentes;

          },
          err => {
            this.carregandoDados = false;

            if (err === 404) {
              this.buscaSemResultados = true;
            } else {
              this.router.navigate(['falha', err]);
            }
          },
          () => this.carregandoDados = false);
      break;

      case 'incentivadores':
        this.apiService.getListaIncentivadores(this.queries).subscribe(
          resposta => {
            this.totalDeItems = resposta.total;
            this.numeroDeItems = resposta.count;
            this.atualizaIndicesPaginas();

            this.listaIncentivadores = resposta.listaIncentivadores;

          },
          err => {
            this.carregandoDados = false;

            if (err === 404) {
              this.buscaSemResultados = true;
            } else {
              this.router.navigate(['falha', err]);
            }
          },
          () => this.carregandoDados = false);
      break;

      case 'fornecedores':
        this.apiService.getListaFornecedores(this.queries).subscribe(
          resposta => {
            this.totalDeItems = resposta.total;
            this.numeroDeItems = resposta.count;
            this.atualizaIndicesPaginas();

            this.listaFornecedores = resposta.listaFornecedores;

          },
          err => {
            this.carregandoDados = false;

            if (err === 404) {
              this.buscaSemResultados = true;
            } else {
              this.router.navigate(['falha', err]);
            }
          },
          () => this.carregandoDados = false);
      break;
      default:
        this.router.navigate(['falha', 405]);
    }
  }

  atualizaIndicesPaginas() {

    this.paginador = this.paginationService.getPager(this.totalDeItems, this.offsetAtual/this.configurationService.limitResultados + 1, this.configurationService.limitResultados);
    this.indicesPaginas = Array.apply(null, {length: this.totalDeItems/this.numeroDeItems}).map(Number.call, Number);
    this.indicesPaginas = this.indicesPaginas.slice(this.paginador.startPage, this.paginador.endPage);
    console.log(this.paginador);
    console.log(this.indicesPaginas);

  }

  // onScrollDown () {
  //   if (!this.carregandoDados) {
  //     this.offsetAtual += this.configurationService.limitResultados;
  //     this.carregarDados();
  //   }
  // }
}
