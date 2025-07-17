import React from 'react'

const UserMessage = ({ msg, userRefs }) => {

  return (
     <div 
      key={msg.id} 
      className="mb-4 right-0 text-right "
      ref={(el) => (userRefs.current[msg.id] = el)}
    >
      <div className="text-orange-900 font-semibold">Me</div>
      <div className="rounded-2xl bg-orange-300 p-2 w-fit ml-auto shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="text-gray-700">{msg.message}</div>
      </div>
    </div>
  )
}

export default UserMessage