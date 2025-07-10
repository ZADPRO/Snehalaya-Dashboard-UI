import IndivHeader from '@renderer/components/IndivHeader/IndivHeader'
import { Avatar } from 'primereact/avatar'
import { Divider } from 'primereact/divider'
import React from 'react'

const Profile: React.FC = () => {
  return (
    <div className="h-full flex flex-column">
      <IndivHeader title="Profile" subtitle="Modify User Details" />
      <div
        className="flex flex-1 m-3 border-round-md shadow-1"
        style={{ height: 'calc(100% - 80px)' }}
      >
        <div
          className="flex flex-column px-3 my-3 border-round-md overflow-auto"
          style={{ width: '30%' }}
        >
          <div className="flex align-items-center w-full justify-content-center">
            <Avatar
              image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
              size="xlarge"
              shape="circle"
            />
          </div>
        </div>

        <Divider layout="vertical" />

        <div
          className="flex flex-column border-round-md p-3 overflow-auto"
          style={{ width: '70%' }}
        ></div>
      </div>
    </div>
  )
}

export default Profile
