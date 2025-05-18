import { createClient } from '@supabase/supabase-js';
import { apiConfig } from './index';

export class SupabaseAPI {
    private config = apiConfig.supabase;
    private client;

    constructor() {
        this.client = createClient(this.config.url, this.config.public_key);
    }

    async getProducts(params?: any) {
        try {
            const { data, error } = await this.client
                .from('products')
                .select('*')
                .match(params || {});
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao buscar produtos no Supabase:', error);
            throw error;
        }
    }

    async getProduct(productId: string) {
        try {
            const { data, error } = await this.client
                .from('products')
                .select('*')
                .eq('id', productId)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao buscar produto no Supabase:', error);
            throw error;
        }
    }

    async createProduct(data: any) {
        try {
            const { data: newProduct, error } = await this.client
                .from('products')
                .insert(data)
                .select()
                .single();
            
            if (error) throw error;
            return newProduct;
        } catch (error) {
            console.error('Erro ao criar produto no Supabase:', error);
            throw error;
        }
    }

    async updateProduct(productId: string, data: any) {
        try {
            const { data: updatedProduct, error } = await this.client
                .from('products')
                .update(data)
                .eq('id', productId)
                .select()
                .single();
            
            if (error) throw error;
            return updatedProduct;
        } catch (error) {
            console.error('Erro ao atualizar produto no Supabase:', error);
            throw error;
        }
    }

    async deleteProduct(productId: string) {
        try {
            const { error } = await this.client
                .from('products')
                .delete()
                .eq('id', productId);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Erro ao deletar produto no Supabase:', error);
            throw error;
        }
    }

    async getCategories(params?: any) {
        try {
            const { data, error } = await this.client
                .from('categories')
                .select('*')
                .match(params || {});
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao buscar categorias no Supabase:', error);
            throw error;
        }
    }

    async createCategory(data: any) {
        try {
            const { data: newCategory, error } = await this.client
                .from('categories')
                .insert(data)
                .select()
                .single();
            
            if (error) throw error;
            return newCategory;
        } catch (error) {
            console.error('Erro ao criar categoria no Supabase:', error);
            throw error;
        }
    }

    async updateCategory(categoryId: string, data: any) {
        try {
            const { data: updatedCategory, error } = await this.client
                .from('categories')
                .update(data)
                .eq('id', categoryId)
                .select()
                .single();
            
            if (error) throw error;
            return updatedCategory;
        } catch (error) {
            console.error('Erro ao atualizar categoria no Supabase:', error);
            throw error;
        }
    }

    async deleteCategory(categoryId: string) {
        try {
            const { error } = await this.client
                .from('categories')
                .delete()
                .eq('id', categoryId);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Erro ao deletar categoria no Supabase:', error);
            throw error;
        }
    }
} 