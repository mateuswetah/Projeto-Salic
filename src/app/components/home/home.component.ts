import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { ApiService } from './../../services/api.service';
import { ConfigurationService } from './../../services/configuration.service';
import { DataFormatterService } from './../../services/data-formatter.service';

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
  pesquisaPor = 'projeto';
  carregandoDados: Boolean = false;
  JSON: any = JSON;
  buscaSemResultados = false;

  // Parâmetros do InifiniteScroll
  scrollDistance = 1;
  offsetAtual = 0;

  // Respostas da API:
  resposta: String = '';
  listaProjetos:        [Projeto];
  listaPropostas:       [Proposta];
  listaProponentes:     [Proponente];
  listaIncentivadores:  [Incentivador];
  listaFornecedores:    [Fornecedor];

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
              private dataFormatterService: DataFormatterService) {
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

    this.carregarDados();
  }

  carregarDados() {
    this.carregandoDados = true;
    this.buscaSemResultados = false;

    // Adiciona queries extras
    this.queries['limit'] = '' + this.configurationService.limitResultados;
    this.queries['offset'] = '' + this.offsetAtual;

    switch (this.pesquisaPor) {

      case 'projetos':
        this.apiService.getListaProjetos(this.queries).subscribe(
          projetos => {
            if (this.listaProjetos !== undefined) {
              for (const projeto of projetos) {
                this.listaProjetos.push(projeto);
              }
            } else {
              this.listaProjetos = projetos;
            }
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
          propostas => {
            if (this.listaPropostas !== undefined) {
              for (const proposta of propostas) {
                this.listaPropostas.push(proposta);
              }
            } else {
              this.listaPropostas = propostas;
            }
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
          proponentes => {
            if (this.listaProponentes !== undefined) {
              for (const proponente of proponentes) {
                this.listaProponentes.push(proponente);
              }
            } else {
              this.listaProponentes = proponentes;
            }
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
          incentivadores => {
            if (this.listaIncentivadores !== undefined) {
              for (const incentivador of incentivadores) {
                this.listaIncentivadores.push(incentivador);
              }
            } else {
              this.listaIncentivadores = incentivadores;
            }
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
          fornecedores => {
            if (this.listaFornecedores !== undefined) {
              for (const fornecedor of fornecedores) {
                this.listaFornecedores.push(fornecedor);
              }
            } else {
              this.listaFornecedores = fornecedores;
            }
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

  onScrollDown () {
    if (!this.carregandoDados) {
      this.offsetAtual += this.configurationService.limitResultados;
      this.carregarDados();
    }
  }
}
