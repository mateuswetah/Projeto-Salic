import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { MetaService } from 'ng2-meta';
import { ApiService } from './../../services/api.service';
import { DataFormatterService } from './../../services/data-formatter.service';

import { Proponente } from './../../models/proponente.model';
import { Projeto } from './../../models/projeto.model';

@Component({
  selector: 'app-proponentes',
  templateUrl: './proponentes.component.html',
  styleUrls: ['./proponentes.component.scss']
})
export class ProponentesComponent implements OnInit, OnDestroy {

  idProponente: String;
  inscricao: Subscription; // Usada para observar mudanças na URL
  carregandoDados: Boolean = false;
  carregandoDadosProjetos = false;
  JSON: any = JSON;

  proponente: Proponente;
  listaProjetos: [Projeto];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiService: ApiService,
              private dataFormatterService: DataFormatterService,
              private metaService: MetaService) { }

  ngOnInit() {
    this.proponente = null;
    this.listaProjetos = null;

   // Obtêm o parâmetro através da rota da URL
   this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.idProponente = params['idProponente'];
        // Acessar API, passar dados para objeto.
        // Caso falha, this.router.navigate('falha/:idFalha')
      }
    );
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  onLoadProponente(idProponente: Number) {
    this.carregandoDados = true;

    this.apiService.getProponente(String(idProponente)).subscribe(
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

  onLoadProjetos(idProponente: Number) {
    this.carregandoDadosProjetos = true;

    this.apiService.getListaProjetosDoProponente(String(idProponente)).subscribe(
      projetos => {
        console.log(projetos);
        this.listaProjetos = projetos;
      },
      err => {
        this.carregandoDadosProjetos = false;
        this.router.navigate(['falha', err]);
      },
      () => this.carregandoDadosProjetos = false);
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
    //this.metaService.setTag('fb:admins', ''); // usada apenas se tivermos uma página do facebook
  }

}
