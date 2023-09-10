import logo from './logo.svg';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useFormik } from 'formik';

function App() {
  const [qrcode, setQrcode] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      data: '',
      width: '',
      height: '',
      qrcolor: '#000000',
      bgcolor: '#ffffff',
      format: '',
    },
    validate: ({ data, width, height, format }) => {
      const errors = {};

      if (!data) {
        errors.data = 'Enter data';
      }

      if (width < 100 || height < 100) {
        errors.size = 'Enter a value of 100 or more';
      }

      if (height !== width) {
        errors.size = 'Width and Height values should be equal';
      }

      if (format === '') {
        errors.format = 'Please select a format';
      }

      return errors;
    },
    onSubmit: ({ data, width, height, qrcolor, bgcolor, format }) => {
      const qrURL = `https://api.qrserver.com/v1/create-qr-code/?data=${data}&size=${width}x${height}&color=${qrcolor.slice(
        1
      )}&bgcolor=${bgcolor.slice(1)}&format=${format}`;
      setQrcode(qrURL);
    },
  });

  const downloadQRCode = async () => {
    try {
      const result = await fetch(qrcode);
      const file = await result.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = `qrcode.${formik.values.format}`;
      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="mt-5 text-center" style={{color: "darkblue"}}>QR Code Generator</h1>
        <div className="row justify-content-center mt-4">
          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Details</h4>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                    formik.handleSubmit();
                  }}
                >
                  <div className="mb-3">
                    <label htmlFor="data" className="form-label">
                      Enter the Data:
                    </label>
                    <input
                      name="data"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.data}
                      className="form-control"
                    />
                    {submitted && formik.errors.data ? (
                      <span className="text-danger">{formik.errors.data}</span>
                    ) : null}
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <label>Width:</label>
                      <input
                        name="width"
                        type="number"
                        onChange={formik.handleChange}
                        value={formik.values.width}
                        className="form-control"
                      />
                    </div>
                    <div className="col-lg-6">
                      <label>Height:</label>
                      <input
                        name="height"
                        type="number"
                        onChange={formik.handleChange}
                        value={formik.values.height}
                        className="form-control"
                      />
                    </div>
                  </div>
                  {submitted && formik.errors.size ? (
                    <span className="text-danger">{formik.errors.size}</span>
                  ) : null}
                  <div className="mb-3">
                    <label htmlFor="qrcolor" className="form-label">
                      QR Color:
                    </label>
                    <input
                      name="qrcolor"
                      type="color"
                      onChange={formik.handleChange}
                      value={formik.values.qrcolor}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bgcolor" className="form-label">
                      Background Color:
                    </label>
                    <input
                      name="bgcolor"
                      type="color"
                      onChange={formik.handleChange}
                      value={formik.values.bgcolor}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="format" className="form-label">
                      Format:
                    </label>
                    <select
                      name="format"
                      className="form-control"
                      onChange={formik.handleChange}
                      value={formik.values.format}
                    >
                      <option disabled value="">
                        -- Select --
                      </option>
                      <option value="jpg">JPG</option>
                      <option value="png">PNG</option>
                      <option value="svg">SVG</option>
                    </select>
                    {submitted && formik.errors.format ? (
                      <span className="text-danger">{formik.errors.format}</span>
                    ) : null}
                  </div>
                  <div className="text-center">
                    <button className="btn btn-success" type="submit">
                      Generate
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{marginLeft: '10px'}}
                      onClick={downloadQRCode}
                    >
                      Download
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mt-4 mt-lg-0">
            <div className="card">
              <div className="card-body text-center">
                <h4 className="card-title">QR Code</h4>
                <div className='qr-code-container'>
                <img className="img-fluid"
                  src={submitted ? qrcode : ''}
                  alt="QR Code"
                  style={{ display: submitted || qrcode ? 'block' : 'none' }}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
