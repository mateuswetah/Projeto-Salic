import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './modules/app.rounting.module';
import { RouteReuseStrategy } from '@angular/router';

// Modules de terceiros
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { ShareButtonsModule } from 'ng2-sharebuttons';
import { MetaModule, MetaConfig, MetaService } from 'ng2-meta';

// Components do App
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ProjetosComponent } from './components/projetos/projetos.component';
import { PropostasComponent } from './components/propostas/propostas.component';
import { ProponentesComponent } from './components/proponentes/proponentes.component';
import { IncentivadoresComponent } from './components/incentivadores/incentivadores.component';
import { FornecedoresComponent } from './components/fornecedores/fornecedores.component';
import { FalhaComponent } from './components/falha/falha.component';

// Services do App
import { ApiService } from './services/api.service';
import { ConfigurationService } from './services/configuration.service';
import { DataFormatterService } from './services/data-formatter.service';

import { CustomReuseStrategy } from './services/route-reuse.strategy';

// Padrão de Meta-tag para as páginas que não possuírem estes dados especificados.
const metaConfig: MetaConfig = {
  useTitleSuffix: true, // Faz com que todas as páginas do site tenham este sufixo.
  defaults: {
    title: 'Projeto de Visualização do SALIC',
    titleSuffix: ' | Projeto Visualização SALIC'
    //,
    //'og:image': 'http://example.com/default-image.png',
  }
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProjetosComponent,
    PropostasComponent,
    ProponentesComponent,
    IncentivadoresComponent,
    FornecedoresComponent,
    FalhaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    //InfiniteScrollModule,
    ShareButtonsModule,
    MetaModule.forRoot(metaConfig)
  ],
  providers: [
    ApiService,
    ConfigurationService,
    DataFormatterService,
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
