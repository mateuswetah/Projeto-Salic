import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { RouterTransition } from './../../services/router.animations';

import { MetaService } from '@nglibs/meta';
import { ApiService } from './../../services/api.service';
import { DataFormatterService } from './../../services/data-formatter.service';
import { ConfigurationService } from './../../services/configuration.service';

import { Fornecedor } from './../../models/fornecedor.model';
import { Produto } from './../../models/produto.model';

declare var $: any;

@Component({
  selector: 'app-fornecedores',
  templateUrl: './fornecedores.component.html',
  styleUrls: ['./fornecedores.component.scss'],
  animations: [RouterTransition()],
  host: {'[@routerTransition]': ''}
})
export class FornecedoresComponent implements OnInit, OnDestroy, AfterViewInit {

  inscricao: Subscription; // Usada para observar mudanças na URL
  JSON: any = JSON;
  url: string = location.href;

  carregandoDados: Boolean = false;
  carregandoDadosProdutos: Boolean = false;
  buscaPorProdutosSemResultados: Boolean = false;

  idFornecedor: String;
  fornecedor: Fornecedor;
  listaProdutos: [Produto];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiService: ApiService,
              private dataFormatterService: DataFormatterService,
              private metaService: MetaService,
              private configurationService: ConfigurationService) { }

  ngOnInit() {
   // Obtêm o parâmetro através da rota da URL
   this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.idFornecedor = params['idFornecedor'];
        this.onLoadFornecedor(this.idFornecedor);
        this.onLoadProdutos(this.idFornecedor);
      }
    );
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  onLoadFornecedor(idFornecedor: String) {
    this.carregandoDados = true;

    this.apiService.getFornecedor(idFornecedor).subscribe(
      fornecedor => {
        console.log(fornecedor);
        this.fornecedor = fornecedor;
        this.atualizarMetaTags();
      },
      err => {
        this.carregandoDados = false;
        this.router.navigate(['falha', err]);
      },
      () => this.carregandoDados = false);
  }

  onLoadProdutos(idFornecedor: String) {
    this.carregandoDadosProdutos = true;
    this.buscaPorProdutosSemResultados = false;

    this.apiService.getListaProdutosDoFornecedor(idFornecedor).subscribe(
      produtos => {
        console.log(produtos);
        this.listaProdutos = produtos;
      },
      err => {
        this.carregandoDadosProdutos = false;

        if (err === 404) {
          this.buscaPorProdutosSemResultados = true;
        } else {
          this.router.navigate(['falha', err]);
        }
      },
      () => this.carregandoDadosProdutos = false);
  }

  // Altera o position da página, que estava em 'absolute' para o efeito de animação ao entrar.
  ngAfterViewInit() {
    $('app-incentivadores').css({position: 'relative'}).appendTo('app-outlet-container');
  }

  atualizarMetaTags() {
    // Meta tags genéricas
    this.metaService.setTitle('Fornecedor: ' +  this.fornecedor.nome);
    this.metaService.setTag('description', `Portal de Visualização do 
                                            Sistema de Apoio às 
                                            Leis de Incentivo à Cultura.`);
    // Meta tags do Twitter
    this.metaService.setTag('twitter:card', 'summary');
    this.metaService.setTag('twitter:site', '@publisher_handle');
    this.metaService.setTag('twitter:title', 'Fornecedor: ' +  this.fornecedor.nome);
    this.metaService.setTag('twitter:description', `Portal de Visualização do 
                                                    Sistema de Apoio às 
                                                    Leis de Incentivo à Cultura.`);
    this.metaService.setTag('twitter:creator', '@author_handle');

    // Meta tags do Open Graph
    this.metaService.setTag('og:title', 'Fornecedor: ' +  this.fornecedor.nome);
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
