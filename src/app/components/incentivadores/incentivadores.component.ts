import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

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
              private apiService: ApiService) { }

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
}
