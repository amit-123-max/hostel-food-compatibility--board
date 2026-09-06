import React, { useState } from 'react';
import { initialResidents, initialDishes, initialBudget } from './data/seedData';
import { calculateCompatibility } from './logic/compatibility';

// Helper for pure state initialization and resets
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

export default function App() {
  // State Management: ONLY useState to adhere to constraints
  const [residents, setResidents] = useState(deepClone(initialResidents));
  const [dishes, setDishes] = useState(deepClone(initialDishes));
  const [budget, setBudget] = useState(initialBudget);

  const [searchQuery, setSearchQuery] = useState('');

  // result shape: { compatibleDishes: Dish[], excludedDishes: { dish, reasons }[] }
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null); // 'INVALID_INPUT' | 'DUPLICATE_DISH_ID' | null

  const handleCalculate = () => {
    // Pure function call
    const res = calculateCompatibility(residents, dishes, Number(budget));

    if (res.error) {
      setError(res.error);
      setResult(null); // Clear valid results on error
    } else {
      setError(null);
      setResult({
        compatibleDishes: res.compatibleDishes,
        excludedDishes: res.excludedDishes
      });
    }
  };

  const handleReset = () => {
    // Deterministic state clearing
    setResidents(deepClone(initialResidents));
    setDishes(deepClone(initialDishes));
    setBudget(initialBudget);
    setSearchQuery('');
    setResult(null);
    setError(null);
  };

  // --- Input Handlers ---
  const handleResidentChange = (index, field, value) => {
    const updated = [...residents];
    if (field === 'allergens') {
      // Split strictly by comma exactly as typed to avoid deleting trailing commas/spaces and resetting the cursor
      updated[index][field] = value.split(',');
    } else {
      updated[index][field] = value;
    }
    setResidents(updated);
  };

  const handleDishChange = (index, field, value) => {
    const updated = [...dishes];
    if (field === 'ingredients') {
      // Split strictly by comma to preserve user typing state
      updated[index][field] = value.split(',');
    } else if (field === 'price') {
      updated[index][field] = value === '' ? '' : Number(value);
    } else {
      updated[index][field] = value;
    }
    setDishes(updated);
  };

  // --- Derived State: Live Search Filter ---
  // The contract specifies the search filter applies ONLY to the already calculated compatible dishes.
  const filteredCompatibleDishes = result ? result.compatibleDishes.filter(dish => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      dish.cafe.toLowerCase().includes(query) ||
      dish.name.toLowerCase().includes(query) ||
      dish.ingredients.some(tag => tag.toLowerCase().includes(query))
    );
  }) : [];

  // --- Inline Styles (Clean & Professional) ---
  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '30px', fontFamily: 'system-ui, sans-serif', color: '#212529' },
    section: { marginBottom: '30px', padding: '25px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '4px', overflow: 'hidden', color: '#212529' },
    th: { borderBottom: '2px solid #dee2e6', padding: '12px 15px', textAlign: 'center', backgroundColor: '#e9ecef', color: '#495057', fontWeight: '600' },
    td: { borderBottom: '1px solid #dee2e6', padding: '12px 15px' },
    input: { padding: '8px 12px', width: '100%', border: '1px solid #ced4da', borderRadius: '4px', boxSizing: 'border-box', color: '#212529', backgroundColor: '#fff' },
    select: { padding: '8px 12px', width: '100%', border: '1px solid #ced4da', borderRadius: '4px', boxSizing: 'border-box', color: '#212529', backgroundColor: '#fff' },
    btnBlue: { padding: '12px 24px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    btnGray: { padding: '12px 24px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '10px' },
    errorBox: { padding: '15px', color: '#842029', backgroundColor: '#f8d7da', border: '1px solid #f5c2c7', borderRadius: '4px', fontWeight: 'bold' },
    reasonText: { color: '#dc3545', fontWeight: '600' },
    h2: { marginTop: 0, marginBottom: '20px', color: '#212529', fontSize: '1.5em' }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ borderBottom: '2px solid #61dafb', paddingBottom: '10px', color: '#61dafb', textAlign: 'center' }}>Hostel Food Compatibility Board</h1>

      <section style={styles.section}>
        <h2 style={{ ...styles.h2, textAlign: 'center' }}>Residents</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Diet</th>
              <th style={styles.th}>Allergens (comma separated)</th>
            </tr>
          </thead>
          <tbody>
            {residents.map((r, i) => (
              <tr key={i}>
                <td style={styles.td}><input style={styles.input} value={r.name} onChange={e => handleResidentChange(i, 'name', e.target.value)} /></td>
                <td style={styles.td}>
                  <select style={styles.select} value={r.diet} onChange={e => handleResidentChange(i, 'diet', e.target.value)}>
                    <option value="VEGAN">VEGAN</option>
                    <option value="VEGETARIAN">VEGETARIAN</option>
                    <option value="NON_VEGETARIAN">NON_VEGETARIAN</option>
                    <option value="NO_RESTRICTION">NO_RESTRICTION</option>
                  </select>
                </td>
                <td style={styles.td}><input style={styles.input} value={r.allergens.join(',')} onChange={e => handleResidentChange(i, 'allergens', e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={styles.section}>
        <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid #0d6efd' }}>
          <label style={{ fontSize: '1.2em', fontWeight: 'bold', marginRight: '15px', color: '#212529' }}>Group Budget (₹):</label>
          <input style={{ ...styles.input, width: '150px', fontSize: '1.2em', fontWeight: 'bold', textAlign: 'center' }} type="number" value={budget} onChange={e => setBudget(e.target.value)} />
        </div>

        <h2 style={{ ...styles.h2, textAlign: 'center' }}>Dishes</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Cafe</th>
              <th style={styles.th}>Dish Name</th>
              <th style={styles.th}>Diet Class</th>
              <th style={styles.th}>Ingredients (comma separated)</th>
              <th style={styles.th}>Price</th>
            </tr>
          </thead>
          <tbody>
            {dishes.map((d, i) => (
              <tr key={i}>
                <td style={styles.td}><input style={{ ...styles.input, width: '50px' }} value={d.id} onChange={e => handleDishChange(i, 'id', e.target.value)} /></td>
                <td style={styles.td}><input style={styles.input} value={d.cafe} onChange={e => handleDishChange(i, 'cafe', e.target.value)} /></td>
                <td style={styles.td}><input style={styles.input} value={d.name} onChange={e => handleDishChange(i, 'name', e.target.value)} /></td>
                <td style={styles.td}>
                  <select style={styles.select} value={d.diet} onChange={e => handleDishChange(i, 'diet', e.target.value)}>
                    <option value="VEGAN">VEGAN</option>
                    <option value="VEGETARIAN">VEGETARIAN</option>
                    <option value="NON_VEGETARIAN">NON_VEGETARIAN</option>
                  </select>
                </td>
                <td style={styles.td}><input style={styles.input} value={d.ingredients.join(',')} onChange={e => handleDishChange(i, 'ingredients', e.target.value)} /></td>
                <td style={styles.td}><input style={{ ...styles.input, width: '70px' }} type="number" value={d.price} onChange={e => handleDishChange(i, 'price', e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: '25px' }}>
        <button style={styles.btnBlue} onClick={handleCalculate}>Calculate Compatibility</button>
        <button style={styles.btnGray} onClick={handleReset}>Sample/Reset</button>
      </section>

      {/* Results Area */}
      {error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}

      {result && !error && (
        <section style={styles.section}>
          <h2 style={styles.h2}>Compatibility Results</h2>

          <div style={{ padding: '15px', backgroundColor: '#e2e3e5', borderRadius: '4px', marginBottom: '20px', color: '#212529' }}>
            <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Overall Compatible Count: {result.compatibleDishes.length}</span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              style={{ padding: '12px 15px', width: '100%', border: '2px solid #0d6efd', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box', color: '#212529', backgroundColor: '#fff' }}
              type="text"
              placeholder="Search compatible dishes (cafe, name, ingredient)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <h3 style={{ color: '#212529', marginTop: '20px', marginBottom: '15px' }}>Compatible Dishes</h3>
          {filteredCompatibleDishes.length === 0 ? (
            <p>No compatible dishes match the search query.</p>
          ) : (
            <table style={{ ...styles.table, marginBottom: '20px' }}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Dish Name</th>
                  <th style={styles.th}>Cafe</th>
                  <th style={styles.th}>Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompatibleDishes.map(d => (
                  <tr key={d.id}>
                    <td style={styles.td}>{d.id}</td>
                    <td style={styles.td}>{d.name}</td>
                    <td style={styles.td}>{d.cafe}</td>
                    <td style={styles.td}>₹{d.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h3 style={{ color: '#212529', marginTop: '25px', marginBottom: '15px' }}>Excluded Dishes</h3>
          {result.excludedDishes.length === 0 ? (
            <p>No dishes were excluded.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Dish Name</th>
                  <th style={styles.th}>Exclusion Reasons</th>
                </tr>
              </thead>
              <tbody>
                {result.excludedDishes.map(e => (
                  <tr key={e.dish.id}>
                    <td style={styles.td}>{e.dish.id}</td>
                    <td style={styles.td}>{e.dish.name}</td>
                    <td style={styles.td}>
                      <span style={styles.reasonText}>{e.reasons.join(', ')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  );
}
