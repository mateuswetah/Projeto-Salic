import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ProjetosComponent } from './components/projetos/projetos.component';
import { PropostasComponent } from './components/propostas/propostas.component';
import { ProponentesComponent } from './components/proponentes/proponentes.component';
import { IncentivadoresComponent } from './components/incentivadores/incentivadores.component';
import { FornecedoresComponent } from './components/fornecedores/fornecedores.component';
import { FalhaComponent } from './components/falha/falha.component';

const APP_ROUTES: Routes = [
  { path: 'projetos/:PRONAC', component: ProjetosComponent},
  { path: 'propostas', component: PropostasComponent},
  { path: 'proponentes', component: ProponentesComponent},
  { path: 'incentivadores', component: IncentivadoresComponent},
  { path: 'fornecedores', component: FornecedoresComponent},
  { path: 'falha/:id', component: FalhaComponent},
  { path: '', component: HomeComponent },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);