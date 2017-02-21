import { Projeto } from './../../models/projeto.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { ApiService } from './../../services/api.service';

@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.component.html',
  styleUrls: ['./projetos.component.scss']
})
export class ProjetosComponent implements OnInit, OnDestroy {

  PRONAC: Number;
  inscricao: Subscription; // Usada para observar mudanças na URL
  carregandoDados: Boolean = false;
  projeto: String = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiService: ApiService) {
    //this.PRONAC = this.route.snapshot.params['PRONAC'];
  }

  ngOnInit() {
    // Obtêm o parâmetro através da rota da URL
   this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.PRONAC = params['PRONAC'];

        // Acessar API, passar dados para objeto.
        // Caso falha, this.router.navigate('falha/:idFalha')
      }
    );
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  onLoadProject(PRONAC: Number) {
    this.carregandoDados = true;

    this.apiService.getProjeto(String(PRONAC)).subscribe(
      projeto => {
        console.log(projeto);
        this.projeto = JSON.stringify(projeto);
      },
      err => {
        this.carregandoDados = false;
        this.router.navigate(['falha', err]);
      },
      () => this.carregandoDados = false);
  }

}
