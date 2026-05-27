import { useState } from 'react'
import { clsx } from 'clsx'
import { Copy, Check, QrCode, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { CurrencyInput } from '../UI/CurrencyInput'
import { Toggle } from '../UI/Toggle'
import { formatCurrency } from '../../utils/formatters'
import { gerarPixPayload } from '../../utils/pixPayload'

const PIX_OBRA = 'pixcbnatal@comshalom.org'
const PIX_NECESSITADOS = 'seccomunitarianatal@comshalom.org'

const PixKey = ({ chave, valor = 0, label }) => {
  const [copiado, setCopiado] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const copiar = () => {
    navigator.clipboard.writeText(chave)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const payload = gerarPixPayload({
    chave,
    nome: 'Comunidade Shalom',
    cidade: 'Natal',
    valor,
  })

  return (
    <div className="mt-1.5">
      <div className="flex items-center gap-2">
        <button
          onClick={copiar}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors group"
        >
          {copiado
            ? <Check size={11} className="text-emerald-400 flex-shrink-0" />
            : <Copy size={11} className="flex-shrink-0 group-hover:text-slate-200" />
          }
          <span className={clsx('font-mono', copiado && 'text-emerald-400')}>
            {copiado ? 'Copiado!' : chave}
          </span>
        </button>

        <button
          onClick={() => setShowQR(v => !v)}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-400 transition-colors"
          title="Ver QR Code PIX"
        >
          <QrCode size={12} />
          <span>{showQR ? 'Fechar' : 'QR Code'}</span>
        </button>
      </div>

      {showQR && (
        <div className="mt-3 flex flex-col items-center gap-2 rounded-xl bg-white p-4 w-fit">
          <QRCodeSVG
            value={payload}
            size={180}
            bgColor="#ffffff"
            fgColor="#1F2937"
            level="M"
          />
          <p className="text-xs text-slate-600 font-medium text-center max-w-[180px]">
            {label}
            {valor > 0 && (
              <span className="block text-emerald-600 font-bold">{formatCurrency(valor)}</span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

export const Calculadora = () => {
  const [renda, setRenda] = useState(0)
  const [vinculo, setVinculo] = useState('oracao')
  const [usarLiquida, setUsarLiquida] = useState(false)
  const [rendaLiquida, setRendaLiquida] = useState(0)

  const percentual = vinculo === 'alianca' ? 0.15 : 0.10
  const base = usarLiquida ? rendaLiquida : renda
  const valor = base * percentual

  return (
    <div className="glass-card p-5 space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-200">💰 Calculadora de Comunhão de Bens</h3>
        <p className="text-xs text-slate-500 mt-0.5">O valor é calculado automaticamente conforme você digita</p>
      </div>

      <CurrencyInput
        label="Renda mensal bruta"
        value={renda}
        onChange={setRenda}
        placeholder="R$ 0,00"
      />

      <div>
        <label className="label-text">Tipo de vínculo</label>
        <select
          className="input-field"
          value={vinculo}
          onChange={(e) => setVinculo(e.target.value)}
        >
          <option value="oracao">Grupo de Oração (10%)</option>
          <option value="alianca">Comunidade de Aliança (15%)</option>
        </select>
      </div>

      <div className="space-y-3">
        <Toggle
          checked={usarLiquida}
          onChange={setUsarLiquida}
          label="Calcular sobre renda líquida"
          description="A Comunidade orienta sobre a renda bruta, mas o importante é a fidelidade do coração."
        />
        {usarLiquida && (
          <CurrencyInput
            label="Renda líquida (após descontos)"
            value={rendaLiquida}
            onChange={setRendaLiquida}
            placeholder="R$ 0,00"
          />
        )}
      </div>

      {base > 0 ? (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-300">Valor da Comunhão de Bens</span>
            <span className="text-2xl font-bold text-emerald-400">{formatCurrency(valor)}</span>
          </div>

          <div className="border-t border-emerald-500/20 pt-3 space-y-2">
            {vinculo === 'alianca' ? (
              <>
                <p className="text-xs text-slate-400 font-medium mb-2">Distribuição dos 15%:</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <span className="text-sm flex-shrink-0">🕊️</span>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-300">10% — Obra Shalom</span>
                        <span className="text-xs font-bold text-emerald-400">{formatCurrency(base * 0.10)}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Evangelização, centros e missões</p>
                      <PixKey chave={PIX_OBRA} valor={base * 0.10} label="10% — Obra Shalom" />
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm flex-shrink-0">🤝</span>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-300">5% — Necessitados e pobres</span>
                        <span className="text-xs font-bold text-yellow-400">{formatCurrency(base * 0.05)}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Necessitados da Comunidade e os pobres</p>
                      <PixKey chave={PIX_NECESSITADOS} valor={base * 0.05} label="5% — Necessitados" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-start gap-2">
                <span className="text-sm flex-shrink-0">🕊️</span>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Destinado à manutenção dos Centros de Evangelização, sustento missionário e ações evangelizadoras
                  </p>
                  <PixKey chave={PIX_OBRA} valor={valor} label="10% — Obra Shalom" />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-slate-800/60 border border-slate-700/30 p-4 text-center">
          <p className="text-sm text-slate-500">Digite sua renda para ver o valor calculado</p>
        </div>
      )}
    </div>
  )
}
