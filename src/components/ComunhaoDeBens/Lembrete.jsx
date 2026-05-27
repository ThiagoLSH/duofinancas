import { useState } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { Toggle } from '../UI/Toggle'
import { Button } from '../UI/Button'

// Lembrete lê dia_lembrete e lembrete_browser do config (Supabase).
// Alterações são persistidas via saveConfig.

export const Lembrete = ({ config, saving, saveConfig }) => {
  const [localDia, setLocalDia] = useState(config?.dia_lembrete ?? 5)
  const [salvando, setSalvando] = useState(false)

  // Sincroniza o dia local quando o config chegar
  const dia = config?.dia_lembrete ?? localDia
  const ativo = config?.lembrete_browser ?? false

  const diasRestantes = () => {
    const diaHoje = new Date().getDate()
    return dia - diaHoje
  }

  const diff = diasRestantes()
  const showBanner = ativo && diff >= 0 && diff <= 3

  const requestNotification = async () => {
    if (typeof Notification === 'undefined') return 'denied'
    return Notification.requestPermission()
  }

  const handleToggle = async (valor) => {
    if (valor && typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
      const perm = await requestNotification()
      if (perm === 'granted') {
        new Notification('DuoFinanças — Comunhão de Bens', {
          body: 'Lembrete ativado! Você será notificado próximo ao dia configurado.',
          icon: '/favicon.ico',
        })
      }
    }
    if (config) {
      await saveConfig({ ...config, lembrete_browser: valor })
    }
  }

  const handleSaveDia = async () => {
    setSalvando(true)
    try {
      if (config) {
        await saveConfig({ ...config, dia_lembrete: localDia })
      }
    } finally {
      setSalvando(false)
    }
  }

  const permissao = typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  const diasArray = Array.from({ length: 28 }, (_, i) => i + 1)

  return (
    <div className="space-y-4">
      {/* Banner de alerta */}
      {showBanner && (
        <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/30 p-4 flex items-start gap-3">
          <Bell size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-300">
              {diff === 0
                ? 'Sua Comunhão de Bens é hoje!'
                : `Faltam ${diff} dia${diff > 1 ? 's' : ''} para sua Comunhão de Bens`}
            </p>
            <p className="text-xs text-yellow-400/70 mt-0.5">
              Sua Comunhão de Bens deste mês ainda está pendente. Lembre-se: devolver é um ato de fé e gratidão!
            </p>
          </div>
        </div>
      )}

      <div className="glass-card p-5 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-slate-200">🔔 Lembrete no Navegador</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Notificação local — o dia e o WhatsApp são configurados na seção acima
          </p>
        </div>

        <Toggle
          checked={ativo}
          onChange={handleToggle}
          label="Ativar lembrete mensal no navegador"
          description={
            permissao === 'denied'
              ? 'Permissão de notificação negada. Verifique as configurações do navegador.'
              : permissao === 'granted'
              ? 'Notificações do navegador habilitadas'
              : 'Será solicitada permissão para notificações'
          }
        />

        {ativo && (
          <div className="space-y-4 pt-1">
            <div>
              <label className="label-text">Dia do mês para o lembrete</label>
              <div className="grid grid-cols-7 gap-1.5 mt-2">
                {diasArray.map((d) => (
                  <button
                    key={d}
                    onClick={() => setLocalDia(d)}
                    className={
                      localDia === d
                        ? 'rounded-lg py-2 text-xs font-bold bg-emerald-500 text-white'
                        : 'rounded-lg py-2 text-xs font-medium bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors'
                    }
                  >
                    {d}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                O lembrete aparecerá 3 dias antes e no próprio dia {localDia} de cada mês
              </p>
            </div>

            <Button
              onClick={handleSaveDia}
              size="sm"
              variant="secondary"
              loading={salvando || saving}
            >
              {salvando ? 'Salvo!' : 'Salvar dia'}
            </Button>
          </div>
        )}

        {!ativo && (
          <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 border border-slate-700/30 p-3">
            <BellOff size={16} className="text-slate-500 flex-shrink-0" />
            <p className="text-xs text-slate-500">
              Ative para receber notificação no navegador próximo ao dia configurado
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
