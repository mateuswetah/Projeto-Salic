export class Projeto {

  constructor ( public PRONAC:          String,
                public anoProjeto:      String,
                public nome:            String,
                public cgccpf:          String,
                public proponente:      String,
                public segmento:        String,
                public area:            String,
                public UF:              String,
                public municipio:       String,
                public dataInicio:      String,
                public dataTermino:     String,
                public situacao:        String,
                public mecanismo:       String,
                public enquadramento:         String,
                public valorProjeto:          String,
                public outrasFontes:          String,
                public valorCaptado:          String,
                public valorProposta:         String,
                public valorSolicitado:       String,
                public valorAprovado:         String,
                public acessibilidade:        String,
                public objetivos:             String,
                public justificativa:         String,
                public etapa:                 String,
                public ficha_tecnica:         String,
                public impactoAmbiental:     String,
                public especificacaoTecnica: String,
                public estrategiaExecucao:   String,
                public providencia:           String,
                public democratizacao:        String,
                public sinopse:               String,
                public resumo:                String,
                public marcasAnexadas:       {

                                              },
                public divulgacao:            {
                                      'peca': String,
                                   'veiculo': String
                                              },
                public relatorioFisico:      {

                                              },
                public relacaoPagamentos:    {

                                              },
                public certidoesNegativas:   {

                                              },
                public readequacoes:          {
                                   'pedidos': {},
                                 'pareceres': {},
                                              },
                public documentosAnexados:   {

                                              },
                public prorrogacao:           {

                                              },
                public captacoes:             {
                                    'PRONAC': String,
                                     'valor': String,
                               'data_recibo': String,
                                    'cgccpf': String,
                               'nome_doador': String
                                              } ) {}
}
