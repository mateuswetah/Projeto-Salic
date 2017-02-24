import { Injectable } from '@angular/core';

@Injectable()
export class DataFormatterService {

  extractIdFromUrl(url: string): String {
    return url.substr(url.lastIndexOf('/') + 1);
  }

  constructor() { }

}
