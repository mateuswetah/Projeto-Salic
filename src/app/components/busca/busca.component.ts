import { Component, OnInit, OnDestroy, AfterViewInit,
         trigger, state, style, transition, animate, keyframes, HostListener, ViewChild } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { ModalDirective } from 'ng2-bootstrap/modal';

import { ApiService } from './../../services/api.service';
import { ConfigurationService } from './../../services/configuration.service';
import { DataFormatterService } from './../../services/data-formatter.service';

import { Projeto } from './../../models/projeto.model';
import { Proposta } from './../../models/proposta.model';
import { Proponente } from './../../models/proponente.model';
import { Incentivador } from './../../models/incentivador.model';
import { Fornecedor } from './../../models/fornecedor.model';
import { Segmentos } from './../../models/segmentos.model';
import { Estados } from './../../models/estados.model';


declare var $: any;

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  styleUrls: ['./busca.component.scss'],
  animations: [

    trigger('subirRespostas', [
      transition('inativo => ativo', [
        animate(300, keyframes([
          style({opacity: 0, transform: 'translateY(200px)', offset: 0}),
          style({opacity: 1, transform: 'translateY(-25px)', offset: .75}),
          style({opacity: 1, transform: 'translateY(0)', offset: 1})
        ]))
      ])
    ])
  ]
})
export class BuscaComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modalDeCSVs') public modalDeCSVs: ModalDirective;
  filtrosEscondido: Boolean = true;

  inscricaoQueries: Subscription; // Usada para observar mudanças na URL
  inscricaoPesquisaPor: Subscription;

  JSON: any = JSON;

  pesquisaPor = 'projetos';
  carregandoDados: Boolean = false;
  buscaSemResultados = false;
  buscaAvancada = false;
  subirRespostasEstado: String = 'inativo';
  linksParaCSVs: String[];
  dataInicio: Date = new Date();
  minDate: Date = void 0;

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
  maximoBotoes = 4;
  opcoesDePaginacao = [10, 25, 50, 100];
  paginaAtual = 1;

  // Opções de Ordenação
  ordenarPor: String = '';
  ordenarDesc = false;
  ordenarPorQueries:  { [query: string]: String } = {};
  queriesDeOrdemDeProjetos: { [query: string]: String }
                          = { 'PRONAC':           'PRONAC',
                              'ano_projeto':      'Ano do Projeto',
                              'data_inicio':      'Data de Início',
                              'data_termino':     'Data de Término',
                              'valor_solicitado': 'Valor Solicidado',
                              'outras_fontes':    'Outras Fontes',
                              'valor_captado':    'Valor Captado',
                              'valor_proposta':   'Valor da Proposta',
                              'valor_projeto':    'Valor do Projeto' };
  queriesDeOrdemDePropostas: { [query: string]: String } = {};
  queriesDeOrdemDeProponentes: { [query: string]: String }
                             = { 'total_captado': 'Total Captado',
                                 'cgccpf':        'CGCCPF (FALTA NA API)' };
  queriesDeOrdemDeIncentivadores: { [query: string]: String }
                                = { 'total_doado': 'Total Doado',
                                    'cgccpf':        'CGCCPF (FALTA NA API)' };
  queriesDeOrdemDeFornecedores: { [query: string]: String } = {};

  // Queries para a busca
  queries: { [query: string]: String } = {};
  queriesDoSelecionado = [];
  queriesDeProjetos: { [query: string]: String }
                    = { 'limit': '', 'offset': '', 'PRONAC': '', 'proponente': '', 'cgccpf': '',
                        'nome': '', 'area': '', 'segmento': '', 'UF': '', 'ano_projeto': '', 'sort': 'PRONAC',
                        'data_inicio': '', 'data_inicio_min': '', 'data_inicio_max': '',
                        'data_termino': '', 'data_termino_min': '', 'data_termino_max': '' };
  queriesDePropostas: { [query: string]: String }
                    = { 'limit': '', 'offset': '', 'nome': '', 'data_inicio': '', 'data_termino': '' };
  queriesDeProponentes: { [query: string]: String }
                      = { 'limit': '', 'offset': '', 'nome': '', 'cgccpf': '', 'url_id': '',
                           'municipio': '', 'UF': '', 'tipo_pessoa': '', 'sort': 'total_captado' };
  queriesDeIncentivadores: { [query: string]: String }
                         = { 'limit': '', 'offset': '', 'nome': '', 'cgccpf': '', 'municipio': '',
                              'UF': '', 'tipo_pessoa': '', 'PRONAC': '', 'sort': 'total_doado' };
  queriesDeFornecedores: { [query: string]: String }
                       = { 'limit': '', 'offset': '', 'nome': '', 'cgccpf': '', 'PRONAC': '' };

  areasDeProjetos = ['Todas as áreas', 'Artes Cênicas',
                     'Audiovisual', 'Música',
                     'Artes Visuais', 'Patrimônio Cultural',
                     'Humanidades', 'Artes Integradas'];

  segmentosDeProjetos = new Segmentos();
  estados = new Estados();


  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private apiService: ApiService,
              private configurationService: ConfigurationService,
              private dataFormatterService: DataFormatterService,
              private datePipe: DatePipe) { }

  ngOnInit() {
      this.inscricaoPesquisaPor = this.route.params.subscribe (
      (params: any) => {

        this.pesquisaPor = params['pesquisaPor'];

        switch (this.pesquisaPor) {
          case 'projetos':
            this.queriesDoSelecionado = Object.keys(this.queriesDeProjetos);
            this.ordenarPorQueries = this.queriesDeOrdemDeProjetos;
          break;
          case 'propostas':
            this.queriesDoSelecionado = Object.keys(this.queriesDePropostas);
            this.ordenarPorQueries = this.queriesDeOrdemDePropostas;
          break;
          case 'proponentes':
            this.queriesDoSelecionado = Object.keys(this.queriesDeProponentes);
            this.ordenarPorQueries = this.queriesDeOrdemDeProponentes;
          break;
          case 'incentivadores':
            this.queriesDoSelecionado = Object.keys(this.queriesDeIncentivadores);
            this.ordenarPorQueries = this.queriesDeOrdemDeIncentivadores;
          break;
          case 'fornecedores':
            this.queriesDoSelecionado = Object.keys(this.queriesDeIncentivadores);
            this.ordenarPorQueries = this.queriesDeOrdemDeFornecedores;
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

   consoleLog(event) { console.log(event); }

  ngOnDestroy() {
    this.inscricaoPesquisaPor.unsubscribe();
    this.inscricaoQueries.unsubscribe();
  }

  atualizaQueries(queryParams: any) {

    let nenhumaQueryEnviada = true;

    this.queries = {};
    this.ordenarPor = '';

    for (const query of this.queriesDoSelecionado) {
      if (queryParams[query] && queryParams[query] !== '' && queryParams[query] !== undefined) {

        this.queries[query] = queryParams[query];

        switch (this.pesquisaPor) {
          case 'projetos':
            this.queriesDeProjetos = this.queries;
            this.ordenarPorQueries = this.queriesDeOrdemDeProjetos;

            if (this.ordenarPor === '') {
              this.ordenarPor = 'PRONAC';
            }
          break;
          case 'propostas':
            this.queriesDePropostas = this.queries;
            this.ordenarPorQueries = this.queriesDeOrdemDePropostas;
          break;
          case 'proponentes':
            this.queriesDeProponentes = this.queries;
            this.ordenarPorQueries = this.queriesDeOrdemDeProponentes;

            if (this.ordenarPor === '') {
              this.ordenarPor = 'total_captado';
            }
          break;
          case 'incentivadores':
            this.queriesDeIncentivadores = this.queries;
            this.ordenarPorQueries = this.queriesDeOrdemDeIncentivadores;
            if (this.ordenarPor === '') {
              this.ordenarPor = 'total_doado';
            }
          break;
          case 'fornecedores':
            this.queriesDeFornecedores = this.queries;
            this.ordenarPorQueries = this.queriesDeOrdemDeFornecedores;
          break;
        }

        if (query === 'sort') {
          this.ordenarPor = this.queries['sort'].split(':')[0];
          this.ordenarDesc = this.queries['sort'].split(':')[1] === 'desc' ? true : false;
        }

        if (query !== 'offset' && query !== 'limit') {
          nenhumaQueryEnviada = false;
        }
      }
    }
    this.totalDeItems = 0;
    this.numeroDeItems = 0;

    //if (nenhumaQueryEnviada === false) {
      this.carregarPagina(1);
      //console.log(nenhumaQueryEnviada);
    //}
  }

  onTrocaPesquisaPor(novoPesquisaPor) {

    this.pesquisaPor = novoPesquisaPor;

    switch (this.pesquisaPor) {
      case 'projetos':
        this.ordenarPorQueries = this.queriesDeOrdemDeProjetos;
        this.queries = this.queriesDeProjetos;
        this.queriesDoSelecionado = Object.keys(this.queriesDeProjetos);
      break;
      case 'propostas':
      this.ordenarPorQueries = this.queriesDeOrdemDePropostas;
        this.queries = this.queriesDeProjetos;
        this.queriesDoSelecionado = Object.keys(this.queriesDePropostas);
      break;
      case 'proponentes':
      this.ordenarPorQueries = this.queriesDeOrdemDeProponentes;
        this.queries = this.queriesDeProponentes;
        this.queriesDoSelecionado = Object.keys(this.queriesDeProponentes);
      break;
      case 'incentivadores':
      this.ordenarPorQueries = this.queriesDeOrdemDeIncentivadores;
        this.queries = this.queriesDeIncentivadores;
        this.queriesDoSelecionado = Object.keys(this.queriesDeIncentivadores);
      break;
      case 'fornecedores':
      this.ordenarPorQueries = this.queriesDeOrdemDeFornecedores;
        this.queries = this.queriesDeFornecedores;
        this.queriesDoSelecionado = Object.keys(this.queriesDeIncentivadores);
      break;
      default:
        this.router.navigate(['falha', 405]);
    }

     this.atualizaQueries(this.queries);

    const params = new URLSearchParams();

    for (const key in this.queries) {
      if (this.queries.hasOwnProperty(key)) {
        if (this.queries[key] === '') {
          this.queries[key] = null;
        } else {
          params.set(key, String(this.queries[key]));
        }
      }
    }
    this.location.go('/' + this.pesquisaPor, params.toString());
  }

  onRealizarBuscaComEnter(event) {
    if (event.keyCode === 13) { this.onRealizarBusca(); }
  }

  onRealizarBusca() {

    this.offsetAtual = 0;
    this.paginaAtual = 1;

    this.listaProjetos = undefined;
    this.listaPropostas = undefined;
    this.listaProponentes = undefined;
    this.listaIncentivadores = undefined;
    this.listaFornecedores = undefined;

    this.carregarPagina(1);
  }

  carregarPagina(indice: number) {
    console.log('Indice da pg.: ' + indice);

    this.subirRespostasEstado = 'inativo';
    this.carregandoDados = true;
    this.buscaSemResultados = false;
    this.offsetAtual = (indice - 1) * this.configurationService.limitResultados;

    // Adiciona queries extras
    this.queries['limit'] = '' + this.configurationService.limitResultados;
    this.queries['offset'] = '' + this.offsetAtual ;

    if (this.keys(this.ordenarPorQueries).length > 0) {
      this.ordenarDesc ? (this.queries['sort'] = this.ordenarPor + ':desc') : (this.queries['sort'] = this.ordenarPor + ':asc');
    }

    const params = new URLSearchParams();

    for (const key in this.queries) {
      if (this.queries.hasOwnProperty(key)) {

        if (this.queries[key] === '') {
          this.queries[key] = null;
        } else {
          params.set(key, String(this.queries[key]));
        }
      }
    }

    this.location.go('/' + this.pesquisaPor, params.toString());

    switch (this.pesquisaPor) {

      case 'projetos':
        this.apiService.getListaProjetos(this.queries).subscribe(
          resposta => {
            this.totalDeItems = resposta.total;
            this.numeroDeItems = resposta.count;
            this.listaProjetos = resposta.listaProjetos;

            this.subirRespostasEstado = 'ativo';
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

            this.subirRespostasEstado = 'ativo';
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

            this.subirRespostasEstado = 'ativo';
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

            this.subirRespostasEstado = 'ativo';
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

            this.subirRespostasEstado = 'ativo';
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

  // Trata da rotina de baixar CSVs
  baixarCSVDaConsulta() {

    if (this.totalDeItems <= 100) {

      const params = new URLSearchParams();

      for (const key in this.queries) {
        if (this.queries.hasOwnProperty(key)) {
          if (key !== 'offset' && key !== 'limit') {
            params.set(key, String(this.queries[key]));
          }
        }
      }

      window.open(this.configurationService.ApiUrl + this.pesquisaPor + '?' + params.toString() + '&offset=0&limit=100&format=csv');

    } else {

      this.linksParaCSVs = [];
      let itensRestantes = this.totalDeItems;
      let offsetAtual = 0;

      const params = new URLSearchParams();

      for (const key in this.queries) {
        if (this.queries.hasOwnProperty(key)) {
          if (key !== 'offset' && key !== 'limit') {
            params.set(key, String(this.queries[key]));
          }
        }
      }

      while (itensRestantes > 0) {

        this.linksParaCSVs.push(this.configurationService.ApiUrl + this.pesquisaPor + '?' + params.toString() +
                           '&offset=' + offsetAtual + '&limit=100&format=csv');
        itensRestantes = itensRestantes - 100;
        offsetAtual = offsetAtual + 100;

      }

      this.modalDeCSVs.show();
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
    this.location.go('/' + this.pesquisaPor, params.toString());

  }

  // Retorna o dicionário de Queries como um array iterável para a view
  keys(dicionario): Array<string> {
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

    function organizaChips() {

      let constante = 150;

      if ($('#containerChipsButton').is(':visible')) {
        constante += 55;
      }

      if ($('#containerChipsRow').innerWidth() > $('#containerChips').innerWidth() - constante ) {

        let chipRemovido = $('#containerChipsRow .chip-wrapper').last();
        $('#containerChipsRow .chip-wrapper').last().remove();
        $('#containerChipsPanel').append(chipRemovido);

        //$('#containerChipsRow').hide();
        // $('#containerChipsPanel').show();
        $('#containerChipsButton').show();

      } else {

        let chipRemovido = $('#containerChipsPanel .chip-wrapper').last();
        $('#containerChipsPanel .chip-wrapper').last().remove();
        $('#containerChipsRow').append(chipRemovido);

        //$('#containerChipsRow').show();
        //$('#containerChipsPanel').hide();
        $('#containerChipsButton').hide();
      }
    }

    reAdjust();
    organizaChips();

    $(window).on('resize', function(e){
      console.log('Inneter Width 1:' + $('#containerChips').innerWidth());
      console.log('Inner Width 2:' + $('#containerChipsRow').innerWidth());
      reAdjust();
      organizaChips();
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

  @HostListener('window:scroll', ['$event'])
  passouDoScrollTop(event) {
    if ($('#headerRespostas').offset() !== undefined) {
      if (window.pageYOffset > $('#headerRespostas').offset().top) {
        return true;
      }
    }
    return false;
  }

  obterStringDeQuantidadeNaResposta() {
    return (Number(this.offsetAtual) + 1) + ' a ' + (Number(this.offsetAtual) + Number(this.numeroDeItems));
  }

  checaChipsValidos(keys: string[]) {
    const indexOffset = keys.indexOf('offset');
    if (indexOffset > -1) { keys.splice(indexOffset, 1); }
    const indexSort = keys.indexOf('sort');
    if (indexSort > -1) { keys.splice(indexSort, 1); }
    const indexLimit = keys.indexOf('limit');
    if (indexLimit > -1) { keys.splice(indexLimit, 1); }

    return keys;
  }

  formataChip (key: string) {
    if (key === 'area') {
      return this.areasDeProjetos[String(this.queries[key])];
    } else if (key === 'segmento') {
      return this.segmentosDeProjetos.obterNomePorCod(this.queries[key]);
    } else {
      return this.queries[key];
    }
  }

  public obterDataInicio(): String {
    if (this.queries['data_inicio'] !== null && this.queries['data_inicio'] !== undefined && this.queries['data_inicio'] !== '') {
      return this.dataInicio && String(this.dataInicio.getTime()) || String(new Date().getTime());
    }
    return '';
  }

  public esconderModalDeCSV(): void {
    this.modalDeCSVs.hide();
  }

  public escondido(event: any): void {
    // console.log(event);
  }

  public expandido(event: any): void {
    // console.log(event);
  }

}
