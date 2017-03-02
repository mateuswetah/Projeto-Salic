import { Injectable } from '@angular/core';

@Injectable()
export class ConfigurationService {

   public ApiUrl: String = '//hmg.api.salic.cultura.gov.br/beta/';
   public limitResultados = 15;
}
