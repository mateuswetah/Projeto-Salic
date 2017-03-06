import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { MetaService } from '@nglibs/meta';
import { ApiService } from './../../services/api.service';

import { Incentivador } from './../../models/incentivador.model';
import { Doacao } from './../../models/doacao.model';

@Component({
  selector: 'app-incentivadores',
  templateUrl: './incentivadores.component.html',
  styleUrls: ['./incentivadores.component.scss']
})
export class IncentivadoresComponent implements OnInit, OnDestroy {

  inscricao: Subscription; // Usada para observar mudanças na URL
  JSON: any = JSON;

  carregandoDados: Boolean = false;
  carregandoDadosDoacoes: Boolean = false;
  buscaPorDoacoesSemResultados: Boolean = false;

  idIncentivador: String;
  incentivador: Incentivador;
  listaDoacoes: [Doacao];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiService: ApiService,
              private metaService: MetaService) { }

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

    this.apiService.getListaDoacoesDoIncentivador(idIncentivador).subscribe(
      doacoes => {
        console.log(doacoes);
        this.listaDoacoes = doacoes;
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
    this.metaService.setTag('og:description', `Visualização e Consulta de Projetos 
                                                submetidos aos Sistema de Apoio às 
                                                Leis de Incentivo à Cultura.`);
    this.metaService.setTag('site_name', 'Sistema de Visualização do SALIC');
    //this.metaService.setTag('fb:admins', ''); // usada apenas se tivermos uma página do facebook
  }
}
