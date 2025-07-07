import React from 'react';
import { Button } from 'primereact/button';
import { Product } from '../../components/POMgmtViewPurchase/Product';

interface Props {
  data: Product | null;
  onBack: () => void;
}

const POMgmtEditPurchase: React.FC<Props> = ({ data, onBack }) => {
  if (!data) return <div>No data to edit</div>;

  return (
    <div>
      <h3>Edit: {data.refPName}</h3>
      <p><strong>ID:</strong> {data.refProductId}</p>
      <p><strong>SKU:</strong> {data.refPSKU}</p>
      <p><strong>Brand:</strong> {data.refPBrand}</p>
      <p><strong>Price:</strong> ${data.refPPrice} / MRP ${data.refPMRP}</p>
      <Button label="Back" icon="pi pi-arrow-left" onClick={onBack} className="mt-3" />
    </div>
  );
};

export default POMgmtEditPurchase;
