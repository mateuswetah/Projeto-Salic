import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { routerTransition } from './../../services/router.animations';

import { MetaService } from '@nglibs/meta';
import { ApiService } from './../../services/api.service';
import { DataFormatterService } from './../../services/data-formatter.service';

import { Projeto } from './../../models/projeto.model';

declare var $: any;

@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.component.html',
  styleUrls: ['./projetos.component.scss'],
  animations: [routerTransition()],
  host: {'[@routerTransition]': ''}
})
export class ProjetosComponent implements OnInit, OnDestroy, AfterViewInit {

  PRONAC: Number;
  inscricao: Subscription; // Usada para observar mudanças na URL
  carregandoDados: Boolean = false;
  projeto: Projeto;
  JSON: any = JSON;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiService: ApiService,
              private dataFormatterService: DataFormatterService,
              private metaService: MetaService) {
  }

  ngOnInit() {
    // Obtêm o parâmetro através da rota da URL
   this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.PRONAC = params['PRONAC'];
        this.onLoadProjeto(this.PRONAC);
      }
    );
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  onLoadProjeto(PRONAC: Number) {
    this.carregandoDados = true;

    this.apiService.getProjeto(String(PRONAC)).subscribe(
      projeto => {
        console.log(projeto);
        this.projeto = projeto;
        this.atualizarMetaTags();
      },
      err => {
        this.carregandoDados = false;
        this.router.navigate(['falha', err]);
      },
      () => this.carregandoDados = false);
  }

  // Altera o position da página, que estava em 'absolute' para o efeito de animação ao entrar.
  ngAfterViewInit() {
    $('app-projetos').css({position: 'relative'}).appendTo('app-outlet-container');
  }

  atualizarMetaTags() {
    // Meta tags genéricas
    this.metaService.setTitle('Projeto: ' +  this.projeto.nome);
    this.metaService.setTag('description', `Visualização e Consulta de Projetos 
                                            submetidos aos Sistema de Apoio às 
                                            Leis de Incentivo à Cultura.`);
    // Meta tags do Twitter
    this.metaService.setTag('twitter:card', 'summary');
    this.metaService.setTag('twitter:site', '@publisher_handle');
    this.metaService.setTag('twitter:title', 'Projeto: ' +  this.projeto.nome);
    this.metaService.setTag('twitter:description', `Visualização e Consulta de Projetos 
                                                    submetidos aos Sistema de Apoio às 
                                                    Leis de Incentivo à Cultura.`);
    this.metaService.setTag('twitter:creator', '@author_handle');

    // Meta tags do Open Graph
    this.metaService.setTag('og:title', 'Projeto: ' +  this.projeto.nome);
    this.metaService.setTag('og:typle', 'article');
    this.metaService.setTag('og:locale', 'pt-BR');
    this.metaService.setTag('og:url', this.router.url);
    this.metaService.setTag('og:description', `Visualização e Consulta de Projetos 
                                                submetidos aos Sistema de Apoio às 
                                                Leis de Incentivo à Cultura.`);
    this.metaService.setTag('site_name', 'Sistema de Visualização do SALIC');
    //this.metaService.setTag('fb:admins', ''); // usada apenas se tivermos uma página do facebook
  }

}
