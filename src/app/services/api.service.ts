import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { ConfigurationService } from './configuration.service';

import { Projeto } from './../models/projeto.model';

@Injectable()
export class ApiService {

  constructor(private http: Http,
              private configuration: ConfigurationService) { }

  // Projeto
  getProjeto(pronac: String): Observable<Projeto> {

    return this.http.get(this.configuration.ApiUrl + 'projetos/' + pronac + '/')
      .map((res: Response) => res.json())
      .catch((error: any) => this.handleError(error));

  }

  // Projetos
  getListaProjetos() {  }

  // Proposta
  getProposta() {  }

  // Propostas
  getListaPropostas() {  }

  // Proponente
  getProponente() {  }

  // Proponentes
  getListaProponente() {  }

  // Incentivador
  getIncentivador() {  }

  // Incentivadores
  getListaIncentivadores() {  }

  // Fornecedor
  getFornecedor() {  }

  // Incentivadores
  getListaFornecedores() {  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.status);
  }

}
