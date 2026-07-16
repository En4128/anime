import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

let supabaseClient;

if (env.nodeEnv === 'test') {
  // Return the mock client for tests
  const store = {
    users: [],
    anime: [],
    episodes: [],
    comments: [],
    user_watchlist: [],
    user_liked_anime: [],
    user_continue_watching: [],
    comment_likes: []
  };

  const makeQuery = (table) => {
    const data = store[table] || [];
    const filters = [];
    let isWrite = false;
    let writePayload = null;
    let writeOp = null; // 'insert', 'update', 'delete'
    let sortField = null;
    let ascending = true;
    let limitVal = null;
    let isCount = false;

    const executeWrite = () => {
      const filtered = data.filter(item => filters.every(f => f(item)));
      if (writeOp === 'insert') {
        const records = Array.isArray(writePayload) ? writePayload : [writePayload];
        const inserted = records.map(r => {
          const id = r.id || Math.random().toString(36).substring(7);
          const record = { id, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...r };
          store[table].push(record);
          return record;
        });
        return Array.isArray(writePayload) ? inserted : inserted[0];
      } else if (writeOp === 'update') {
        filtered.forEach(item => {
          Object.assign(item, writePayload, { updated_at: new Date().toISOString() });
        });
        return filtered[0] || null;
      } else if (writeOp === 'delete') {
        store[table] = data.filter(item => !filters.every(f => f(item)));
        return filtered[0] || null;
      }
      return null;
    };

    const chain = {
      select: (fields, opts) => {
        if (opts?.count) {
          isCount = true;
        }
        return chain;
      },
      eq: (field, value) => {
        filters.push(item => item[field] === value);
        return chain;
      },
      neq: (field, value) => {
        filters.push(item => item[field] !== value);
        return chain;
      },
      in: (field, array) => {
        filters.push(item => array.includes(item[field]));
        return chain;
      },
      or: (orStr) => {
        const parts = orStr.split(',');
        filters.push(item => {
          return parts.some(part => {
            const [field, op, val] = part.split('.');
            if (op === 'ilike') {
              const term = val.replace(/%/g, '').toLowerCase();
              return String(item[field] || '').toLowerCase().includes(term);
            }
            return false;
          });
        });
        return chain;
      },
      filter: (field, op, val) => {
        if (op === 'ov') {
          const cleanedVal = val.replace(/[{}]/g, '');
          const searchArray = cleanedVal ? cleanedVal.split(',') : [];
          filters.push(item => {
            const itemArray = Array.isArray(item[field]) ? item[field] : [];
            return searchArray.some(s => itemArray.includes(s));
          });
        }
        return chain;
      },
      order: (field, opts) => {
        sortField = field;
        ascending = opts?.ascending !== false;
        return chain;
      },
      limit: (val) => {
        limitVal = val;
        return chain;
      },
      insert: (payload) => {
        isWrite = true;
        writeOp = 'insert';
        writePayload = payload;
        return chain;
      },
      update: (payload) => {
        isWrite = true;
        writeOp = 'update';
        writePayload = payload;
        return chain;
      },
      delete: () => {
        isWrite = true;
        writeOp = 'delete';
        return chain;
      },
      single: async () => {
        if (isWrite) {
          const res = executeWrite();
          if (!res) {
            return { data: null, error: { message: 'Not found', code: 'PGRST116' } };
          }
          return { data: res, error: null };
        }
        const filtered = data.filter(item => filters.every(f => f(item)));
        if (filtered.length === 0) {
          return { data: null, error: { message: 'Not found', code: 'PGRST116' } };
        }
        return { data: filtered[0], error: null };
      },
      then: (resolve) => {
        if (isWrite) {
          const res = executeWrite();
          return resolve({ data: res, error: null });
        }
        let filtered = data.filter(item => filters.every(f => f(item)));
        if (sortField) {
          filtered.sort((a, b) => {
            if (a[sortField] < b[sortField]) return ascending ? -1 : 1;
            if (a[sortField] > b[sortField]) return ascending ? 1 : -1;
            return 0;
          });
        }
        if (limitVal) {
          filtered = filtered.slice(0, limitVal);
        }
        if (isCount) {
          resolve({ data: null, count: filtered.length, error: null });
        } else {
          resolve({ data: filtered, error: null });
        }
      }
    };
    return chain;
  };

  supabaseClient = {
    from: (table) => makeQuery(table),
    storage: {
      from: () => ({
        upload: async () => ({ data: { path: 'mock-path' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'mock-url' } })
      })
    }
  };
} else {
  supabaseClient = createClient(
    env.supabase.url || 'https://mock.supabase.co',
    env.supabase.key || 'mock-key'
  );
}

export const supabase = supabaseClient;
export const rawStore = null;
