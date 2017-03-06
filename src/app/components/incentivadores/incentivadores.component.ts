import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { MetaService } from 'ng2-meta';
import { ApiService } from './../../services/api.service';

import { Incentivador } from './../../models/incentivador.model';
import { Doacao } from './../../models/doacao.model';

@Component({
  selector: 'app-incentivadores',
  templateUrl: './incentivadores.component.html',
  styleUrls: ['./incentivadores.component.scss']
})
export class IncentivadoresComponent implements OnInit, OnDestroy {

  idIncentivador: String;
  inscricao: Subscription; // Usada para observar mudanças na URL
  carregandoDados: Boolean = false;
  carregandoDadosDoacoes: Boolean = false;
  incentivador: Incentivador; // Usar objeto depois
  listaDoacoes: [Doacao];
  JSON: any = JSON;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiService: ApiService,
              private metaService: MetaService) { }

  ngOnInit() {
   // Obtêm o parâmetro através da rota da URL
   this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.idIncentivador = params['idIncentivador'];
        // Acessar API, passar dados para objeto.
        // Caso falha, this.router.navigate('falha/:idFalha')
      }
    );
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  onLoadIncentivador(idIncentivador: Number) {
    this.carregandoDados = true;

    this.apiService.getIncentivador(String(idIncentivador)).subscribe(
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

  onLoadDoacoes(idIncentivador: Number) {
    this.carregandoDadosDoacoes = true;

    this.apiService.getListaDoacoesDoIncentivador(String(idIncentivador)).subscribe(
      doacoes => {
        console.log(doacoes);
        this.listaDoacoes = doacoes;
      },
      err => {
        this.carregandoDadosDoacoes = false;
        this.router.navigate(['falha', err]);
      },
      () => this.carregandoDadosDoacoes = false);
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
    this.metaService.setTag('og:url', this.router.url);
    this.metaService.setTag('og:description', `Visualização e Consulta de Projetos 
                                                submetidos aos Sistema de Apoio às 
                                                Leis de Incentivo à Cultura.`);
    this.metaService.setTag('site_name', 'Sistema de Visualização do SALIC');
    //this.metaService.setTag('fb:admins', ''); // usada apenas se tivermos uma página do facebook
  }
}
