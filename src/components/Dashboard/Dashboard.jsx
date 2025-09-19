import React, { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase' // Import auth from your firebase file
import './Dashboard.css'
import Header from '../Header/Header'
import ComplaintSection from '../ComplaintSection/ComplaintSection'

const Dashboard = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  // Use the user's display name, or fall back to email if not set
  const userName = user ? user.displayName || user.email.split('@')[0] : 'Guest'

  return (
    <div className="dashboard-container">
      <Header userName={userName} />
      <main className="dashboard-content">
        {/* Submit a Complaint Section */}
        <ComplaintSection
          title="Submit the complaint"
          buttonText="Raise Complaint"
          action={() => alert('Navigate to complaint form')}
        />

        {/* Services/सेवा Section */}
        <h2 className="services-heading">Services/सेवा</h2>
        <div className="services-list">
          <ComplaintSection
            title="Track the complaint"
            isActionable={true}
            action={() => alert('Navigate to complaint tracking page')}
          />
          <ComplaintSection
            title="My Reported Issues"
            isActionable={true}
            action={() => alert('Navigate to list of reported issues')}
          />
          <ComplaintSection
            title="Resolved Complaints"
            isActionable={true}
            action={() => alert('Navigate to resolved complaints page')}
          />
        </div>
      </main>
    </div>
  )
}

export default Dashboard
