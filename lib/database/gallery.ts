import { query } from './config'

export async function getGalleryItems() {
  try {
    const result = await query(`
      SELECT 
        id,
        title,
        title_ar,
        image_url,
        is_active,
        display_order,
        created_at
      FROM gallery 
      ORDER BY display_order ASC
    `)

    return result.rows.map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      titleAr: item.title_ar,
      imageUrl: item.image_url,
      isActive: item.is_active,
      display_order: item.display_order,
      createdAt: new Date(item.created_at),
    }))
  } catch (error) {
    console.error('Error loading gallery items:', error)
    return []
  }
}

export async function addGalleryItem(itemData: any) {
  try {
    const result = await query(`
      INSERT INTO gallery (title, title_ar, image_url, is_active, display_order)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [
      itemData.title,
      itemData.titleAr,
      itemData.imageUrl,
      itemData.isActive,
      itemData.display_order
    ])
    
    return result.rows[0]
  } catch (error) {
    console.error('Error adding gallery item:', error)
    throw error
  }
}

export async function updateGalleryItem(id: string, itemData: any) {
  try {
    const updates = []
    const values = []
    let paramIndex = 1

    if (itemData.title !== undefined) {
      updates.push(`title = $${paramIndex++}`)
      values.push(itemData.title)
    }
    if (itemData.titleAr !== undefined) {
      updates.push(`title_ar = $${paramIndex++}`)
      values.push(itemData.titleAr)
    }
    if (itemData.imageUrl !== undefined) {
      updates.push(`image_url = $${paramIndex++}`)
      values.push(itemData.imageUrl)
    }
    if (itemData.isActive !== undefined) {
      updates.push(`is_active = $${paramIndex++}`)
      values.push(itemData.isActive)
    }
    if (itemData.display_order !== undefined) {
      updates.push(`display_order = $${paramIndex++}`)
      values.push(itemData.display_order)
    }

    if (updates.length > 0) {
      values.push(id)
      await query(`UPDATE gallery SET ${updates.join(', ')} WHERE id = $${paramIndex}`, values)
    }
  } catch (error) {
    console.error('Error updating gallery item:', error)
    throw error
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    await query('DELETE FROM gallery WHERE id = $1', [id])
  } catch (error) {
    console.error('Error deleting gallery item:', error)
    throw error
  }
}
