
import React from 'react';
import { BreadCrumb } from 'primereact/breadcrumb';
import { MenuItem } from 'primereact/menuitem';
import { Product } from '../../components/POMgmtViewPurchase/Product';

interface Props {
  activeKey: 'overview' | 'viewPurchase' | 'editPurchase';
  editData: Product | null;
  setActiveKey: (key: 'overview' | 'viewPurchase' | 'editPurchase') => void;
}

const POMgmt1: React.FC<Props> = ({ activeKey, editData, setActiveKey }) => {
  const breadcrumbItems: MenuItem[] = [
    { label: 'Overview', command: () => setActiveKey('viewPurchase') },
  ];

  if (activeKey === 'editPurchase' && editData) {
    breadcrumbItems.push({
      label: 'Edit Purchase',
      command: () => setActiveKey('editPurchase'), // Make sure form opens when clicked
    });
  }

  return (
    <div className="w-full flex justify-start">
      <BreadCrumb model={breadcrumbItems} />
    </div>
  );
};

export default POMgmt1;
