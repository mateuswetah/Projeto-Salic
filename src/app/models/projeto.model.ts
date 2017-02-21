export class Projeto {

  constructor ( public nome:            String,
                public PRONAC:          String,
                public area:            String,
                public proponente:      String,
                public cgccpf:          String,
                public valorAprovado:   String,
                public valorSolicitado: String,
                public segmento:        String,
                public dataInicio:      String,
                public dataTermino:     String,
                public UF:              String,
                public municipio:       String,
                public situacao:        String,
                public resumo:          String,
                public objetivos:       String,
                public justificativa:   String) {}

    // Informações restantes provenientes da API
    //    var etapa:                  String
    //    var providencia:            String
    //    var enquadramento:          String
    //    var fichaTecnica:           String
    //    var outrasFontes:           Int
    //    var acessibilidade:         String
    //    var sinopse:                String
    //    var estrategiaExecucao:     String
    //    var especificacaoTecnica:   String
    //    var impactoAmbiental:       String
    //    var democratizacao:         String
    //    var valorProjeto:           Int
    //    var anoProjeto:             String
    //    var valorCaptado:           Int
    //    var valorProposto:          Int
}
