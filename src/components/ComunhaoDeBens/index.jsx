import { useComunhaoBens } from '../../hooks/useComunhaoBens'
import { Config } from './Config'
import { Calculadora } from './Calculadora'
import { Historico } from './Historico'
import { Formacao } from './Formacao'
import { Lembrete } from './Lembrete'

export const ComunhaoDeBens = () => {
  const {
    config,
    historico,
    loadingConfig,
    loadingHistorico,
    saving,
    saveConfig,
    addDevolucao,
    deleteDevolucao,
  } = useComunhaoBens()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white">Comunhão de Bens</h2>
        <p className="text-slate-400 mt-1">
          Partilha financeira como ato de fé — Comunidade Católica Shalom
        </p>
      </div>

      {/* Módulo 0 — Configuração N8N (novo) */}
      <section>
        <Config
          config={config}
          loadingConfig={loadingConfig}
          saving={saving}
          saveConfig={saveConfig}
        />
      </section>

      {/* Módulo 1 — Calculadora rápida (sem autenticação) */}
      <section>
        <Calculadora />
      </section>

      {/* Módulo 2 — Histórico */}
      <section>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">📋 Histórico de Devoluções</h3>
          <p className="text-xs text-slate-500 mt-0.5">Acompanhe sua fidelidade mês a mês</p>
        </div>
        <Historico
          historico={historico}
          loadingHistorico={loadingHistorico}
          saving={saving}
          addDevolucao={addDevolucao}
          deleteDevolucao={deleteDevolucao}
          config={config}
        />
      </section>

      {/* Módulo 3 — Formação */}
      <section>
        <Formacao />
      </section>

      {/* Módulo 4 — Lembrete no navegador */}
      <section>
        <Lembrete
          config={config}
          saving={saving}
          saveConfig={saveConfig}
        />
      </section>
    </div>
  )
}
