export class Produto {

  constructor ( public idPlanilhaAprovacao: String,
                public justificativa:         String,
                public dataPagamento:        String,
                public nome:                  String,
                public cgccpf:                String,
                public tipoFormaPagamento:  String,
                public dataAprovacao:        String,
                public valorPagamento:       String,
                public _links:                {
                                   'projeto': String,
                                'fornecedor': String
                                              },
                public idArquivo:            String,
                public nrComprovante:        String,
                public nomeFornecedor:       String,
                public idComprovantePagamento: String,
                public tipoDocumento:        String,
                public nrDocumentoPagamento:    String,
                public nmArquivo:            String,
                public PRONAC:                String,  
                public isJustificativaEscondida: Boolean ) {
                  this.isJustificativaEscondida = true;
                }
}
