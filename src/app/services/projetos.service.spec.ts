/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProjetosService } from './projetos.service';

describe('ProjetosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjetosService]
    });
  });

  it('should ...', inject([ProjetosService], (service: ProjetosService) => {
    expect(service).toBeTruthy();
  }));
});
