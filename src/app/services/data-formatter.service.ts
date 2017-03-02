import { Injectable } from '@angular/core';

@Injectable()
export class DataFormatterService {

  extraiIdDaUrl(url: string): String {
    return url.substr(url.lastIndexOf('/') + 1);
  }

  formataData(data: String): String {

    const dataSplit = data.split('-');

    if (dataSplit.length !== 3) {
      return data;
    } else {
      return dataSplit[2] + '/' +
             dataSplit[1] + '/' +
             dataSplit[0];
    }
  }

  formataDataExtenso(data: String): String {

    const dataSplit = data.split('-');

    if (dataSplit.length !== 3) {
      return data;
    } else {
      return this.obterDiaExtenso(dataSplit[2]) + ' de ' +
             this.obterMesExtenso(dataSplit[1]) + ' de ' +
             dataSplit[0];
    }
  }

  obterMesExtenso (mesNum: String): String {
    switch (mesNum) {
      case '01':
      return 'Janeiro';
      case '02':
      return 'Fevereiro';
      case '03':
      return 'Março';
      case '04':
      return 'Abril';
      case '05':
      return 'Maio';
      case '06':
      return 'Junho';
      case '07':
      return 'Julho';
      case '08':
      return 'Agosto';
      case '09':
      return 'Setembro';
      case '10':
      return 'Outubro';
      case '11':
      return 'Novembro';
      case '12':
      return 'Dezembro';
      default:
      return 'Mês não informado';
    }
  }

  obterDiaExtenso(diaNum: String): String {
    if (diaNum[0] === '0') {
      if (diaNum[1] === '1') {
        return '1º';
      } else {
        return diaNum[1];
      }
    } else {
      return diaNum;
    }
  }

  formataValorEmReais(valor: String): String {
    const valorNum = Number(valor);
    return valorNum.toLocaleString('pt-BR',  { style: 'currency', currency: 'BRL' });
  }

  constructor() { }

}
