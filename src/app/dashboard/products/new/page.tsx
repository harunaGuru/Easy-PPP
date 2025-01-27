import React from 'react'
import { PageGrid } from '../../_components/PageGrid'
import { ProductForm } from '../../_components/form/ProductForm'
import { HasPermission } from '@/components/HasPermission'
import { cancreateProduct } from '@/server/db/permission'

export default function NewPage() {
  return (
    <div className='bg-blue-50/50'>
    <PageGrid title='Create product' href='/dashboard'>
    <HasPermission permission={cancreateProduct} renderFallBack renderFallBackText='You have already created the maximum number of product. Try upgrading your account to create more'>
       <ProductForm />
    </HasPermission>
    </PageGrid>
    </div>
  )
}
