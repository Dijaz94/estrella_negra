<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { CategoryItem, MenuItem } from '~/types'

definePageMeta({
  layout: 'admin'
})

const { data: categories, refresh } = useAdminMenu()
const toast = useToast()

const showCategoryModal = ref(false)
const showProductModal = ref(false)
const showDeleteModal = ref(false)

const editingCategory = ref<CategoryItem | null>(null)
const editingProduct = ref<MenuItem | null>(null)
type DeleteTarget =
  | { type: 'category'; item: CategoryItem }
  | { type: 'product'; item: MenuItem }

const deleteTarget = ref<DeleteTarget | null>(null)

const loading = ref(false)

const allProducts = computed(() =>
  categories.value?.flatMap((c) =>
    c.productos.map((p) => ({
      ...p,
      categoria: c.nombre,
      id_categoria: c.id_categoria,
    }))
  ) ?? []
)

function openCreateCategory() {
  editingCategory.value = null
  showCategoryModal.value = true
}

function openEditCategory(cat: CategoryItem) {
  editingCategory.value = cat
  showCategoryModal.value = true
}

function openDeleteCategory(cat: CategoryItem) {
  deleteTarget.value = { type: 'category', item: cat }
  showDeleteModal.value = true
}

function openCreateProduct() {
  editingProduct.value = null
  showProductModal.value = true
}

function openEditProduct(prod: MenuItem) {
  editingProduct.value = prod
  showProductModal.value = true
}

function openDeleteProduct(prod: MenuItem) {
  deleteTarget.value = { type: 'product', item: prod }
  showDeleteModal.value = true
}

