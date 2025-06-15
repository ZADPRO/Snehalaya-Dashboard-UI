// IndivHeader.tsx
import React from 'react'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'

import './IndivHeader.css'
import { Bell } from 'lucide-react'

interface IndivHeaderProps {
  title: string
  subtitle: string
}

const IndivHeader: React.FC<IndivHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="flex justify-content-between py-3 px-5 headerIndiv">
      <div className="flex flex-column">
        <p className="text-lg font-bold pb-1">{title}</p>
        <p>{subtitle}</p>
      </div>
      <div className="flex align-items-center gap-3">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText placeholder="Search" className="w-25rem" />
        </IconField>
        <Bell style={{ height: '30px', width: '30px' }} />
      </div>
    </div>
  )
}

export default IndivHeader
