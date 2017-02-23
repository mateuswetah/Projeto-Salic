import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, URLSearchParams, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { ConfigurationService } from './configuration.service';

import { Projeto } from './../models/projeto.model';
import { Proposta } from './../models/proposta.model';
import { Proponente } from './../models/proponente.model';
import { Incentivador } from './../models/incentivador.model';
import { Fornecedor } from './../models/fornecedor.model';

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
  getListaProjetos(queries: { [query: string]: String; } ): Observable<[Projeto]> {
    const searchParams = this.serializeQueries(queries);
    return this.http.get(this.configuration.ApiUrl + 'projetos/', { search: searchParams })
      .map((res: Response) => res.json()._embedded.projetos)
      .catch((error: any) => this.handleError(error));
   }

  // Proposta
  getProposta(id: String): Observable<Proposta> {
    return this.http.get(this.configuration.ApiUrl + 'propostas/' + id + '/')
      .map((res: Response) => res.json())
      .catch((error: any) => this.handleError(error));
  }

  // Propostas
  getListaPropostas( queries: { [query: string]: String; } ): Observable<[Proposta]> {
    const searchParams = this.serializeQueries(queries);
    return this.http.get(this.configuration.ApiUrl + 'propostas/', { search: searchParams })
      .map((res: Response) => res.json()._embedded.propostas)
      .catch((error: any) => this.handleError(error));
  }

  // Proponente
  getProponente() {  }

  // Proponentes
  getListaProponentes(queries: { [query: string]: String; } ): Observable<[Proponente]> {
    const searchParams = this.serializeQueries(queries);
    return this.http.get(this.configuration.ApiUrl + 'proponentes/', { search: searchParams })
      .map((res: Response) => res.json()._embedded.proponentes)
      .catch((error: any) => this.handleError(error));
  }

  // Incentivador
  getIncentivador() {  }

  // Incentivadores
  getListaIncentivadores(queries: { [query: string]: String; } ): Observable<[Incentivador]> {
    const searchParams = this.serializeQueries(queries);
    return this.http.get(this.configuration.ApiUrl + 'incentivadores/', { search: searchParams })
      .map((res: Response) => res.json()._embedded.incentivadores)
      .catch((error: any) => this.handleError(error));
  }

  // Fornecedor
  getFornecedor() {  }

  // Incentivadores
  getListaFornecedores(queries: { [query: string]: String; } ): Observable<[Fornecedor]> {
    const searchParams = this.serializeQueries(queries);
    return this.http.get(this.configuration.ApiUrl + 'fornecedores/', { search: searchParams })
      .map((res: Response) => res.json()._embedded.fornecedores)
      .catch((error: any) => this.handleError(error));
  }

  // Trata o casos de falha baseado no código de erro
  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.status);
  }

  // Converte queries de uma hash de parâmetros em uma URLSearchParam
  private serializeQueries(obj: any): URLSearchParams {
    const params: URLSearchParams = new URLSearchParams();

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const element = obj[key];
            params.set(key, element);
        }
    }

    return params;
}

}
