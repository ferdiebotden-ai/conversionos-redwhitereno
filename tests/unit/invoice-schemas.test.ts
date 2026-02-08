/**
 * Invoice & Drawing Schema Tests
 * Validates Zod schemas for invoices, payments, Sage export, and drawings
 * [DEV-076]
 */

import { describe, it, expect } from 'vitest';
import {
  InvoiceCreateSchema,
  InvoiceUpdateSchema,
  PaymentRecordSchema,
  SageExportSchema,
  InvoiceSendSchema,
} from '@/lib/schemas/invoice';
import {
  DrawingCreateSchema,
  DrawingUpdateSchema,
} from '@/lib/schemas/drawing';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const VALID_UUID_2 = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

describe('InvoiceCreateSchema', () => {
  it('accepts valid complete input', () => {
    expect(() =>
      InvoiceCreateSchema.parse({
        lead_id: VALID_UUID,
        quote_draft_id: VALID_UUID_2,
      })
    ).not.toThrow();
  });

  it('accepts optional notes', () => {
    const result = InvoiceCreateSchema.parse({
      lead_id: VALID_UUID,
      quote_draft_id: VALID_UUID_2,
      notes: 'Customer requested rush delivery',
    });
    expect(result.notes).toBe('Customer requested rush delivery');
  });

  it('accepts optional due_date with valid ISO date', () => {
    const result = InvoiceCreateSchema.parse({
      lead_id: VALID_UUID,
      quote_draft_id: VALID_UUID_2,
      due_date: '2026-03-15',
    });
    expect(result.due_date).toBe('2026-03-15');
  });

  it('rejects missing lead_id', () => {
    expect(() =>
      InvoiceCreateSchema.parse({ quote_draft_id: VALID_UUID_2 })
    ).toThrow();
  });

  it('rejects missing quote_draft_id', () => {
    expect(() =>
      InvoiceCreateSchema.parse({ lead_id: VALID_UUID })
    ).toThrow();
  });

  it('rejects invalid UUID for lead_id', () => {
    expect(() =>
      InvoiceCreateSchema.parse({
        lead_id: 'not-a-uuid',
        quote_draft_id: VALID_UUID_2,
      })
    ).toThrow();
  });

  it('rejects invalid UUID for quote_draft_id', () => {
    expect(() =>
      InvoiceCreateSchema.parse({
        lead_id: VALID_UUID,
        quote_draft_id: '12345',
      })
    ).toThrow();
  });

  it('rejects notes exceeding 2000 chars', () => {
    expect(() =>
      InvoiceCreateSchema.parse({
        lead_id: VALID_UUID,
        quote_draft_id: VALID_UUID_2,
        notes: 'a'.repeat(2001),
      })
    ).toThrow();
  });

  it('accepts notes at exactly 2000 chars', () => {
    expect(() =>
      InvoiceCreateSchema.parse({
        lead_id: VALID_UUID,
        quote_draft_id: VALID_UUID_2,
        notes: 'a'.repeat(2000),
      })
    ).not.toThrow();
  });

  it('rejects invalid date format for due_date', () => {
    expect(() =>
      InvoiceCreateSchema.parse({
        lead_id: VALID_UUID,
        quote_draft_id: VALID_UUID_2,
        due_date: '15/03/2026',
      })
    ).toThrow();
  });
});

