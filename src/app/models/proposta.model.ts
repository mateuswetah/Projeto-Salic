export class Proposta {

  constructor ( public id:                    String,
                public nome:                  String,
                public mecanismo:             String,
                public dataAceite:           String,
                public dataInicio:           String,
                public dataTermino:          String,
                public dataArquivamento:     String,
                public acessibilidade:        String,
                public objetivos:             String,
                public justificativa:         String,
                public etapa:                 String,
                public fichaTecnica:         String,
                public impactoAmbiental:     String,
                public especificacaoTecnica: String,
                public estrategiaExecucao:   String,
                public providencia:           String,
                public democratizacao:        String,
                public sinopse:               String,
                public resumo:                String,
                public isResumoEscondido: Boolean ) {
                  this.isResumoEscondido = true;
                }

}
