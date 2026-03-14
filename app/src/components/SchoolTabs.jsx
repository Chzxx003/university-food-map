import { useApp } from '../context/AppContext'
import { GraduationCap } from 'lucide-react'

export default function SchoolTabs() {
  const { schools, selectedSchool, setSelectedSchool } = useApp()

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {schools.map(school => (
        <button
          key={school.id}
          onClick={() => setSelectedSchool(school)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
            selectedSchool.id === school.id
              ? 'glass-strong text-primary font-semibold shadow-sm'
              : 'glass-subtle text-text-secondary'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          {school.name}
        </button>
      ))}
    </div>
  )
}
