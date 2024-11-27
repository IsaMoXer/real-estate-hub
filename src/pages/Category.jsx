import { useParams } from 'react-router-dom';

import Sales from '../components/Sales';
import Rents from '../components/Rents';

function Category() {
  const { listingCategory } = useParams();

  return (
    <div>
      {listingCategory === 'rent' && <Rents />}
      {listingCategory === 'sale' && <Sales />}
    </div>
  );
}

export default Category;