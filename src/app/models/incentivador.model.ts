export class Incentivador {

  constructor ( public nome:        String,
                public cgccpf:      String,
                public totalDoado: String,
                public _links:      {
                         'doacoes': String,
                            'self': String
                                    },
                public tipoPessoa: String,
                public responsavel: String,
                public UF:          String,
                public municipio:   String) {}
}
