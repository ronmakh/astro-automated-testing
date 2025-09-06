import * as dotenv from 'dotenv';
import { ApiClient } from './api-client';
import { getBaseUrl } from '../utils';
import { IBrand } from '../common/types/types-brand';

export async function getBrands(token: string): Promise<IBrand[]> {
    const client = await ApiClient.init(getBaseUrl());
    const brands = await client.get('/brands', token) as IBrand[];
    await client.dispose();
    return brands;
}

export async function getBrandById(): Promise<void> {

}

export async function addBrand(): Promise<void> {

}

export async function updateBrand(): Promise<void> {

}

export async function deleteBrand(): Promise<void> {
    
}