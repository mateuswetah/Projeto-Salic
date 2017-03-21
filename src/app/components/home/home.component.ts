import { Component, OnInit, AfterViewInit,
         trigger, state, style, transition, animate, keyframes } from '@angular/core';
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
export class HomeComponent implements OnInit, AfterViewInit {

  pesquisaPor = 'projetos';
  buscaAvancada = false;

  // Opções de Ordenação
  ordenarPor = 'PRONAC';
  ordenarDesc = false;
  ordenarPorQueries:  { [query: string]: String; }
                    = { 'PRONAC':           'PRONAC',
                        'ano_projeto':      'Ano do Projeto',
                        'data_inicio':      'Data de Início',
                        'data_termino':     'Data de Término',
                        'valor_solicitado': 'Valor Solicidado',
                        'outras_fontes':    'Outras Fontes',
                        'valor_captado':    'Valor Captado',
                        'valor_proposta':   'Valor da Proposta',
                        'valor_projeto':    'Valor do Projeto' };

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
  }

  atualizaQueries(queryParams: any) {

    this.queries = {};

    for (const query of this.queriesDoSelecionado) {
      if (queryParams[query]) {
        this.queries[query] = queryParams[query];
      }
    }

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
  }

  onRealizarBuscaComEnter(event) {
    if (event.keyCode === 13) { this.onRealizarBusca(); }
  }

  onRealizarBusca() {

    // Adiciona queries extras
    this.queries['limit'] = '' + this.configurationService.limitResultados;
    this.queries['offset'] = '0';
    this.queries['sort'] = this.ordenarPor + ':' + (this.ordenarDesc ? 'desc' : 'asc');

    switch (this.pesquisaPor) {

      case 'projetos':
        this.router.navigate(['projetos'], {queryParams: this.queries});
      break;

      case 'propostas':
        this.router.navigate(['propostas'], {queryParams: this.queries});
      break;

      case 'proponentes':
        this.router.navigate(['proponentes'], {queryParams: this.queries});
      break;

      case 'incentivadores':
        this.router.navigate(['incentivadores'], {queryParams: this.queries});
      break;

      case 'fornecedores':
        this.router.navigate(['fornecedores'], {queryParams: this.queries});
      break;

      default:
        this.router.navigate(['falha', 405]);
    }
  }

  // Remove uma querie de parâmetro de busca
  removeQuery(removedKey: string) {
    this.queries[removedKey] = null;

    this.atualizaQueries(this.queries);

  }

  // Retorna o dicionário de Queries como um array iterável para a view
  keys(dicionario: { [query: string]: String; }): Array<string> {
    return Object.keys(dicionario);
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
