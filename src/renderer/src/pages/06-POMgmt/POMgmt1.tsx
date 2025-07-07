import React, { useState } from 'react';
import IndivHeader from '@renderer/components/IndivHeader/IndivHeader';
import POMgmtViewPurchase from '@renderer/components/POMgmtViewPurchase/POMgmtViewPurchase';
import POMgmtEditPurchase from '@renderer/components/POMgmtViewPurchase/POMgmtEditPurchase';
import { BreadCrumb } from 'primereact/breadcrumb';
import { MenuItem } from 'primereact/menuitem';

import { Product } from '../../components/POMgmtViewPurchase/Product';

const POMgmt1: React.FC = () => {
  const [activeKey, setActiveKey] = useState<'overview' | 'viewPurchase' | 'editPurchase'>('viewPurchase');
  const [editData, setEditData] = useState<Product | null>(null);

  const handleEditProduct = (product: Product) => {
    console.log('Editing:', product);
    setEditData(product);
    setActiveKey('editPurchase');
  };

  const breadcrumbItems: MenuItem[] = [
    { label: 'Overview', command: () => setActiveKey('overview') },
    { label: 'View Purchase', command: () => setActiveKey('viewPurchase') },
  ];

  if (activeKey === 'editPurchase' && editData) {
    breadcrumbItems.push({
      label: `Edit: ${editData.refPName}`,
      command: () => setActiveKey('editPurchase'),
    });
  }

  const renderComponent = () => {
    switch (activeKey) {
      case 'viewPurchase':
        return <POMgmtViewPurchase onEditProduct={handleEditProduct} />; 
      case 'editPurchase':
        return <POMgmtEditPurchase data={editData} onBack={() => setActiveKey('viewPurchase')} />;
      default:
        return <div>Select a view</div>;
    }
  };

  return (
    <div className="h-full flex flex-column">
      <IndivHeader title="Purchase Order" subtitle="" />
      <div className="px-4 mt-2">
        <BreadCrumb model={breadcrumbItems} />
      </div>
      <div className="flex flex-1 m-3 border-round-md shadow-1 p-4 overflow-auto">
        {renderComponent()}
      </div>
    </div>
  );
};

export default POMgmt1;
