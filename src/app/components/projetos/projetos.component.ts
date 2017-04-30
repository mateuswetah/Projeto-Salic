import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { RouterTransition } from './../../services/router.animations';

import { MetaService } from '@nglibs/meta';
import { ApiService } from './../../services/api.service';
import { DataFormatterService } from './../../services/data-formatter.service';

import { Projeto } from './../../models/projeto.model';

declare var $: any;

@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.component.html',
  styleUrls: ['./projetos.component.scss'],
  animations: [RouterTransition()],
  host: {'[@routerTransition]': ''}
})
export class ProjetosComponent implements OnInit, OnDestroy, AfterViewInit {

  PRONAC: Number;
  inscricao: Subscription; // Usada para observar mudanças na URL
  projeto: Projeto;
  carregandoDados: Boolean = true;
  JSON: any = JSON;
  url: string = location.href;

  // Dados utilizados na view
  textoSelecionado = 'resumo';

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

  ngAfterViewInit() {
    // Altera o position da página, que estava em 'absolute' para o efeito de animação ao entrar.
    setTimeout(function(){
      $('app-projetos').css({ position: 'relative' }).appendTo('app-outlet-container');
    }, 2000);

    // Aqui é configurado o botão de deslizamento das abas de pesquisa
    const scrollBarWidths = 16;

    function widthOfList() {

      let itemsWidth = 0;

      $('.aba li').each(function(){
        const itemWidth = $(this).outerWidth();
        itemsWidth += itemWidth;
      });

      return itemsWidth;
    };

    function widthOfHidden() {
      return (($('.abas-texto').outerWidth()) - widthOfList() - getLeftPosi()) - scrollBarWidths;
    };

    function getLeftPosi() {
      return $('.aba').position().left;
    };

    function getScrollPosi() {
      return $('.abas-texto').scrollLeft();
    };

    function reAjustar() {
      if (($('.abas-texto').outerWidth()) < widthOfList()) {
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

    reAjustar();

    $(window).on('resize', function(e){
      reAjustar();
    });

    $('.abas-texto').scroll(function() {

      if (getScrollPosi() > 0) {
        $('.scroller-left').show();
      } else {
        $('.scroller-left').hide();
      }

      if (getScrollPosi() < widthOfList() - $('.abas-texto').outerWidth() ) {
        $('.scroller-right').show();
      } else {
        $('.scroller-right').hide();
      }
    });

    $('.scroller-right').click(function() {

      $('.scroller-left').fadeIn('slow');
      if (widthOfHidden() > 0) {
        $('.scroller-right').fadeOut('slow');
      }

      if (-1*widthOfHidden() > $('.abas-texto').outerWidth()) {
        $('.aba').animate({left: '-=' + ($('.abas-texto').outerWidth() - 30) + 'px'}, 'normal', function(){ });
      } else {
        $('.aba').animate({left: '+=' + widthOfHidden() + 'px'}, 'normal', function(){ });
        $('.scroller-right').fadeOut('slow');
      }
    });

    $('.scroller-left').click(function() {

      $('.scroller-right').fadeIn('slow');
      $('.scroller-left').fadeOut('slow');

      $('.aba').animate({ left: '-=' + getLeftPosi() + 'px'}, 'slow', function(){

      });
    });

  }


  atualizarMetaTags() {

    // Meta tags genéricas
    this.metaService.setTitle('Projeto: ' +  this.projeto.nome);
    this.metaService.setTag('description', `Portal de Visualização do 
                                               Sistema de Apoio às 
                                               Leis de Incentivo à Cultura.`);
    // Meta tags do Twitter
    this.metaService.setTag('twitter:card', 'summary');
    this.metaService.setTag('twitter:site', '@publisher_handle');
    this.metaService.setTag('twitter:title', 'Projeto: ' +  this.projeto.nome);
    this.metaService.setTag('twitter:description', `Portal de Visualização do 
                                               Sistema de Apoio às 
                                               Leis de Incentivo à Cultura.`);
    this.metaService.setTag('twitter:creator', '@author_handle');

    // Meta tags do Open Graph
    this.metaService.setTag('og:title', 'Projeto: ' +  this.projeto.nome);
    this.metaService.setTag('og:typle', 'article');
    this.metaService.setTag('og:locale', 'pt-BR');
    this.metaService.setTag('og:url', this.url);
    this.metaService.setTag('og:description', `Portal de Visualização do 
                                               Sistema de Apoio às 
                                               Leis de Incentivo à Cultura.`);
    this.metaService.setTag('site_name', 'VERSALIC');
    //this.metaService.setTag('fb:admins', ''); // usada apenas se tivermos uma página do facebook
  }

}
