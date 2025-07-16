import React from 'react';

const SettingsOverview: React.FC = () => {
    return (
        <div>

        </div>
    );
};

export default SettingsOverview;
// import React, { useEffect, useState } from 'react'
// import { Card } from 'primereact/card'
// import { Avatar } from 'primereact/avatar'
// import { Tag } from 'primereact/tag'
// import { Divider } from 'primereact/divider'
// import { PrimeIcons } from 'primereact/api'
// import 'primereact/resources/themes/lara-light-indigo/theme.css' // or your preferred theme
// import 'primereact/resources/primereact.min.css'

// const SettingsOverview: React.FC = () => {
//   const [stats, setStats] = useState({
//     categories: 12,
//     subCategories: 24,
//     branches: 6,
//     suppliers: 18,
//     userRoles: 5,
//     productAttributes: 40,
//     categoryAttributes: 15,
//     employees: 50
//   })

//   const cards = [
//     { label: 'Categories', icon: PrimeIcons.TAGS, value: stats.categories },
//     { label: 'Sub Categories', icon: PrimeIcons.FOLDER_OPEN, value: stats.subCategories },
//     { label: 'Branches', icon: PrimeIcons.MAP_MARKER, value: stats.branches },
//     { label: 'Suppliers', icon: PrimeIcons.TRUCK, value: stats.suppliers },
//     { label: 'User Roles', icon: PrimeIcons.USERS, value: stats.userRoles },
//     { label: 'Product Attributes', icon: PrimeIcons.COG, value: stats.productAttributes },
//     { label: 'Category Attributes', icon: PrimeIcons.LIST, value: stats.categoryAttributes },
//     { label: 'Employees', icon: PrimeIcons.ID_CARD, value: stats.employees }
//   ]

//   return (
//     <div className="p-grid p-3">
//       <div className="p-col-12">
//         <h2 className="p-text-secondary">Settings Overview</h2>
//         <p className="p-text-subtle">Quick snapshot of configuration modules and data.</p>
//         <Divider />
//       </div>

//       {cards.map((card, idx) => (
//         <div key={idx} className="p-col-12 p-md-6 p-lg-3">
//           <Card
//             title={card.label}
//             subTitle={`${card.value} total`}
//             className="p-shadow-4"
//             style={{ borderRadius: '1rem', height: '100%' }}
//           >
//             <div className="flex align-items-center justify-content-between">
//               <Avatar
//                 icon={card.icon}
//                 size="xlarge"
//                 shape="circle"
//                 style={{ backgroundColor: '#6366F1', color: '#fff' }}
//               />
//               <Tag
//                 value={card.value}
//                 severity="info"
//                 style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
//               />
//             </div>
//           </Card>
//         </div>
//       ))}
//     </div>
//   )
// }

// export default SettingsOverview
