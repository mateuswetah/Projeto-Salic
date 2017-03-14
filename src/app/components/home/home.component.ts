import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { RequestOptions, URLSearchParams } from '@angular/http';
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

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  inscricaoQueries: Subscription; // Usada para observar mudanças na URL
  inscricaoPesquisaPor: Subscription;

  JSON: any = JSON;

  pesquisaPor = 'projeto';
  carregandoDados: Boolean = false;
  buscaSemResultados = false;
  selectedIndex = 0;

  // Respostas da API:
  listaProjetos:        [Projeto];
  listaPropostas:       [Proposta];
  listaProponentes:     [Proponente];
  listaIncentivadores:  [Incentivador];
  listaFornecedores:    [Fornecedor];

  // Paginacao
  offsetAtual = 0;
  numeroDeItems: number;
  totalDeItems: number;
  maximoBotoes = 5;
  paginaAtual = 1;

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
              private location: Location,
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
consoleLog(event){console.log(event);}
  ngOnDestroy() {
    this.inscricaoPesquisaPor.unsubscribe();
    this.inscricaoQueries.unsubscribe();
  }

  atualizaQueries(queryParams: any) {

    let nenhumaQueryEnviada = true;

    this.queries = {};

    for (const query of this.queriesDoSelecionado) {
      if (queryParams[query]) {
        this.queries[query] = queryParams[query];
        if (query !== 'offset' && query !== 'limit') {
          nenhumaQueryEnviada = false;
        }
      }
    }

    this.totalDeItems = 0;
    this.numeroDeItems = 0;

    //if (nenhumaQueryEnviada === false) {
      this.carregarPagina(1);
      console.log(nenhumaQueryEnviada);
    //}
  }

  onTrocaPesquisaPor(novoPesquisaPor) {

    this.pesquisaPor = novoPesquisaPor;

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

    this.atualizaQueries(this.queries);

    const params = new URLSearchParams();

    for (const key in this.queries) {
      if (this.queries.hasOwnProperty(key)) {
        params.set(key, String(this.queries[key]));
      }
    }
    this.location.go(this.pesquisaPor, params.toString());
  }

  onRealizarBuscaComEnter(event) {
    if (event.keyCode === 13) { this.onRealizarBusca(); }
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
    console.log('Indice da pg.: ' + indice);

    this.carregandoDados = true;
    this.buscaSemResultados = false;
    this.offsetAtual = (indice - 1) * this.configurationService.limitResultados;

    // Adiciona queries extras
    this.queries['limit'] = '' + this.configurationService.limitResultados;
    this.queries['offset'] = '' + this.offsetAtual ;

    const params = new URLSearchParams();

    for (const key in this.queries) {
      if (this.queries.hasOwnProperty(key)) {
        params.set(key, String(this.queries[key]));
      }
    }

    this.location.go(this.pesquisaPor, params.toString());

    switch (this.pesquisaPor) {

      case 'projetos':
        this.apiService.getListaProjetos(this.queries).subscribe(
          resposta => {
            this.totalDeItems = resposta.total;
            this.numeroDeItems = resposta.count;
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

  // Remove uma querie de parâmetro de busca
  removeQuery(removedKey: string) {
    this.queries[removedKey] = null;

    this.atualizaQueries(this.queries);

    const params = new URLSearchParams();

    for (const key in this.queries) {
      if (this.queries.hasOwnProperty(key)) {
        params.set(key, String(this.queries[key]));
      }
    }
    this.location.go(this.pesquisaPor, params.toString());

    this.carregarPagina(0);
  }

  // Retorna o dicionário de Queries como um array iterável para a view
  keys(): Array<string> {
    return Object.keys(this.queries);
  }

  // Aqui é configurado o botão de deslizamento das abas de pesquisa
  ngAfterViewInit() {

    const scrollBarWidths = 40;

    function widthOfList() {

      let itemsWidth = 0;

      $('.aba li').each(function(){
        const itemWidth = $(this).outerWidth();
        itemsWidth += itemWidth;
      });

      return itemsWidth;
    };

    function widthOfHidden() {
      return (($('.abas-pesquisa').outerWidth()) - widthOfList() - getLeftPosi()) - scrollBarWidths;
    };

    function getLeftPosi() {
      return $('.aba').position().left;
    };

    function reAdjust() {
      if (($('.abas-pesquisa').outerWidth()) < widthOfList()) {
        $('.scroller-right').show();
      } else {
        $('.scroller-right').hide();
      }

      if (getLeftPosi() < 0) {
        $('.scroller-left').show();
      } else {
        $('.item').animate({left: '-=' + getLeftPosi() + 'px'}, 'slow');
        $('.scroller-left').hide();
      }
    }

    reAdjust();

    $(window).on('resize', function(e){
      reAdjust();
    });

    $('.scroller-right').click(function() {

      $('.scroller-left').fadeIn('slow');
      $('.scroller-right').fadeOut('slow');

      $('.aba').animate({left: '+=' + widthOfHidden() + 'px'}, 'slow', function(){

      });
    });

    $('.scroller-left').click(function() {

      $('.scroller-right').fadeIn('slow');
      $('.scroller-left').fadeOut('slow');

      $('.aba').animate({ left: '-=' + getLeftPosi() + 'px'}, 'slow', function(){

      });
    });
  }
}
