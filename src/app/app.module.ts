import { PaginationService } from './services/pagination.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './modules/app.rounting.module';
import { RouteReuseStrategy } from '@angular/router';

// Modules de terceiros
import { ShareButtonsModule } from 'ng2-sharebuttons';
import { MetaModule,  MetaLoader, MetaStaticLoader, PageTitlePositioning } from '@nglibs/meta';
import { AlertModule, DropdownModule, ButtonsModule, CollapseModule, PaginationModule, PopoverModule, AccordionModule } from 'ng2-bootstrap/';

// Components de Terceiros
import { FadingCircleComponent } from 'ng2-spin-kit/app/spinner/fading-circle';

// Components do App
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { BuscaComponent } from './components/busca/busca.component';
import { ProjetosComponent } from './components/projetos/projetos.component';
import { PropostasComponent } from './components/propostas/propostas.component';
import { ProponentesComponent } from './components/proponentes/proponentes.component';
import { IncentivadoresComponent } from './components/incentivadores/incentivadores.component';
import { FornecedoresComponent } from './components/fornecedores/fornecedores.component';
import { FalhaComponent } from './components/falha/falha.component';
import { SobreComponent } from './components/sobre/sobre.component';

// Services do App
import { ApiService } from './services/api.service';
import { ConfigurationService } from './services/configuration.service';
import { DataFormatterService } from './services/data-formatter.service';

import { CustomReuseStrategy } from './services/route-reuse.strategy';

export function metaFactory(): MetaLoader {
  return new MetaStaticLoader({
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' | ',
    applicationName: 'Visualização SALIC',
    defaults: {
      title: 'Visualização e Consulta SALIC',
      description: `Visualização e Consulta de Projetos 
                    submetidos aos Sistema de Apoio às 
                    Leis de Incentivo à Cultura.`,
      'og:type': 'website',
      'og:locale': 'pt-BR'
    }
  });
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BuscaComponent,
    ProjetosComponent,
    PropostasComponent,
    ProponentesComponent,
    IncentivadoresComponent,
    FornecedoresComponent,
    FalhaComponent,
    SobreComponent,
    FadingCircleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ShareButtonsModule.forRoot(),
    MetaModule.forRoot({
      provide: MetaLoader,
      useFactory: (metaFactory)
    }),
    AlertModule.forRoot(),
    DropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    AccordionModule.forRoot()
  ],
  providers: [
    ApiService,
    ConfigurationService,
    DataFormatterService,
    PaginationService,
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
