import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { MetaService } from 'ng2-meta';
import { ApiService } from './../../services/api.service';

import { Proposta } from './../../models/proposta.model';

@Component({
  selector: 'app-propostas',
  templateUrl: './propostas.component.html',
  styleUrls: ['./propostas.component.scss']
})
export class PropostasComponent implements OnInit, OnDestroy {

  idProposta: Number;
  inscricao: Subscription; // Usada para observar mudanças na URL
  carregandoDados: Boolean = false;
  proposta: Proposta; // Usar objeto depois
  JSON: any = JSON;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiService: ApiService,
              private metaService: MetaService) { }

  ngOnInit() {
   // Obtêm o parâmetro através da rota da URL
   this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.idProposta = params['idProposta'];
        // Acessar API, passar dados para objeto.
        // Caso falha, this.router.navigate('falha/:idFalha')
      }
    );
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  onLoadProposta(idProposta: Number) {
    this.carregandoDados = true;

    this.apiService.getProposta(String(idProposta)).subscribe(
      proposta => {
        console.log(proposta);
        this.proposta = proposta;
        this.atualizarMetaTags();
      },
      err => {
        this.carregandoDados = false;
        this.router.navigate(['falha', err]);
      },
      () => this.carregandoDados = false);
  }

  atualizarMetaTags() {
    // Meta tags genéricas
    this.metaService.setTitle('Proposta: ' +  this.proposta.nome);
    this.metaService.setTag('description', `Visualização e Consulta de Projetos 
                                            submetidos aos Sistema de Apoio às 
                                            Leis de Incentivo à Cultura.`);
    // Meta tags do Twitter
    this.metaService.setTag('twitter:card', 'summary');
    this.metaService.setTag('twitter:site', '@publisher_handle');
    this.metaService.setTag('twitter:title', 'Proposta: ' +  this.proposta.nome);
    this.metaService.setTag('twitter:description', `Visualização e Consulta de Projetos 
                                                    submetidos aos Sistema de Apoio às 
                                                    Leis de Incentivo à Cultura.`);
    this.metaService.setTag('twitter:creator', '@author_handle');

    // Meta tags do Open Graph
    this.metaService.setTag('og:title', 'Proposta: ' +  this.proposta.nome);
    this.metaService.setTag('og:typle', 'article');
    this.metaService.setTag('og:url', this.router.url);
    this.metaService.setTag('og:description', `Visualização e Consulta de Projetos 
                                                submetidos aos Sistema de Apoio às 
                                                Leis de Incentivo à Cultura.`);
    this.metaService.setTag('site_name', 'Sistema de Visualização do SALIC');
    //this.metaService.setTag('fb:admins', ''); // usada apenas se tivermos uma página do facebook
  }

}