describe('InvoiceUpdateSchema', () => {
  it('accepts valid update with all fields', () => {
    expect(() =>
      InvoiceUpdateSchema.parse({
        status: 'sent',
        notes: 'Updated notes',
        internal_notes: 'Internal only',
        due_date: '2026-04-01',
      })
    ).not.toThrow();
  });

  it('accepts update with status only', () => {
    const result = InvoiceUpdateSchema.parse({ status: 'paid' });
    expect(result.status).toBe('paid');
  });

  it('accepts update with notes only', () => {
    const result = InvoiceUpdateSchema.parse({ notes: 'Some notes' });
    expect(result.notes).toBe('Some notes');
  });

  it('accepts update with due_date only', () => {
    const result = InvoiceUpdateSchema.parse({ due_date: '2026-05-01' });
    expect(result.due_date).toBe('2026-05-01');
  });

  it('accepts all 6 status enum values', () => {
    const statuses = ['draft', 'sent', 'partially_paid', 'paid', 'overdue', 'cancelled'] as const;
    statuses.forEach((status) => {
      expect(() => InvoiceUpdateSchema.parse({ status })).not.toThrow();
    });
  });

  it('rejects invalid status', () => {
    expect(() => InvoiceUpdateSchema.parse({ status: 'pending' })).toThrow();
    expect(() => InvoiceUpdateSchema.parse({ status: 'archived' })).toThrow();
  });

  it('accepts null for nullable fields', () => {
    const result = InvoiceUpdateSchema.parse({
      notes: null,
      internal_notes: null,
    });
    expect(result.notes).toBeNull();
    expect(result.internal_notes).toBeNull();
  });

  it('rejects notes exceeding 2000 chars', () => {
    expect(() =>
      InvoiceUpdateSchema.parse({ notes: 'a'.repeat(2001) })
    ).toThrow();
  });

  it('rejects internal_notes exceeding 2000 chars', () => {
    expect(() =>
      InvoiceUpdateSchema.parse({ internal_notes: 'a'.repeat(2001) })
    ).toThrow();
  });

  it('accepts empty object (all fields optional)', () => {
    expect(() => InvoiceUpdateSchema.parse({})).not.toThrow();
  });
});

describe('PaymentRecordSchema', () => {
  it('accepts valid complete payment', () => {
    expect(() =>
      PaymentRecordSchema.parse({
        amount: 5000,
        payment_method: 'etransfer',
        payment_date: '2026-03-01',
        reference_number: 'REF-001',
        notes: 'First deposit',
      })
    ).not.toThrow();
  });

  it('accepts minimal valid payment (amount + method only)', () => {
    const result = PaymentRecordSchema.parse({
      amount: 100,
      payment_method: 'cash',
    });
    expect(result.amount).toBe(100);
    expect(result.payment_method).toBe('cash');
  });

  it('rejects amount of 0', () => {
    expect(() =>
      PaymentRecordSchema.parse({ amount: 0, payment_method: 'cash' })
    ).toThrow();
  });

  it('rejects negative amount', () => {
    expect(() =>
      PaymentRecordSchema.parse({ amount: -50, payment_method: 'cash' })
    ).toThrow();
  });

  it('accepts all 4 payment methods', () => {
    const methods = ['cash', 'cheque', 'etransfer', 'credit_card'] as const;
    methods.forEach((method) => {
      expect(() =>
        PaymentRecordSchema.parse({ amount: 100, payment_method: method })
      ).not.toThrow();
    });
  });

  it('rejects invalid payment method', () => {
    expect(() =>
      PaymentRecordSchema.parse({ amount: 100, payment_method: 'bitcoin' })
    ).toThrow();
    expect(() =>
      PaymentRecordSchema.parse({ amount: 100, payment_method: 'paypal' })
    ).toThrow();
  });

  it('rejects reference_number exceeding 100 chars', () => {
    expect(() =>
      PaymentRecordSchema.parse({
        amount: 100,
        payment_method: 'cash',
        reference_number: 'a'.repeat(101),
      })
    ).toThrow();
  });

  it('accepts reference_number at exactly 100 chars', () => {
    expect(() =>
      PaymentRecordSchema.parse({
        amount: 100,
        payment_method: 'cash',
        reference_number: 'a'.repeat(100),
      })
    ).not.toThrow();
  });

  it('rejects notes exceeding 500 chars', () => {
    expect(() =>
      PaymentRecordSchema.parse({
        amount: 100,
        payment_method: 'cash',
        notes: 'a'.repeat(501),
      })
    ).toThrow();
  });

  it('accepts notes at exactly 500 chars', () => {
    expect(() =>
      PaymentRecordSchema.parse({
        amount: 100,
        payment_method: 'cash',
        notes: 'a'.repeat(500),
      })
    ).not.toThrow();
  });

  it('accepts valid payment_date', () => {
    const result = PaymentRecordSchema.parse({
      amount: 250,
      payment_method: 'cheque',
      payment_date: '2026-02-15',
    });
    expect(result.payment_date).toBe('2026-02-15');
  });

  it('rejects invalid payment_date format', () => {
    expect(() =>
      PaymentRecordSchema.parse({
        amount: 250,
        payment_method: 'cheque',
        payment_date: 'Feb 15, 2026',
      })
    ).toThrow();
  });
});

