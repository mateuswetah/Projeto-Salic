import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { ApiService } from './../../services/api.service';

import { Produto } from './../../models/produto.model';
import { Fornecedor } from './../../models/fornecedor.model';

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
              private apiService: ApiService) { }

  ngOnInit() {
   // Obtêm o parâmetro através da rota da URL
   this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.idFornecedor = params['idFornecedor'];
        // Acessar API, passar dados para objeto.
        // Caso falha, this.router.navigate('falha/:idFalha')
      }
    );
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  onLoadFornecedor(idFornecedor: Number) {
    this.carregandoDados = true;

    this.apiService.getFornecedor(String(idFornecedor)).subscribe(
      fornecedor => {
        console.log(fornecedor);
        this.fornecedor = fornecedor;
      },
      err => {
        this.carregandoDados = false;
        this.router.navigate(['falha', err]);
      },
      () => this.carregandoDados = false);
  }

    onLoadProdutos(idFornecedor: Number) {
    this.carregandoDadosProdutos = true;

    this.apiService.getListaProdutosDoFornecedor(String(idFornecedor)).subscribe(
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
}
