export class Proponente {

  constructor ( public nome:          String,
                public cgccpf:        String,
                public _links:        {
                              'self': String,
                          'projetos': String
                                      },
                public tipoPessoa:   String,
                public responsavel:   String,
                public UF:            String,
                public totalCaptado: String,
                public municipio:     String) {}

}