describe('SageExportSchema', () => {
  it('accepts valid export with all fields', () => {
    expect(() =>
      SageExportSchema.parse({
        start_date: '2026-01-01',
        end_date: '2026-12-31',
        status: 'paid',
      })
    ).not.toThrow();
  });

  it('accepts empty object with status defaulting to all', () => {
    const result = SageExportSchema.parse({});
    expect(result.status).toBe('all');
  });

  it('accepts all 4 status values', () => {
    const statuses = ['all', 'sent', 'partially_paid', 'paid'] as const;
    statuses.forEach((status) => {
      expect(() => SageExportSchema.parse({ status })).not.toThrow();
    });
  });

  it('rejects invalid status', () => {
    expect(() => SageExportSchema.parse({ status: 'draft' })).toThrow();
    expect(() => SageExportSchema.parse({ status: 'cancelled' })).toThrow();
    expect(() => SageExportSchema.parse({ status: 'overdue' })).toThrow();
  });

  it('validates date format for start_date', () => {
    expect(() =>
      SageExportSchema.parse({ start_date: '2026/01/01' })
    ).toThrow();
  });

  it('validates date format for end_date', () => {
    expect(() =>
      SageExportSchema.parse({ end_date: 'January 1, 2026' })
    ).toThrow();
  });

  it('accepts valid date formats', () => {
    expect(() =>
      SageExportSchema.parse({
        start_date: '2026-01-01',
        end_date: '2026-12-31',
      })
    ).not.toThrow();
  });
});

describe('InvoiceSendSchema', () => {
  it('accepts valid email with custom message', () => {
    const result = InvoiceSendSchema.parse({
      to_email: 'customer@example.com',
      custom_message: 'Please find your invoice attached.',
    });
    expect(result.to_email).toBe('customer@example.com');
    expect(result.custom_message).toBe('Please find your invoice attached.');
  });

  it('accepts valid email without custom message', () => {
    const result = InvoiceSendSchema.parse({
      to_email: 'test@domain.ca',
    });
    expect(result.to_email).toBe('test@domain.ca');
    expect(result.custom_message).toBeUndefined();
  });

  it('rejects missing email', () => {
    expect(() => InvoiceSendSchema.parse({})).toThrow();
    expect(() => InvoiceSendSchema.parse({ custom_message: 'Hello' })).toThrow();
  });

  it('rejects invalid email formats', () => {
    expect(() => InvoiceSendSchema.parse({ to_email: 'not-an-email' })).toThrow();
    expect(() => InvoiceSendSchema.parse({ to_email: '@no-local.com' })).toThrow();
    expect(() => InvoiceSendSchema.parse({ to_email: 'missing@.com' })).toThrow();
  });

  it('rejects custom_message exceeding 1000 chars', () => {
    expect(() =>
      InvoiceSendSchema.parse({
        to_email: 'test@test.com',
        custom_message: 'a'.repeat(1001),
      })
    ).toThrow();
  });

  it('accepts custom_message at exactly 1000 chars', () => {
    expect(() =>
      InvoiceSendSchema.parse({
        to_email: 'test@test.com',
        custom_message: 'a'.repeat(1000),
      })
    ).not.toThrow();
  });
});

describe('DrawingCreateSchema', () => {
  it('accepts valid complete input', () => {
    const result = DrawingCreateSchema.parse({
      name: 'Kitchen Renovation Plan',
      description: 'Floor plan for the Smith kitchen remodel',
      lead_id: VALID_UUID,
    });
    expect(result.name).toBe('Kitchen Renovation Plan');
    expect(result.description).toBe('Floor plan for the Smith kitchen remodel');
    expect(result.lead_id).toBe(VALID_UUID);
  });

  it('accepts minimal input (name only)', () => {
    const result = DrawingCreateSchema.parse({ name: 'Basic Drawing' });
    expect(result.name).toBe('Basic Drawing');
    expect(result.description).toBeUndefined();
    expect(result.lead_id).toBeUndefined();
  });

  it('rejects empty name', () => {
    expect(() => DrawingCreateSchema.parse({ name: '' })).toThrow();
  });

  it('rejects name exceeding 200 chars', () => {
    expect(() =>
      DrawingCreateSchema.parse({ name: 'a'.repeat(201) })
    ).toThrow();
  });

  it('accepts name at exactly 200 chars', () => {
    expect(() =>
      DrawingCreateSchema.parse({ name: 'a'.repeat(200) })
    ).not.toThrow();
  });

  it('rejects description exceeding 2000 chars', () => {
    expect(() =>
      DrawingCreateSchema.parse({
        name: 'Test',
        description: 'a'.repeat(2001),
      })
    ).toThrow();
  });

  it('accepts description at exactly 2000 chars', () => {
    expect(() =>
      DrawingCreateSchema.parse({
        name: 'Test',
        description: 'a'.repeat(2000),
      })
    ).not.toThrow();
  });

  it('rejects invalid lead_id UUID', () => {
    expect(() =>
      DrawingCreateSchema.parse({
        name: 'Test',
        lead_id: 'invalid-uuid',
      })
    ).toThrow();
  });

  it('accepts valid lead_id UUID', () => {
    expect(() =>
      DrawingCreateSchema.parse({
        name: 'Test',
        lead_id: VALID_UUID,
      })
    ).not.toThrow();
  });
});

