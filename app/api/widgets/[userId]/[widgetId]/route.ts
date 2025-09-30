import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import sql from 'mssql';

// PUT /api/widgets/[userId]/[widgetId] - Update a specific widget
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; widgetId: string }> }
) {
  try {
    const { userId, widgetId } = await params;
    const body = await request.json();
    const { type, title, badge, icon, layout, props } = body;

    if (!type || !title || !layout) {
      return NextResponse.json(
        { error: 'Missing required fields: type, title, layout' },
        { status: 400 }
      );
    }

    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.NVarChar, widgetId)
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

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json(
        { error: 'Widget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating widget:', error);
    return NextResponse.json(
      { error: 'Failed to update widget' },
      { status: 500 }
    );
  }
}

// DELETE /api/widgets/[userId]/[widgetId] - Delete a specific widget
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; widgetId: string }> }
) {
  const startTime = Date.now();
  console.log(`Starting DELETE operation for widget ${params} at ${new Date().toISOString()}`);

  let pool: any = null;
  try {
    const { userId, widgetId } = await params;
    console.log(`DELETE params resolved: userId=${userId}, widgetId=${widgetId}`);

    pool = await getPool();
    console.log(`Pool acquired in ${Date.now() - startTime}ms`);

    // Test basic connectivity first
    const testRequest = pool.request();
    console.log(`Test request created in ${Date.now() - startTime}ms`);

    // Try a simple SELECT first to test connectivity
    const testResult = await testRequest.query('SELECT 1 as test');
    console.log(`Test query successful in ${Date.now() - startTime}ms, result:`, testResult.recordset);

    // Now try the actual delete
    const deleteRequest = pool.request();
    console.log(`Delete request created in ${Date.now() - startTime}ms`);

    const result = await deleteRequest
      .input('id', sql.NVarChar, widgetId)
      .input('userId', sql.NVarChar, userId)
      .query('DELETE FROM widgets WHERE id = @id AND user_id = @userId');

    console.log(`DELETE query completed in ${Date.now() - startTime}ms, rows affected:`, result.rowsAffected);

    // Note: We don't return an error if the widget doesn't exist,
    // since deleting a non-existent widget is not an error
    return NextResponse.json({
      success: true,
      deleted: result.rowsAffected[0] > 0,
      executionTime: Date.now() - startTime
    });
  } catch (error: any) {
    const executionTime = Date.now() - startTime;
    console.error(`Error deleting widget after ${executionTime}ms:`, {
      error: error.message,
      code: error.code,
      stack: error.stack
    });

    // Provide more specific error messages
    if (error.code === 'ETIMEOUT' || error.message?.includes('timeout') || error.message?.includes('timed out')) {
      return NextResponse.json(
        { error: 'Database operation timed out. Please try again.', executionTime },
        { status: 408 }
      );
    }

    if (error.code === 'ECONNCLOSED' || error.message?.includes('connection')) {
      return NextResponse.json(
        { error: 'Database connection error. Please try again.', executionTime },
        { status: 503 }
      );
    }

    if (error.code === 'ELOGIN') {
      return NextResponse.json(
        { error: 'Database authentication failed.', executionTime },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete widget', executionTime, details: error.message },
      { status: 500 }
    );
  }
}