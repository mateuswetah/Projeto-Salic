import { NgModule, ModuleWithProviders  } from '@angular/core';
import { MetaModule, MetaConfig, MetaService } from 'ng2-meta';

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
  imports: [MetaModule.forRoot(metaConfig)],
  exports: [MetaModule]
})
export class AppMetaTaggingModule {}