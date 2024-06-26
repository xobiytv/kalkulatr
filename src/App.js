import React, { useState, useRef } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
// import CircularProgress from '@mui/material/CircularProgress';
import 'tailwindcss/tailwind.css';
import { productOptions } from './API';

function App() {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    userName: '',
    productType: '',
    productSubType: '',
    productSoni: 0,
    productNarxi: 0,
    totalPaid: 0,
    plasticPayment: 0,
  });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [results, setResults] = useState([]);
  const [userName, setUserName] = useState('');
  const [inputs, setInputs] = useState([{ id: Date.now() }]);
  const [showPlasticPayment, setShowPlasticPayment] = useState(false);

  const calculateAndDisplayResult = () => {
    let totalSum = 0;
    let results = [];

    inputs.forEach(input => {
      const productType = formData[`productType_${input.id}`];
      const productSubType = formData[`productSubType_${input.id}`];
      const productSoni = parseInt(formData[`productSoni_${input.id}`]);
      const productNarxi = parseInt(formData[`productNarxi_${input.id}`]);

      if (productSoni && productNarxi) {
        const resultValue = productSoni * productNarxi;
        totalSum += resultValue;
        results.push({ productType, productSubType, productSoni, productNarxi, result: resultValue });
      }
    });

    setTotal(totalSum);
    setResults(results);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }, calculateAndDisplayResult);
  };

  const handleSaveValues = () => {
    calculateAndDisplayResult();
  };

  const addInput = () => {
    setInputs([...inputs, { id: Date.now() }]);
  };

  const shareResults = () => {
    const formattedResults = results.map(result => {
      return `${result.productType} ${result.productSubType}: ${result.productSoni} x ${result.productNarxi} = ${result.result} SUM\n`;
    }).join('');
    const userNam = `Mijoz ismi: ${userName}`;
    const currentDate = new Date().toLocaleString();
    const text = `Mijoz ma'lumotlari:\n${userNam}\nSana va vaqt: ${currentDate}\n\nMahsulotlar natijalari:\n${formattedResults}\nJami summa: ${total} SUM\nTo'langan summa: ${formData.totalPaid} SUM\nPlastik orqali to'langan: ${formData.plasticPayment} SUM\nQarzdorlik: ${total - formData.totalPaid - formData.plasticPayment} SUM`;

    if (navigator.share) {
      navigator.share({
        title: `${userNam}, Sizning mahsulotlar natijalaringiz`,
        text: text,
      })
        .then(() => console.log('Successfully shared'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      console.log('Web Share API is not supported.');
      // If Web Share API is not supported, copy the text to clipboard and alert the user
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          alert("Web Share API qo'llab-quvvatlanmaydi. Natijalar clipboard-ga nusxalandi.");
        }, (err) => {
          console.error('Error copying text: ', err);
          alert(text); // Fallback to alert if clipboard write fails
        });
      } else {
        alert(text);
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(formRef.current);

    // Append each input field to formData
    inputs.forEach((input) => {
      formData.append(`productType_${input.id}`, formData.get(`productType_${input.id}`));
      formData.append(`productSubType_${input.id}`, formData.get(`productSubType_${input.id}`));
      formData.append(`productSoni_${input.id}`, formData.get(`productSoni_${input.id}`));
      formData.append(`productNarxi_${input.id}`, formData.get(`productNarxi_${input.id}`));
    });

    try {
      const response = await fetch(e.target.action, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setLoading(false);
        // Handle successful form submission (e.g., clear form, show success message)
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };

  const totalAfterPayments = total - formData.totalPaid - formData.plasticPayment;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form id="FORM_ID" ref={formRef} method="POST" action="https://script.google.com/macros/s/AKfycby-VGERsnoSWj4v6ITlbR8S-gLKQfWCAyDXs1ZvOsjsK-_jK0taKSLrJI58h0IAxb7f/exec" className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4">Kankulatur</h1>

        <TextField
          label="Mijoz ismi"
          variant="outlined"
          fullWidth
          margin="normal"
          name="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />

        {inputs.map((input) => (
          <div key={input.id}>
            <div className="flex gap-4 items-end ">
              <TextField
                select
                label="Mahsulot Nomi"
                variant="outlined"
                fullWidth
                margin="normal"
                name={`productType_${input.id}`}
                value={formData[`productType_${input.id}`] || ''}
                onChange={handleInputChange}
                required
              >
                {productOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Mahsulot Turi"
                variant="outlined"
                fullWidth
                margin="normal"
                name={`productSubType_${input.id}`}
                value={formData[`productSubType_${input.id}`] || ''}
                onChange={handleInputChange}
                required
              >
                {productOptions.find((option) => option.id === formData[`productType_${input.id}`])?.subOptions.map((subOption) => (
                  <MenuItem key={subOption.id} value={subOption.id}>
                    {subOption.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div className="flex gap-4 items-end mb-4">
              <TextField
                label="Mahsulot Soni"
                variant="outlined"
                fullWidth
                margin="normal"
                name={`productSoni_${input.id}`}
                type="number"
                value={formData[`productSoni_${input.id}`] || 0}
                inputProps={{ min: 0 }}
                onChange={handleInputChange}
              />
              <TextField
                label="Narxi"
                variant="outlined"
                fullWidth
                margin="normal"
                name={`productNarxi_${input.id}`}
                type="number"
                value={formData[`productNarxi_${input.id}`] || 0}
                inputProps={{ min: 0 }}
                onChange={handleInputChange}
              />
            </div>
          </div>
        ))}


        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={addInput}
        >
          Tavar qo'shish
        </Button>

        <TextField
          label="Naqt to'lash"
          variant="outlined"
          fullWidth
          margin="normal"
          name="totalPaid"
          type="number"
          value={formData.totalPaid}
          inputProps={{ min: 0 }}
          onChange={handleInputChange}
        />

        {showPlasticPayment && (
          <TextField
            label="Plastik orqali to'lash"
            variant="outlined"
            fullWidth
            margin="normal"
            name="plasticPayment"
            type="number"
            value={formData.plasticPayment}
            inputProps={{ min: 0 }}
            onChange={handleInputChange}
            className="mt-4"
          />
        )}

        <div className='flex justify-between gap-4'>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            className="mt-4"
            onClick={() => setShowPlasticPayment(true)}
          >
            Plastik orqali to'lash
          </Button>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
            onClick={handleSaveValues}
          >
            Hisobni tekshirish
          </Button>
        </div>

        <div className="mt-6">
          {results.length > 0 && (
            <>
              <h2 className="text-xl font-bold mb-4">Chek: </h2>
              <div className='flex justify-between'>
                <b>Mijoz ismi: {userName}</b>
                <b>Sana va vaqt: {new Date().toLocaleString()}</b>
              </div>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border">Nomi</th>
                    <th className="py-2 px-4 border">Mahsulot turi</th>
                    <th className="py-2 px-4 border">Mahsulot hajmi</th>
                    <th className="py-2 px-4 border">Hisobi</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border">{result.productType}</td>
                      <td className="py-2 px-4 border">{result.productSubType}</td>
                      <td className="py-2 px-4 border">{result.productSoni} x {result.productNarxi}</td>
                      <td className="py-2 px-4 border">{result.result} SUM</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="2" className="py-2 px-4 border font-bold">Jami summa</td>
                    <td colSpan="2" className="py-2 px-4 border font-bold  text-end">{total} SUM</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="py-2 px-4 border font-bold">Naqt to'langan </td>
                    <td colSpan="2" className="py-2 px-4 border font-bold  text-end">{formData.totalPaid} SUM</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="py-2 px-4 border font-bold">Plastik orqali to'langan</td>
                    <td colSpan="2" className="py-2 px-4 border font-bold  text-end">{formData.plasticPayment} SUM</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="py-2 px-4 border font-bold">Qarzdorlik</td>
                    <td colSpan="2" className="py-2 px-4 border font-bold text-end">{totalAfterPayments} SUM</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="py-2 px-4 border text-center">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={shareResults}
                      >
                        Hisobni ulash
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>

        {loading && (
          <div className="flex justify-center mt-6">
            {/* <CircularProgress /> */}
            Yuklanmoqda...
          </div>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="mt-6"
        >
          Saqlash
        </Button>
      </form>
    </div>
  );
}

export default App;

