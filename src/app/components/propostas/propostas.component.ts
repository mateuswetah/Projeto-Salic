import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

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
  proposta: String = ''; // Usar objeto depois

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiService: ApiService) { }

  ngOnInit() {
   // Obtêm o parâmetro através da rota da URL
   this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.idProposta= params['idProposta'];
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
        this.proposta = JSON.stringify(proposta);
      },
      err => {
        this.carregandoDados = false;
        this.router.navigate(['falha', err]);
      },
      () => this.carregandoDados = false);
  }

}
