import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { ApiService } from './../../services/api.service';
import { DataFormatterService } from './../../services/data-formatter.service';

import { Proponente } from './../../models/proponente.model';

@Component({
  selector: 'app-proponentes',
  templateUrl: './proponentes.component.html',
  styleUrls: ['./proponentes.component.scss']
})
export class ProponentesComponent implements OnInit, OnDestroy {

  idProponente: String;
  inscricao: Subscription; // Usada para observar mudanças na URL
  carregandoDados: Boolean = false;
  proponente: Proponente;
  JSON: any = JSON;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiService: ApiService,
              private dataFormatterService: DataFormatterService) { }

  ngOnInit() {
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
      },
      err => {
        this.carregandoDados = false;
        this.router.navigate(['falha', err]);
      },
      () => this.carregandoDados = false);
  }
}
