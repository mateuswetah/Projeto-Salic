import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { MetaService } from 'ng2-meta';
import { ApiService } from './../../services/api.service';

import { Fornecedor } from './../../models/fornecedor.model';
import { Produto } from './../../models/produto.model';

@Component({
  selector: 'app-fornecedores',
  templateUrl: './fornecedores.component.html',
  styleUrls: ['./fornecedores.component.scss']
})
export class FornecedoresComponent implements OnInit, OnDestroy {

  idFornecedor: String;
  inscricao: Subscription; // Usada para observar mudanças na URL
  carregandoDados: Boolean = false;
  carregandoDadosProdutos: Boolean = false;
  JSON: any = JSON;

  fornecedor: Fornecedor;
  listaProdutos: [Produto];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiService: ApiService,
              private metaService: MetaService) { }

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

    this.apiService.getListaProdutosDoFornecedor(idFornecedor).subscribe(
      produtos => {
        console.log(produtos);
        this.listaProdutos = produtos;
      },
      err => {
        this.carregandoDadosProdutos = false;
        this.router.navigate(['falha', err]);
      },
      () => this.carregandoDadosProdutos = false);
  }

  atualizarMetaTags() {
    // Meta tags genéricas
    this.metaService.setTitle('Fornecedor: ' +  this.fornecedor.nome);
    this.metaService.setTag('description', `Visualização e Consulta de Projetos 
                                            submetidos aos Sistema de Apoio às 
                                            Leis de Incentivo à Cultura.`);
    // Meta tags do Twitter
    this.metaService.setTag('twitter:card', 'summary');
    this.metaService.setTag('twitter:site', '@publisher_handle');
    this.metaService.setTag('twitter:title', 'Fornecedor: ' +  this.fornecedor.nome);
    this.metaService.setTag('twitter:description', `Visualização e Consulta de Projetos 
                                                    submetidos aos Sistema de Apoio às 
                                                    Leis de Incentivo à Cultura.`);
    this.metaService.setTag('twitter:creator', '@author_handle');

    // Meta tags do Open Graph
    this.metaService.setTag('og:title', 'Fornecedor: ' +  this.fornecedor.nome);
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
