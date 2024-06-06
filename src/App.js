import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import 'tailwindcss/tailwind.css';

function App() {
  const [formData, setFormData] = useState({
    userName: '',
    laminatSoni: 0,
    laminatNarxi: 0,
    akrelSoni: 0,
    akrelNarxi: 0,
    akrelKesishSoni: 0,
    akrelKesishNarxi: 0,
    xdpiSoni: 0,
    xdpiNarxi: 0,
    dsp6Soni: 0,
    dsp6Narxi: 0,
    dsp5Soni: 0,
    dsp5Narxi: 0,
    dvpSoni: 0,
    dvpNarxi: 0,
    oqDvpSoni: 0,
    oqDvpNarxi: 0,
    doskaSoni: 0,
    doskaNarxi: 0,
  });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [results, setResults] = useState([]);
  const [userName, setUserName] = useState('');

  const calculateAndDisplayResult = () => {
    const items = [
      { soni: 'laminatSoni', narxi: 'laminatNarxi' },
      { soni: 'akrelSoni', narxi: 'akrelNarxi' },
      { soni: 'akrelKesishSoni', narxi: 'akrelKesishNarxi' },
      { soni: 'xdpiSoni', narxi: 'xdpiNarxi' },
      { soni: 'dsp6Soni', narxi: 'dsp6Narxi' },
      { soni: 'dsp5Soni', narxi: 'dsp5Narxi' },
      { soni: 'dvpSoni', narxi: 'dvpNarxi' },
      { soni: 'oqDvpSoni', narxi: 'oqDvpNarxi' },
      { soni: 'doskaSoni', narxi: 'doskaNarxi' },
    ];

    let totalSum = 0;
    let results = [];

    items.forEach(item => {
      const soniValue = formData[item.soni];
      const narxiValue = formData[item.narxi];

      if (soniValue && narxiValue) {
        const resultValue = soniValue * narxiValue;
        totalSum += resultValue;
        results.push({ name: item.soni, soni: soniValue, narxi: narxiValue, result: resultValue });
      }
    });

    setTotal(totalSum);
    setResults(results);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'userName') {
      setUserName(value);
    } else {
      setFormData({ ...formData, [name]: value });
      calculateAndDisplayResult();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      userName: userName,
      soni: total,
      total,
      results,
    };

    try {
      const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (result.result === 'success') {
        alert('Ma\'lumotlar muvaffaqiyatli yuborildi!');
      } else {
        alert('Xatolik yuz berdi, iltimos yana urinib ko\'ring.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Xatolik yuz berdi, iltimos yana urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  const shareResults = () => {
    const formattedResults = results.map(result => {
      return `${result.name}: ${result.soni} x ${result.narxi} = ${result.result} SUM\n`;
    }).join('');
    const userNam = `Mijoz ismi: ${userName}`;
    const currentDate = new Date().toLocaleDateString();
    const text = `Mijoz ma'lumotlari:\n${userNam}\nSana: ${currentDate}\n\nMahsulotlar natijalari:\n${formattedResults}\nJami summa: ${total} SUM`;

    if (navigator.share) {
      navigator.share({
        title: `${userNam}, Sizning mahsulotlar natijalaringiz`,
        text: text,
      })
        .then(() => console.log('Successfully shared'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      console.log('Web Share API is not supported.');
      alert(text); // Fallback if Web Share API is not supported
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4">Kankulatur</h1>

        <TextField
          label="Mijoz ismi"
          variant="outlined"
          fullWidth
          margin="normal"
          name="userName"
          value={userName}
          onChange={handleInputChange}
          required
        />

        {[
          { id: 'laminat', label: 'Laminat' },
          { id: 'akrel', label: 'Akrel' },
          { id: 'akrelKesish', label: 'Akrel Kesish' },
          { id: 'xdpi', label: 'XDPI' },
          { id: 'dsp6', label: 'DSP6' },
          { id: 'dsp5', label: 'DSP5' },
          { id: 'dvp', label: 'DVP' },
          { id: 'oqDvp', label: 'Oq DVP' },
          { id: 'doska', label: 'Doska' },
        ].map((item) => (
          <div className="flex gap-4 items-end mb-4" key={item.id}>
            <TextField
              label={`${item.label} ob ketish (Soni)`}
              variant="outlined"
              fullWidth
              margin="normal"
              name={`${item.id}Soni`}
              type="number"
              value={formData[`${item.id}Soni`]}
              onChange={handleInputChange}
            />
            <TextField
              label="Narxi"
              variant="outlined"
              fullWidth
              margin="normal"
              name={`${item.id}Narxi`}
              type="number"
              value={formData[`${item.id}Narxi`]}
              onChange={handleInputChange}
            />
          </div>
        ))}
        <div className="mt-6">
          {results.length > 0 && (
            <>
              <h2 className="text-xl font-bold mb-4">Chek: </h2>
              <div className='flex justify-between'>
                <b>Mijoz ismi: {userName}</b>
                <b>Sana: {new Date().toLocaleDateString()}</b>
              </div>

              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border">Nomi</th>
                    <th className="py-2 px-4 border">Mahsulot hajmi</th>
                    <th className="py-2 px-4 border">Hisobi</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border">{result.name}</td>
                      <td className="py-2 px-4 border">{result.soni} x {result.narxi}</td>
                      <td className="py-2 px-4 border">{result.result} SUM</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="2" className="py-2 px-4 border font-bold">Jammi summa</td>
                    <td className="py-2 px-4 border font-bold">{total} SUM</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="py-2 px-4 border text-center">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => shareResults(results)}
                      >
                        Natijalarni Share qilish
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default App;