async function handleCategorySubmit(data: Record<string, unknown>) {
  loading.value = true
  try {
    if (editingCategory.value) {
      await updateAdminCategory(editingCategory.value.id_categoria, data)
      toast.add({ title: 'Categoría actualizada', color: 'success' })
    } else {
      await createAdminCategory(data)
      toast.add({ title: 'Categoría creada', color: 'success' })
    }
    showCategoryModal.value = false
    editingCategory.value = null
    await refresh()
  } catch (e: any) {
    toast.add({
      title: 'Error',
      description: getApiErrorMessage(e, 'No se pudo guardar la categoría'),
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}

async function handleProductSubmit(data: Record<string, unknown>) {
  loading.value = true
  try {
    if (editingProduct.value) {
      await updateAdminProduct(editingProduct.value.id_producto, data)
      toast.add({ title: 'Producto actualizado', color: 'success' })
    } else {
      await createAdminProduct(data)
      toast.add({ title: 'Producto creado', color: 'success' })
    }
    showProductModal.value = false
    editingProduct.value = null
    await refresh()
  } catch (e: any) {
    toast.add({
      title: 'Error',
      description: getApiErrorMessage(e, 'No se pudo guardar el producto'),
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  if (!deleteTarget.value) return
  loading.value = true
  try {
    if (deleteTarget.value.type === 'category') {
      await deleteAdminCategory(deleteTarget.value.item.id_categoria!)
      toast.add({ title: 'Categoría eliminada', color: 'success' })
    } else {
      await deleteAdminProduct((deleteTarget.value.item as MenuItem).id_producto)
      toast.add({ title: 'Producto eliminado', color: 'success' })
    }
    showDeleteModal.value = false
    deleteTarget.value = null
    await refresh()
  } catch (e: any) {
    toast.add({
      title: 'Error',
      description: getApiErrorMessage(e, 'No se pudo eliminar'),
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const columns: TableColumn<MenuItem>[] = [
  {
    accessorKey: 'imagen_url',
    header: '',
    meta: { class: { td: 'w-12' } },
    cell: ({ row }) => {
      const url = row.original.imagen_url
      return h('img', {
        src: url || '/images/default_event.jpg',
        alt: row.original.nombre,
        class: 'h-10 w-10 rounded object-cover',
      })
    },
  },
  {
    accessorKey: 'nombre',
    header: 'Nombre',
  },
  {
    accessorKey: 'categoria',
    header: 'Categoría',
    cell: ({ row }) => h(UBadge, { variant: 'subtle', color: 'primary' }, () => row.original.categoria),
  },
  {
    accessorKey: 'precio',
    header: 'Precio',
    meta: { class: { th: 'text-right', td: 'text-right font-medium' } },
    cell: ({ row }) => `$${row.original.precio.toLocaleString('es-CL')}`,
  },
  {
    accessorKey: 'disponible',
    header: 'Disponible',
    cell: ({ row }) =>
      h(UBadge, { variant: 'subtle', color: row.original.disponible ? 'success' : 'error' }, () =>
        row.original.disponible ? 'Sí' : 'No'
      ),
  },
  {
    accessorKey: 'destacado',
    header: 'Destacado',
    cell: ({ row }) =>
      h(UBadge, { variant: 'subtle', color: row.original.destacado ? 'warning' : 'neutral' }, () =>
        row.original.destacado ? '★' : '—'
      ),
  },
  {
    id: 'actions',
    meta: { class: { td: 'text-right' } },
    cell: ({ row }) => {
      const items = [
        {
          label: 'Editar',
          icon: 'i-lucide-pencil',
          onSelect: () => openEditProduct(row.original),
        },
        {
          label: 'Eliminar',
          icon: 'i-lucide-trash-2',
          color: 'error' as const,
          onSelect: () => openDeleteProduct(row.original),
        },
      ]

      return h(UDropdownMenu, { items, content: { align: 'end' } }, () =>
        h(UButton, { icon: 'i-lucide-ellipsis-vertical', color: 'neutral', variant: 'ghost', 'aria-label': 'Acciones' })
      )
    },
  },
]

function findCategoryById(id: string | number) {
  return categories.value?.find(c => c.id_categoria === Number(id))
}

function editCategory(cat: CategoryItem | undefined) {
  if (!cat) return
  openEditCategory(cat)
}

function deleteCategory(cat: CategoryItem | undefined) {
  if (!cat) return
  openDeleteCategory(cat)
}

const deleteDescription = computed(() => {
  if (!deleteTarget.value) return ''
  if (deleteTarget.value.type === 'category') {
    const count = (deleteTarget.value.item as CategoryItem).productos?.length ?? 0
    return count > 0
      ? `Se eliminarán ${count} producto(s) asociados a esta categoría.`
      : 'Esta categoría no tiene productos asociados.'
  }
  return 'Esta acción no se puede deshacer.'
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <h1 class="font-display text-2xl tracking-wider uppercase text-text-heading">
        Menú
      </h1>
      <div class="flex gap-3">
        <UButton label="+ Crear categoría" variant="outline" @click="openCreateCategory" />
        <UButton label="+ Crear producto" @click="openCreateProduct" />
      </div>
    </div>

    <!-- Categorías -->
    <section v-if="categories?.length" class="mb-10">
      <h2 class="font-display text-lg tracking-wider uppercase text-text-heading mb-4">
        Categorías
      </h2>
      <UAccordion type="multiple" :items="(categories as CategoryItem[]).map((c: CategoryItem) => ({
        label: `${c.nombre} (${c.productos?.length ?? 0})`,
        value: String(c.id_categoria),
      }))">
        <template #body="{ item }">
          <div class="flex justify-end gap-2 pb-2">
            <UButton
              label="Editar"
              variant="outline"
              size="xs"
              icon="i-lucide-pencil"
              @click="editCategory(findCategoryById(item.value))"
            />
            <UButton
              label="Eliminar"
              variant="outline"
              color="error"
              size="xs"
              icon="i-lucide-trash-2"
              @click="deleteCategory(findCategoryById(item.value))"
            />
          </div>
          <p v-if="!findCategoryById(item.value)?.productos?.length" class="text-sm text-text-muted/60 pb-2">
            Sin productos en esta categoría.
          </p>
        </template>
      </UAccordion>
    </section>

    <!-- Empty state categorías -->
    <div v-else class="py-8 text-center mb-10">
      <p class="font-display text-lg tracking-wider text-text-muted uppercase">
        No hay categorías creadas aún
      </p>
    </div>

    <!-- Productos -->
    <section>
      <h2 class="font-display text-lg tracking-wider uppercase text-text-heading mb-4">
        Productos
      </h2>
      <UTable
        v-if="allProducts.length"
        :data="allProducts"
        :columns="columns"
        class="flex-1"
      />
      <div v-else class="py-8 text-center">
        <p class="font-display text-lg tracking-wider text-text-muted uppercase">
          No hay productos creados aún
        </p>
      </div>
    </section>

    <!-- Modal categoría -->
    <UModal
      v-model:open="showCategoryModal"
      :title="editingCategory ? 'Editar categoría' : 'Crear categoría'"
      :ui="{ content: 'max-w-md w-full' }"
    >
      <template #content>
        <AdminCategoryForm
          :categoria="editingCategory"
          :loading="loading"
          @submit="handleCategorySubmit"
        />
      </template>
    </UModal>

    <!-- Modal producto -->
    <UModal
      v-model:open="showProductModal"
      :title="editingProduct ? 'Editar producto' : 'Crear producto'"
      :ui="{ content: 'max-w-xl w-full max-h-[90vh] overflow-y-auto' }"
    >
      <template #content>
        <AdminProductForm
          :producto="editingProduct"
          :categorias="categories ?? []"
          :loading="loading"
          @submit="handleProductSubmit"
        />
      </template>
    </UModal>

    <!-- Modal eliminar -->
    <AdminDeleteConfirmModal
      :open="showDeleteModal"
      :title="deleteTarget?.type === 'category' ? 'Eliminar categoría' : 'Eliminar producto'"
      :description="deleteDescription"
      @update:open="showDeleteModal = $event"
      @confirm="handleDelete"
    />
  </div>
</template>