describe('DrawingUpdateSchema', () => {
  it('accepts valid update with all fields', () => {
    expect(() =>
      DrawingUpdateSchema.parse({
        name: 'Updated Name',
        description: 'Updated description',
        lead_id: VALID_UUID,
        drawing_data: {
          version: 1,
          units: 'metric',
          camera: { position: { x: 10, y: 8, z: 10 }, target: { x: 0, y: 0, z: 0 }, mode: 'perspective' },
          walls: [],
          openings: [],
          objects: [],
          dimensions: [],
          materialAssignments: [],
          layers: [{ name: 'Proposed', visible: true, locked: false }],
        },
        status: 'approved',
        permit_number: 'BP-2026-001',
      })
    ).not.toThrow();
  });

  it('accepts update with single field (name)', () => {
    const result = DrawingUpdateSchema.parse({ name: 'New Name' });
    expect(result.name).toBe('New Name');
  });

  it('accepts update with single field (status)', () => {
    const result = DrawingUpdateSchema.parse({ status: 'submitted' });
    expect(result.status).toBe('submitted');
  });

  it('accepts all 4 status enum values', () => {
    const statuses = ['draft', 'submitted', 'approved', 'rejected'] as const;
    statuses.forEach((status) => {
      expect(() => DrawingUpdateSchema.parse({ status })).not.toThrow();
    });
  });

  it('rejects invalid status', () => {
    expect(() => DrawingUpdateSchema.parse({ status: 'pending' })).toThrow();
    expect(() => DrawingUpdateSchema.parse({ status: 'archived' })).toThrow();
  });

  it('accepts null for nullable fields', () => {
    const result = DrawingUpdateSchema.parse({
      description: null,
      lead_id: null,
      permit_number: null,
    });
    expect(result.description).toBeNull();
    expect(result.lead_id).toBeNull();
    expect(result.permit_number).toBeNull();
  });

  it('accepts drawing_data as valid DrawingDataSchema', () => {
    const validDrawingData = {
      version: 1,
      units: 'imperial',
      camera: { position: { x: 5, y: 5, z: 5 }, target: { x: 0, y: 0, z: 0 }, mode: 'orthographic' },
      walls: [{ id: 'w1', start: { x: 0, z: 0 }, end: { x: 3, z: 0 }, height: 2.4, thickness: 0.15 }],
      openings: [],
      objects: [],
      dimensions: [],
      materialAssignments: [],
      layers: [{ name: 'Proposed', visible: true, locked: false }],
    };
    const result = DrawingUpdateSchema.parse({
      drawing_data: validDrawingData,
    });
    expect(result.drawing_data).toMatchObject({ version: 1, units: 'imperial' });
  });

  it('rejects permit_number exceeding 50 chars', () => {
    expect(() =>
      DrawingUpdateSchema.parse({ permit_number: 'a'.repeat(51) })
    ).toThrow();
  });

  it('accepts permit_number at exactly 50 chars', () => {
    expect(() =>
      DrawingUpdateSchema.parse({ permit_number: 'a'.repeat(50) })
    ).not.toThrow();
  });

  it('accepts empty object (all fields optional)', () => {
    expect(() => DrawingUpdateSchema.parse({})).not.toThrow();
  });

  it('rejects name with empty string', () => {
    expect(() => DrawingUpdateSchema.parse({ name: '' })).toThrow();
  });

  it('rejects description exceeding 2000 chars', () => {
    expect(() =>
      DrawingUpdateSchema.parse({ description: 'a'.repeat(2001) })
    ).toThrow();
  });
});
