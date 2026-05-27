import { useState } from 'react'
import { Download, Loader } from 'lucide-react'
import { Button } from '../UI/Button'
import { exportDashboardPDF } from '../../utils/pdfGenerator'
import { useFinanceContext } from '../../context/FinanceContext'

export const PdfExport = () => {
  const { plan, expenses, showToast } = useFinanceContext()
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      await exportDashboardPDF('dashboard-export', plan, expenses)
      showToast('PDF exportado com sucesso!')
    } catch {
      showToast('Erro ao gerar PDF. Tente novamente.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      loading={loading}
      className="w-full"
    >
      <Download size={16} />
      Exportar PDF do plano
    </Button>
  )
}
