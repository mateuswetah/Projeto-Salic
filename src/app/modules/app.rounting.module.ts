import { NgModule, ModuleWithProviders  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../components/home/home.component';
import { ProjetosComponent } from '../components/projetos/projetos.component';
import { PropostasComponent } from '../components/propostas/propostas.component';
import { ProponentesComponent } from '../components/proponentes/proponentes.component';
import { IncentivadoresComponent } from '../components/incentivadores/incentivadores.component';
import { FornecedoresComponent } from '../components/fornecedores/fornecedores.component';
import { FalhaComponent } from '../components/falha/falha.component';

const appRoutes: Routes = [
  { path: 'projetos/:PRONAC', component: ProjetosComponent},
  { path: 'propostas', component: PropostasComponent},
  { path: 'proponentes', component: ProponentesComponent},
  { path: 'incentivadores', component: IncentivadoresComponent},
  { path: 'fornecedores', component: FornecedoresComponent},
  { path: 'falha/:statusFalha', component: FalhaComponent},
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
