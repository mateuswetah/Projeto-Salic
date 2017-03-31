import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { routerTransition } from './../../services/router.animations';

import { MetaService } from '@nglibs/meta';
import { ApiService } from './../../services/api.service';
import { ConfigurationService } from './../../services/configuration.service';

import { Incentivador } from './../../models/incentivador.model';
import { Doacao } from './../../models/doacao.model';

declare var $: any;

@Component({
  selector: 'app-incentivadores',
  templateUrl: './incentivadores.component.html',
  styleUrls: ['./incentivadores.component.scss'],
  animations: [routerTransition()],
  host: {'[@routerTransition]': ''}
})
export class IncentivadoresComponent implements OnInit, OnDestroy, AfterViewInit {

  inscricao: Subscription; // Usada para observar mudanças na URL
  JSON: any = JSON;

  carregandoDados: Boolean = false;
  carregandoDadosDoacoes: Boolean = false;
  buscaPorDoacoesSemResultados: Boolean = false;

  idIncentivador: String;
  incentivador: Incentivador;

  queriesDeDoacao: { [query: string]: String; } = {};
  listaDoacoes: [Doacao] = undefined;
  numeroDeItens: number;
  totalDeItens: number;
  totalDeItensCarregado = 0;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiService: ApiService,
              private metaService: MetaService,
              private configurationService: ConfigurationService) { }

  ngOnInit() {
   // Obtêm o parâmetro através da rota da URL
   this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.idIncentivador = params['idIncentivador'];
        this.onLoadIncentivador(this.idIncentivador);
        this.onLoadDoacoes(this.idIncentivador);
      }
    );

  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  onLoadIncentivador(idIncentivador: String) {
    this.carregandoDados = true;
    this.listaDoacoes = undefined; // Garante que o objeto seja sobrescrito
                                    // caso estejamos voltando de outra página.

    this.apiService.getIncentivador(idIncentivador).subscribe(
      incentivador => {
        console.log(incentivador);
        this.incentivador = incentivador;
        this.atualizarMetaTags();
      },
      err => {
        this.carregandoDados = false;
        this.router.navigate(['falha', err]);
      },
      () => this.carregandoDados = false);
  }

  onLoadDoacoes(idIncentivador: String) {
    this.carregandoDadosDoacoes = true;
    this.buscaPorDoacoesSemResultados = false;

    this.queriesDeDoacao['limit'] = '' + this.configurationService.limitResultados;

    this.apiService.getListaDoacoesDoIncentivador(idIncentivador, this.queriesDeDoacao).subscribe(
      resposta => {
        console.log(resposta);
        if (this.listaDoacoes === undefined) {
          this.listaDoacoes = resposta.listaDoacoesDoIncentivador;
        } else {
          for (const doacao of resposta.listaDoacoesDoIncentivador) {
            this.listaDoacoes.push(doacao);
          }
        }
        this.numeroDeItens = resposta.count;
        this.totalDeItens = resposta.total;
        this.totalDeItensCarregado += this.numeroDeItens;
      },
      err => {
        this.carregandoDadosDoacoes = false;

        if (err === 404) {
          this.buscaPorDoacoesSemResultados = true;
        } else {
          this.router.navigate(['falha', err]);
        }
      },
      () => this.carregandoDadosDoacoes = false);
  }

  carregarMaisDoacoes() {

    this.queriesDeDoacao['offset'] = (this.totalDeItensCarregado + this.configurationService.limitResultados - 1) + '';
    this.onLoadDoacoes(this.idIncentivador);

  }

  // Altera o position da página, que estava em 'absolute' para o efeito de animação ao entrar.
  ngAfterViewInit() {
    $('app-incentivadores').css({position: 'relative'}).appendTo('app-outlet-container');
  }

  atualizarMetaTags() {
    // Meta tags genéricas
    this.metaService.setTitle('Incentivador: ' +  this.incentivador.nome);
    this.metaService.setTag('description', `Visualização e Consulta de Projetos 
                                            submetidos aos Sistema de Apoio às 
                                            Leis de Incentivo à Cultura.`);
    // Meta tags do Twitter
    this.metaService.setTag('twitter:card', 'summary');
    this.metaService.setTag('twitter:site', '@publisher_handle');
    this.metaService.setTag('twitter:title', 'Incentivador: ' +  this.incentivador.nome);
    this.metaService.setTag('twitter:description', `Visualização e Consulta de Projetos 
                                                    submetidos aos Sistema de Apoio às 
                                                    Leis de Incentivo à Cultura.`);
    this.metaService.setTag('twitter:creator', '@author_handle');

    // Meta tags do Open Graph
    this.metaService.setTag('og:title', 'Incentivador: ' +  this.incentivador.nome);
    this.metaService.setTag('og:typle', 'article');
    this.metaService.setTag('og:locale', 'pt-BR');
    this.metaService.setTag('og:url', this.router.url);
    this.metaService.setTag('og:description', `Portal de Visualização do 
                                               Sistema de Apoio às 
                                               Leis de Incentivo à Cultura.`);
    this.metaService.setTag('site_name', 'VERSALIC');
    // this.metaService.setTag('fb:admins', ''); // usada apenas se tivermos uma página do facebook
  }
}
