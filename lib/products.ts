import { collection, CollectionReference, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product, ProductDoc } from '../types/Product';

import { getCategories } from './categories';

const productsCol = collection(db, 'products') as CollectionReference<ProductDoc>;

export const getProducts = async () => {
  try {
    const products: ProductDoc[] = [];

    const productsSnapshot = await getDocs(productsCol);

    productsSnapshot.forEach((product) => {
      products.push({
        ...product.data(),
        id: product.id,
      });
    });

    if (products.length === 0) {
      throw new Error('No products found');
    }

    return products;
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
};

export const addProduct = async (product: Product) => {
  try {
    if (!product.name) {
      throw new Error('Product name is required');
    }

    if (!product.description) {
      throw new Error('Product description is required');
    }

    const products = await getProducts();
    const foundProduct = products?.find((item) => item.name === product.name);

    if (foundProduct) {
      throw new Error('Product already exists');
    } else {
      const productRef = await addDoc(productsCol, {
        ...product,
        created_at: serverTimestamp(),
        modified_at: serverTimestamp(),
      });
      console.log('Document written with ID: ', productRef.id);
    }
  } catch (error) {
    console.error('Error adding document: ', error);
  }
};
