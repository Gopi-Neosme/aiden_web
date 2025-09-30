import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import sql from 'mssql';

interface Widget {
  id: string;
  user_id: string;
  type: string;
  title: string;
  badge?: string;
  icon?: string;
  layout: string; // JSON string
  props?: string; // JSON string
  created_at: string;
  updated_at: string;
}

// GET /api/widgets/[userId] - Get all widgets for a user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const pool = await getPool();
    const result = await pool.request()
      .input('userId', sql.NVarChar, userId)
      .query(`
        SELECT id, user_id, type, title, badge, icon, layout, props, created_at, updated_at
        FROM widgets
        WHERE user_id = @userId
        ORDER BY created_at ASC
      `);

    // Parse JSON strings back to objects
    const widgets = result.recordset.map((row: any) => ({
      ...row,
      layout: JSON.parse(row.layout),
      props: row.props ? JSON.parse(row.props) : undefined,
    }));

    return NextResponse.json(widgets);
  } catch (error) {
    console.error('Error fetching widgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch widgets' },
      { status: 500 }
    );
  }
}

// POST /api/widgets/[userId] - Create a new widget
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    const { id, type, title, badge, icon, layout, props } = body;

    if (!id || !type || !title || !layout) {
      return NextResponse.json(
        { error: 'Missing required fields: id, type, title, layout' },
        { status: 400 }
      );
    }

    const pool = await getPool();
    await pool.request()
      .input('id', sql.NVarChar, id)
      .input('userId', sql.NVarChar, userId)
      .input('type', sql.NVarChar, type)
      .input('title', sql.NVarChar, title)
      .input('badge', sql.NVarChar, badge || null)
      .input('icon', sql.NVarChar, icon || null)
      .input('layout', sql.NVarChar, JSON.stringify(layout))
      .input('props', sql.NVarChar, props ? JSON.stringify(props) : null)
      .query(`
        INSERT INTO widgets (id, user_id, type, title, badge, icon, layout, props)
        VALUES (@id, @userId, @type, @title, @badge, @icon, @layout, @props)
      `);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating widget:', error);
    return NextResponse.json(
      { error: 'Failed to create widget' },
      { status: 500 }
    );
  }
}

// PUT /api/widgets/[userId] - Update multiple widgets (for layout changes)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    const widgets = body.widgets;

    if (!Array.isArray(widgets)) {
      return NextResponse.json(
        { error: 'Expected widgets array' },
        { status: 400 }
      );
    }

    const pool = await getPool();

    // Use a transaction for batch updates
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      for (const widget of widgets) {
        const { id, type, title, badge, icon, layout, props } = widget;

        await transaction.request()
          .input('id', sql.NVarChar, id)
          .input('userId', sql.NVarChar, userId)
          .input('type', sql.NVarChar, type)
          .input('title', sql.NVarChar, title)
          .input('badge', sql.NVarChar, badge || null)
          .input('icon', sql.NVarChar, icon || null)
          .input('layout', sql.NVarChar, JSON.stringify(layout))
          .input('props', sql.NVarChar, props ? JSON.stringify(props) : null)
          .query(`
            UPDATE widgets
            SET type = @type, title = @title, badge = @badge, icon = @icon,
                layout = @layout, props = @props, updated_at = GETDATE()
            WHERE id = @id AND user_id = @userId
          `);
      }

      await transaction.commit();
      return NextResponse.json({ success: true });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating widgets:', error);
    return NextResponse.json(
      { error: 'Failed to update widgets' },
      { status: 500 }
    );
  }
}

// DELETE /api/widgets/[userId] - Delete all widgets for a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const pool = await getPool();
    await pool.request()
      .input('userId', sql.NVarChar, userId)
      .query('DELETE FROM widgets WHERE user_id = @userId');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting widgets:', error);
    return NextResponse.json(
      { error: 'Failed to delete widgets' },
      { status: 500 }
    );
  }
}