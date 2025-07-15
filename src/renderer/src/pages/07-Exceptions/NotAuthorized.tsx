import React from 'react'
import './Exceptions.css'
import bgImage from '../../assets/exceptions/bg01.jpg'

const NotAuthorized: React.FC = () => {
  return (
    <div
      className="internetIssuePage"
      style={{
        backgroundImage: `url(${bgImage})`
      }}
    >
      <div className="content">
        <h1>No Internet Connection</h1>
        <br />
        <p>Please check your network and try again.</p>
      </div>
    </div>
  )
}

export default NotAuthorized
