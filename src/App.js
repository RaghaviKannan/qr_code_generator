import logo from './logo.svg';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { useState } from 'react';
import { useFormik } from 'formik';

function App() {
  const [qrcode, setQrcode] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const formik = useFormik(
    {
      initialValues: {
        data: "",
        width: "",
        height: "",
        qrcolor: "",
        bgcolor: "",
        format: ""
      },
      validate: ({ data, width, height, format }) => {
        const err = {}
        if (!data) {
          err.data = "Enter a data"
        }
        if (width < 100 || height < 100) {
          err.size = "Enter a value of 100 or more"
        }
        if (height != width) {
          err.size = "Width and Height values should be equal"
        }
        if (format === "") {
          err.format = "Please select a format"
        }
        return err
      },
      onSubmit: ({ data, width, height, qrcolor, bgcolor, format }) => {

        const qrURL = `https://api.qrserver.com/v1/create-qr-code/?data=${data}&size=${width}x${height}&color=${qrcolor.slice(1)}&bgcolor=${bgcolor.slice(1)}&format=${format}`
        setQrcode(qrURL)
      }
    }
  )
  const downloadQRCode = async () => {
    try {
      const result = await fetch(qrcode)
      const file = await result.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(file)
      link.download = `qrcode.${formik.values.format}`
      link.click()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="App">
      <h1>QR Code Generator</h1>
      <div className='container'>
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); formik.handleSubmit() }}>
          <div className='row'>
            <div className='col-lg-6'>
              <h4>Details</h4>
              <div className='row'>
                <label style={{ padding: 0 }}>Enter the Data: </label>
                <input name="data" type={'text'} onChange={formik.handleChange} value={formik.values.data} className={'form-control'} />
                {submitted && formik.errors.data ? <span style={{ color: "red" }}>{formik.errors.data}</span> : null}
              </div>
              <div className='row'>
                <div className='col-lg-6' style={{ paddingLeft: 0 }}>
                  <label>Width:</label>
                  <input name="width" type={'number'} onChange={formik.handleChange} value={formik.values.width} className={'form-control'} />
                </div>
                <div className='col-lg-6' style={{ paddingRight: 0 }}>
                  <label>Height:</label>
                  <input name="height" type={'number'} onChange={formik.handleChange} value={formik.values.height} className={'form-control'} />
                </div>
              </div>
              {submitted && formik.errors.size ? <span style={{ color: "red" }}>{formik.errors.size}</span> : null}
              <div className='row'>
                <label style={{ padding: 0 }}>QR Color: </label>
                <input name="qrcolor" type={'color'} onChange={formik.handleChange} value={formik.values.qrcolor} className={'form-control'} style={{ padding: 0 }} />
              </div>
              <div className='row'>
                <label style={{ padding: 0 }}>Background Color: </label>
                <input name="bgcolor" type={'color'} onChange={formik.handleChange} value={formik.values.bgcolor} className={'form-control'} style={{ padding: 0 }} />
              </div>
              <div className='row'>
                <label style={{ padding: 0 }}>Format: </label>
                <select name="format" className={'form-control'} onChange={formik.handleChange} value={formik.values.format}>
                  <option disabled selected value={''}>--select--</option>
                  <option value={'jpg'}>JPG</option>
                  <option value={'png'}>PNG</option>
                  <option value={'svg'}>SVG</option>
                </select>
                {submitted && formik.errors.format ? <span style={{ color: "red" }}>{formik.errors.format}</span> : null}
              </div>
              <div className='row' style={{ marginTop: '10px' }}>
                <button className='btn btn-sm btn-success' type={'submit'} >Generate</button>
              </div>
              <div className='row' style={{ marginTop: '10px' }}>
                <button type={'button'} className='btn btn-sm btn-primary' onClick={downloadQRCode}>Download</button>
              </div>
            </div>
            <div className='col-lg-6' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h4 style={{ marginBottom: '30px' }}>QR Code </h4>
              <img className="qr-img" src={qrcode}></img>
            </div>
          </div>
        </form>
      </div>
    </div>

  );
}

export default App;


