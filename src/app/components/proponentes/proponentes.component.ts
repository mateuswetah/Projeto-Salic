import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { routerTransition } from './../../services/router.animations';

import { MetaService } from '@nglibs/meta';
import { ApiService } from './../../services/api.service';
import { DataFormatterService } from './../../services/data-formatter.service';
import { ConfigurationService } from './../../services/configuration.service';

import { Proponente } from './../../models/proponente.model';
import { Projeto } from './../../models/projeto.model';

@Component({
  selector: 'app-proponentes',
  templateUrl: './proponentes.component.html',
  styleUrls: ['./proponentes.component.scss'],
  animations: [routerTransition()],
  host: {'[@routerTransition]': ''}
})
export class ProponentesComponent implements OnInit, OnDestroy {

  inscricao: Subscription; // Usada para observar mudanças na URL
  JSON: any = JSON;

  carregandoDados: Boolean = false;
  carregandoDadosProjetos = false;
  buscaPorProjetosSemResultados: Boolean = false;

  idProponente: String;
  proponente: Proponente;

  queriesDeProjeto: { [query: string]: String; } = {};
  listaProjetos: [Projeto] = undefined;
  numeroDeItens: number;
  totalDeItens: number;
  totalDeItensCarregado = 0;

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
        this.idProponente = params['idProponente'];
        this.onLoadProponente(this.idProponente);
        this.onLoadProjetos(this.idProponente);
      }
    );
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  onLoadProponente(idProponente: String) {
    this.carregandoDados = true;
    this.listaProjetos = undefined; // Garante que o objeto seja sobrescrito
                                    // caso estejamos voltando de outra página.
    this.apiService.getProponente(idProponente).subscribe(
      proponente => {
        console.log(proponente);
        this.proponente = proponente;
        this.atualizarMetaTags();
      },
      err => {
        this.carregandoDados = false;
        this.router.navigate(['falha', err]);
      },
      () => this.carregandoDados = false);
  }

  onLoadProjetos(idProponente: String) {
    this.carregandoDadosProjetos = true;
    this.buscaPorProjetosSemResultados = false;

    this.queriesDeProjeto['proponente_id'] = idProponente;
    this.queriesDeProjeto['limit'] = '' + this.configurationService.limitResultados;

    this.apiService.getListaProjetosDoProponente(this.queriesDeProjeto).subscribe(
      resposta => {
        console.log(resposta);
        if (this.listaProjetos === undefined) {
          this.listaProjetos = resposta.listaProjetosDoProponente;
        } else {
          for (const projeto of resposta.listaProjetosDoProponente) {
            this.listaProjetos.push(projeto);
          }
        }
        this.numeroDeItens = resposta.count;
        this.totalDeItens = resposta.total;
        this.totalDeItensCarregado += this.numeroDeItens;

      },
      err => {
        this.carregandoDadosProjetos = false;

        if (err === 404) {
          this.buscaPorProjetosSemResultados = true;
        } else {
          this.router.navigate(['falha', err]);
        }
      },
      () => this.carregandoDadosProjetos = false);
  }

  carregarMaisProjetos() {

    this.queriesDeProjeto['offset'] = (this.totalDeItensCarregado + this.configurationService.limitResultados - 1) + '';
    this.onLoadProjetos(this.idProponente);

  }

  atualizarMetaTags() {
    // Meta tags genéricas
    this.metaService.setTitle('Proponente: ' +  this.proponente.nome);
    this.metaService.setTag('description', `Visualização e Consulta de Projetos 
                                            submetidos aos Sistema de Apoio às 
                                            Leis de Incentivo à Cultura.`);
    // Meta tags do Twitter
    this.metaService.setTag('twitter:card', 'summary');
    this.metaService.setTag('twitter:site', '@publisher_handle');
    this.metaService.setTag('twitter:title', 'Proponente: ' +  this.proponente.nome);
    this.metaService.setTag('twitter:description', `Visualização e Consulta de Projetos 
                                                    submetidos aos Sistema de Apoio às 
                                                    Leis de Incentivo à Cultura.`);
    this.metaService.setTag('twitter:creator', '@author_handle');

    // Meta tags do Open Graph
    this.metaService.setTag('og:title', 'Proponente: ' +  this.proponente.nome);
    this.metaService.setTag('og:typle', 'article');
    this.metaService.setTag('og:url', this.router.url);
    this.metaService.setTag('og:description', `Visualização e Consulta de Projetos 
                                                submetidos aos Sistema de Apoio às 
                                                Leis de Incentivo à Cultura.`);
    this.metaService.setTag('site_name', 'Sistema de Visualização do SALIC');
    // this.metaService.setTag('fb:admins', ''); // usada apenas se tivermos uma página do facebook
  }

}
