import { Fornecedor } from './../models/fornecedor.model';
import { Incentivador } from './../models/incentivador.model';
import { NgModule, ModuleWithProviders  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../components/home/home.component';
import { ProjetosComponent } from '../components/projetos/projetos.component';
import { PropostasComponent } from '../components/propostas/propostas.component';
import { ProponentesComponent } from '../components/proponentes/proponentes.component';
import { IncentivadoresComponent } from '../components/incentivadores/incentivadores.component';
import { FornecedoresComponent } from '../components/fornecedores/fornecedores.component';
import { FalhaComponent } from '../components/falha/falha.component';
import { SobreComponent } from './../components/sobre/sobre.component';

const appRoutes: Routes = [
  {
    path: 'projetos/:PRONAC',
    component: ProjetosComponent,
    data: {
      meta: {
        title: 'Página de Projeto',
        description: 'Página de Projeto - Visualização SALIC'
      }
    }
  },
  {
    path: 'propostas/:idProposta',
    component: PropostasComponent,
    data: {
      meta: {
        title: 'Página de Proposta',
        description: 'Página de Proposta - Visualização SALIC'
      }
    }
  },
  {
    path: 'proponentes/:idProponente',
    component: ProponentesComponent,
    data: {
      meta: {
        title: 'Página de Proponente',
        description: 'Página de Proponente - Visualização SALIC'
      }
    }
  },
  {
    path: 'incentivadores/:idIncentivador',
    component: IncentivadoresComponent,
    data: {
      meta: {
        title: 'Página de Incentivador',
        description: 'Página de Incentivador - Visualização SALIC'
      }
    }
  },
  {
    path: 'fornecedores/:idFornecedor',
    component: FornecedoresComponent,
    data: {
      meta: {
        title: 'Página de Fornecedor',
        description: 'Página de Fornecedor - Visualização SALIC'
      }
    }
  },
  {
    path: 'falha/:statusFalha',
    component: FalhaComponent
  },
  {
    path: 'sobre', component: SobreComponent
  },
  {
    path: '', redirectTo: '/projetos', pathMatch: 'full' },
  {
    path: ':pesquisaPor',
    component: HomeComponent,
    data: {
      meta: {
        title: 'Página de Pesquisa',
        description: 'Página de Pesquisa - Visualização SALIC'
      }
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
