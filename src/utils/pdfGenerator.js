import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { formatCurrency, GOAL_LABELS, TIMEFRAME_LABELS } from './formatters'
import {
  calcTotalIncome,
  calcFixedExpenses,
  calcVariableExpenses,
  calcFreeBalance,
  calcCommittedPercent,
  getFinancialHealth,
} from './calculations'

export const exportDashboardPDF = async (elementId, plan, expenses) => {
  try {
    const element = document.getElementById(elementId)
    if (!element) throw new Error('Elemento não encontrado')

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#0F172A',
      useCORS: true,
      logging: false,
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Header
    pdf.setFillColor(15, 23, 42)
    pdf.rect(0, 0, pageWidth, pageHeight, 'F')

    pdf.setTextColor(16, 185, 129)
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('DuoFinanças', 10, 15)

    pdf.setTextColor(148, 163, 184)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Suas finanças em sintonia', 10, 22)
    pdf.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - 10, 22, { align: 'right' })

    // KPIs resumo
    const totalIncome = calcTotalIncome(plan)
    const fixed = calcFixedExpenses(expenses)
    const variable = calcVariableExpenses(expenses)
    const free = calcFreeBalance(plan, expenses)
    const pct = calcCommittedPercent(plan, expenses)
    const health = getFinancialHealth(pct)

    pdf.setTextColor(241, 245, 249)
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Resumo Financeiro', 10, 32)

    const kpis = [
      ['Renda Total', formatCurrency(totalIncome)],
      ['Despesas Fixas', formatCurrency(fixed)],
      ['Despesas Variáveis', formatCurrency(variable)],
      ['Saldo Livre', formatCurrency(free)],
      ['% Comprometida', `${pct.toFixed(1)}% (${health.label})`],
    ]

    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    kpis.forEach(([label, value], i) => {
      const x = 10 + (i % 3) * 65
      const y = 40 + Math.floor(i / 3) * 12
      pdf.setTextColor(148, 163, 184)
      pdf.text(label, x, y)
      pdf.setTextColor(241, 245, 249)
      pdf.text(value, x, y + 5)
    })

    if (plan.main_goal) {
      pdf.setFontSize(9)
      pdf.setTextColor(148, 163, 184)
      pdf.text(`Objetivo: ${GOAL_LABELS[plan.main_goal] || plan.main_goal}`, 10, 62)
      if (plan.goal_timeframe) {
        pdf.text(`Prazo: ${TIMEFRAME_LABELS[plan.goal_timeframe] || plan.goal_timeframe}`, 80, 62)
      }
      if (plan.goal_target_value) {
        pdf.text(`Meta: ${formatCurrency(plan.goal_target_value)}`, 140, 62)
      }
    }

    // Dashboard screenshot
    const yOffset = 70
    const availableHeight = pageHeight - yOffset - 10
    const scaledHeight = Math.min(imgHeight, availableHeight)

    pdf.addImage(imgData, 'PNG', 10, yOffset, imgWidth, scaledHeight)

    pdf.save(`duofinancas-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`)
    return true
  } catch (err) {
    console.error('Erro ao exportar PDF:', err)
    throw err
  }
}
