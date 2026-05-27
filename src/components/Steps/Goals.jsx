import { GoalTracker } from '../Features/GoalTracker'

export const Goals = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white">Metas financeiras</h2>
        <p className="text-slate-400 mt-1">Acompanhe seu progresso em direção aos seus objetivos</p>
      </div>

      <GoalTracker />
    </div>
  )
}
