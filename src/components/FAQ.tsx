import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { EventConfig } from '../types/index.ts';

interface FAQProps {
  config: EventConfig;
}

export const FAQ: React.FC<FAQProps> = ({ config }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const feeAmount = config.earlyBirdFee || 10;

  const questions = [
    {
      q: `Para que serve a taxa de R$ ${feeAmount.toFixed(2).replace('.', ',')} na inscrição antecipada?`,
      a: `A corrida na rua é livre e aberta para celebrar com a galera! Os R$ ${feeAmount.toFixed(2).replace('.', ',')} da inscrição antecipada pelo site servem para custear e garantir os seus benefícios exclusivos no evento: lata de Monster Energy Drink no início, participação nos 5 sorteios de aniversário, hidratação e número de peito.`,
    },
    {
      q: 'Como faço para concluir minha inscrição pelo celular?',
      a: 'Basta preencher seu Nome Completo e CPF (e-mail e telefone são opcionais). Ao tocar em continuar, você verá o QR Code Pix de R$ 10,00 e será direcionado automaticamente para o WhatsApp da Eco Arena com sua mensagem pronta.',
    },
    {
      q: 'Qual é a data, horário e distância do Corre de Sexta?',
      a: 'O evento acontece na sexta-feira, 20/11 às 19h, com concentração na Porta da Eco Arena - Massagueira. O percurso tem distância única de 5 Km.',
    },
    {
      q: 'Quais são as atrações e prêmios dos sorteios?',
      a: 'Teremos Jó & Deyvisson + Paredão Confirmado puxando a corrida, Monster Energy Drink na largada e 5 sorteios especiais (planos de treino na Eco Arena, Whey, Creatina e avaliações físicas).',
    },
  ];

  return (
    <section id="faq" className="w-full max-w-full overflow-x-hidden py-8 sm:py-12 bg-white text-slate-800 relative border-t border-slate-200/70">
      <div className="w-full max-w-lg sm:max-w-2xl mx-auto px-3.5 sm:px-6 space-y-5 min-w-0">
        <div className="space-y-1 text-left sm:text-center">
          <div className="inline-flex items-center gap-1.5 text-emerald-700 text-[11px] font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tire suas Dúvidas</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 font-heading">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="space-y-2">
          {questions.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 border border-slate-200/80 rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-3.5 py-3 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/70 transition-colors"
                >
                  <span className="font-semibold text-xs sm:text-sm text-slate-900">
                    {item.q}
                  </span>
                  <span className="p-1 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-2.5 bg-white">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Soft WhatsApp Contact Card */}
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900">
              Quer falar direto com a equipe da Eco Arena?
            </h3>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Tire dúvidas ou envie seu comprovante de inscrição direto pelo WhatsApp.
            </p>
          </div>
          <a
            href={`https://wa.me/55${config.whatsAppNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
              'Olá, Equipe Eco Arena! Gostaria de tirar uma dúvida sobre o Corre de Sexta (20/11 às 19h).'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs shrink-0 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Falar no WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
