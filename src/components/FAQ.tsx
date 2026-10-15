import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { EventConfig } from '../types/index.ts';

interface FAQProps {
  config: EventConfig;
}

export const FAQ: React.FC<FAQProps> = ({ config }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const questions = [
    {
      q: 'Como funciona a taxa de R$ 5,00 para os 100 primeiros inscritos?',
      a: `Para valorizar e incentivar a galera que confirma presença antecipadamente, os primeiros 100 inscritos garantem a vaga com a taxa promocional de apenas R$ ${config.earlyBirdFee.toFixed(2).replace('.', ',')}. Esse valor simbólico cobre a confecção do seu número de peito, hidratação no percurso e medalha finisher exclusiva!`,
    },
    {
      q: 'Como e para onde envio o comprovante do Pix?',
      a: `O número do Pix é exatamente o mesmo número do WhatsApp oficial da Equarena (${config.whatsAppNumber}). Assim que você preenche o formulário nesta página, surge um botão 'Enviar Comprovante no WhatsApp' com sua mensagem já digitada contendo seu Nome, CPF e Código de Inscrição. Você só precisa anexar a foto ou PDF do comprovante no WhatsApp!`,
    },
    {
      q: 'O que está incluso na minha inscrição?',
      a: 'Sua inscrição dá direito a: número de peito com chip de cronometragem, alfinetes, camiseta oficial dry-fit, hidratação gelada durante o percurso, mesa de frutas e isotônico pós-prova, seguro atleta e medalha de conclusão para quem cruzar a linha de chegada.',
    },
    {
      q: 'Não sou corredor profissional, posso participar?',
      a: 'Com certeza! A Corrida Equarena conta com o percurso de 3 km Caminhada da Família e 5 km Corrida, acessíveis para todas as idades, ritmos e condicionamentos. O importante é celebrar o movimento e cruzar o portal de chegada com energia!',
    },
    {
      q: 'Como sei se minha inscrição foi confirmada?',
      a: 'Após enviar o comprovante via WhatsApp, nossa equipe valida seu pagamento e envia a confirmação definitiva. Você também pode consultar sua inscrição a qualquer momento no botão "Consultar Inscrição" no topo desta página usando seu CPF.',
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white text-slate-900 relative border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-sm">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            Tire suas Dúvidas
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase font-heading tracking-tight text-slate-900">
            PERGUNTAS FREQUENTES
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Tudo o que você precisa saber sobre a inscrição, pagamento Pix e o dia da corrida.
          </p>
        </div>

        <div className="space-y-4">
          {questions.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900">
                    {item.q}
                  </span>
                  <span className="p-1 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-4 bg-white">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
          <div className="space-y-1">
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              Ainda tem dúvidas ou quer ajuda com a inscrição?
            </h3>
            <p className="text-xs text-slate-600">
              Fale direto com a coordenação da Equarena pelo WhatsApp.
            </p>
          </div>
          <a
            href={`https://wa.me/55${config.whatsAppNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
              'Olá, Equipe Equarena! Tenho uma dúvida sobre a corrida.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 shrink-0 transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Chamar no WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
